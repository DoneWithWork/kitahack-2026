import { CallGemini, CallGeminiWithTool } from "@/lib/ai";
import { adminDb } from "@/lib/firebase/admin";
import {
  scholarshipPromptOne,
  scholarshipPromptTwo,
} from "@/lib/scholarships/constants";
import { scholarshipSchema } from "@/lib/schemas/application.schema";
import type { Scholarship } from "@/lib/schemas/application.schema";
import { protectedProcedure, router } from "@/lib/trpc/server";
import z from "zod";

/**
 * Loose extraction schema for AI output — we validate the canonical
 * shape after enriching with sourceUrl / timestamps.
 */
const scrapedScholarshipSchema = z.object({
  title: z.string(),
  provider: z.string().optional(),
  providerUrl: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  eligibility: z.string().optional(),
  description: z.string(),
  applicationLink: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  studyLevel: z.array(z.string()).optional(),
  fieldOfStudy: z.string().optional(),
  sourceUrl: z.string().optional(),
  risk: z
    .object({
      upfrontPayment: z.boolean(),
      noRequirements: z.boolean(),
      guaranteedApproval: z.boolean(),
      suspiciousOffer: z.boolean(),
      missingContactInfo: z.boolean(),
      riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    })
    .optional(),
  uid: z.string().optional(),
});

const scrapeSchema = z.object({
  search: z.string(),
  filters: z.array(z.string()).optional(),
});

const urlsSchema = z.array(
  z.object({
    sourceUrl: z.string(),
    scholarshipLinks: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    ),
  }),
);

async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    return response.ok;
  } catch {
    return false;
  }
}

export const scholarshipScrapeRouter = router({
  scrape: protectedProcedure
    .input(scrapeSchema)
    .mutation(async ({ input }) => {
      try {
        const urlsResponse = await CallGeminiWithTool({
          prompt: scholarshipPromptOne.replace("{{SEARCH_TERM}}", input.search),
          schema: urlsSchema,
        });

        const links = urlsResponse.flatMap((response) =>
          response.scholarshipLinks.map((link) => link.url),
        );

        const validLinks: string[] = [];
        for (const url of links) {
          const isValid = await validateUrl(url);
          if (isValid) {
            validLinks.push(url);
          }
        }

        const scholarshipResults: Scholarship[] = [];

        for (const url of validLinks) {
          const scholarship = await CallGemini({
            prompt: scholarshipPromptTwo.replace("{{SCHOLARSHIP_URL}}", url),
            schema: scrapedScholarshipSchema,
          });
          const parsed = scrapedScholarshipSchema.safeParse(scholarship);
          if (!parsed.success) {
            console.log("Parse failed:", parsed.error);
            continue;
          }

          const now = new Date().toISOString();
          const canonical = scholarshipSchema.safeParse({
            ...parsed.data,
            sourceUrl: url,
            createdAt: now,
            updatedAt: now,
            status: "open",
          });

          if (!canonical.success) {
            console.log("Canonical parse failed:", canonical.error);
            continue;
          }

          scholarshipResults.push(canonical.data);
        }

        const batch = adminDb().batch();
        const collectionRef = adminDb().collection("scholarships");

        for (const scholarship of scholarshipResults) {
          const docRef = collectionRef.doc();

          batch.set(docRef, {
            ...scholarship,
            uid: docRef.id,
          });
        }

        await batch.commit();
        return { success: true, count: scholarshipResults.length };
      } catch (e) {
        console.error("Scraping failed", e);
        throw new Error("Scraping failed");
      }
    }),
});

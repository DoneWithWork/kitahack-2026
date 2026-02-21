import { CallGemini, CallGeminiWithTool } from "@/lib/ai";
import { adminDb } from "@/lib/firebase/admin";
import {
  scholarshipPromptOne,
  scholarshipPromptTwo,
  ScholarshipSchema,
} from "@/lib/scholarships/constants";
import { protectedProcedure, router } from "@/lib/trpc/server";
import z from "zod";

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
    .mutation(async ({ ctx, input }) => {
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

        const scholarshipResults: z.infer<typeof ScholarshipSchema>[] = [];

        for (const url of validLinks) {
          const scholarship = await CallGemini({
            prompt: scholarshipPromptTwo.replace("{{SCHOLARSHIP_URL}}", url),
            schema: ScholarshipSchema,
          });
          const parsed = ScholarshipSchema.safeParse(scholarship);
          if (!parsed.success) {
            console.log("Parse failed:", parsed.error);
            continue;
          }

          scholarshipResults.push({
            ...parsed.data,
            sourceUrl: url,
          });
        }

        const batch = adminDb().batch();
        const collectionRef = adminDb().collection("scholarships");

        for (const scholarship of scholarshipResults) {
          const docRef = collectionRef.doc();

          batch.set(docRef, {
            ...scholarship,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

import { getEmbedding } from "@/lib/ai/embeddings";
import {
  getAllScholarships,
  getScholarship,
} from "@/lib/repositories/scholarships.repo";
import { getUserApplicationsAll } from "@/lib/repositories/application.repo";
import { getTranscript } from "@/lib/repositories/transcripts.repo";
import {
  scholarshipInputSchema,
  scholarshipSchema,
  scholarshipSearchFiltersSchema,
} from "@/lib/schemas/scholarship.schema";
import { checkEligibility } from "@/lib/services/eligibility.service";
import { parseScholarshipText } from "@/lib/services/parsing.service";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

export const scholarshipRouter = router({
  /**
   * Combined endpoint for the scholarships page.
   * Fetches scholarships ONCE, then runs eligibility checks and
   * application lookups in parallel — replacing three separate queries
   * and eliminating the N+1 loop that was causing ~10s load times.
   *
   * Before:  3 x getAllScholarships() + N sequential application queries
   * After:   1 x getAllScholarships() + 1 collectionGroup query + 1 transcript read (parallel)
   */
  getPageData: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user!;

    // Single fetch of all scholarships
    const scholarships = await getAllScholarships();

    // Run transcript fetch + application lookup in parallel
    const [transcript, userApps] = await Promise.all([
      getTranscript(user.uid).catch(() => {
        logger.warn(
          { uid: user.uid },
          "Could not fetch transcript for eligibility check",
        );
        return null;
      }),
      getUserApplicationsAll(user.uid).catch((err) => {
        logger.error(
          { uid: user.uid, error: err },
          "Could not fetch user applications",
        );
        return [] as Awaited<ReturnType<typeof getUserApplicationsAll>>;
      }),
    ]);

    // Eligibility checks are CPU-only (no I/O), run synchronously
    const eligibility: Record<
      string,
      {
        eligible: boolean;
        reasons: string[];
        gradeDetails?: {
          userGradeCounts: Record<string, number>;
          rawGradeCounts: Record<string, number>;
          requiredGradeCounts: Record<string, number>;
          extractedCGPA: number | null;
          userGPA: number | null;
          requiredCGPA: number | null;
        };
      }
    > = {};

    for (const scholarship of scholarships) {
      if (!scholarship.uid) continue;
      eligibility[scholarship.uid] = checkEligibility(
        user,
        transcript,
        scholarship,
      );
    }

    // Map applications to the format the page expects
    const applications = userApps.map((a) => ({
      scholarshipId: a.scholarshipId,
      applicationId: a.applicationId,
      status: a.application.status,
      currentStage: a.application.currentStage,
    }));

    return {
      scholarships,
      eligibility,
      applications,
      hasTranscript: transcript !== null,
      subjectCount: transcript?.subjects?.length ?? 0,
      userGPA: user.gpa ?? null,
    };
  }),

  getAll: protectedProcedure.query(async () => {
    return await getAllScholarships();
  }),

  checkEligibility: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user!;
    const scholarships = await getAllScholarships();
    let transcript = null;

    try {
      transcript = await getTranscript(user.uid);
    } catch {
      logger.warn({ uid: user.uid }, "Could not fetch transcript for eligibility check");
    }

    const results: Record<string, {
      eligible: boolean;
      reasons: string[];
      gradeDetails?: {
        userGradeCounts: Record<string, number>;
        rawGradeCounts: Record<string, number>;
        requiredGradeCounts: Record<string, number>;
        extractedCGPA: number | null;
        userGPA: number | null;
        requiredCGPA: number | null;
      };
    }> = {};

    for (const scholarship of scholarships) {
      if (!scholarship.uid) continue;
      const result = checkEligibility(user, transcript, scholarship);
      results[scholarship.uid] = result;
    }

    return {
      eligibility: results,
      hasTranscript: transcript !== null,
      subjectCount: transcript?.subjects?.length ?? 0,
      userGPA: user.gpa ?? null,
    };
  }),

  search: protectedProcedure
    .input(scholarshipSearchFiltersSchema)
    .query(async () => {}),

  getByField: protectedProcedure
    .input(z.object({ field: z.string() }))
    .query(async () => {}),

  getUrgent: protectedProcedure.query(async () => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getScholarship(input.id);
    }),

  create: protectedProcedure
    .input(scholarshipInputSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();

      const embeddingText = `${input.title} ${input.description} ${input.provider} ${input.fieldsAllowed?.join(" ") || ""}`;
      let embedding: number[] | undefined;

      try {
        embedding = await getEmbedding(embeddingText);
      } catch (error) {
        logger.error({ error }, "Failed to generate embedding for scholarship");
      }

      const scholarship = scholarshipSchema.parse({
        ...input,
        uid: id,
        embedding,
        createdAt: now(),
        updatedAt: now(),
      });

      return { success: true, scholarship };
    }),

  parseFromText: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const extracted = await parseScholarshipText(input.text);
      return { success: true, extracted };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: scholarshipInputSchema.partial(),
      }),
    )
    .mutation(async () => {
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),
});

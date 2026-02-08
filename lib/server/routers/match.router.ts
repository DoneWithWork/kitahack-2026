
import { router, protectedProcedure } from "@/lib/trpc/server";
import { getUser } from "@/lib/repositories/users.repo";
import { getTranscript } from "@/lib/repositories/transcripts.repo";
import {
  getAllScholarships,
} from "@/lib/repositories/scholarships.repo";
import { createMatch, getMatches } from "@/lib/repositories/applications.repo";
import { matchSchema } from "@/lib/schemas/ai.schema";
import { calculateMatchScore } from "@/lib/services/matching.service";
import { now } from "@/lib/utils/dates";
import { logger } from "@/lib/utils/logger";

export const matchRouter = router({
  getMatches: protectedProcedure.query(async ({ ctx }) => {
    return await getMatches(ctx.user!.uid);
  }),

  calculateMatches: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await getUser(ctx.user!.uid);
    const transcript = await getTranscript(ctx.user!.uid);
    const scholarships = await getAllScholarships();

    if (!user) {
      throw new Error("User not found");
    }

    const matches = await Promise.all(
      scholarships.map(async (scholarship) => {
        try {
          const score = await calculateMatchScore(user, transcript, scholarship);
          
          const match = matchSchema.parse({
            uid: ctx.user!.uid,
            scholarshipId: scholarship.id,
            eligible: score.eligible,
            reasons: score.reasons,
            score: score.score,
            similarity: score.similarity,
            calculatedAt: now(),
          });

          await createMatch(ctx.user!.uid, match);
          return match;
        } catch (error) {
          logger.error({ error, scholarshipId: scholarship.id }, "Error calculating match");
          return null;
        }
      })
    );

    const validMatches = matches.filter((m): m is NonNullable<typeof m> => m !== null);
    
    return {
      success: true,
      matches: validMatches.sort((a, b) => b.score - a.score),
    };
  }),

  getEligibleCount: protectedProcedure.query(async ({ ctx }) => {
    const matches = await getMatches(ctx.user!.uid);
    const eligible = matches.filter((m) => m.eligible);
    return {
      total: matches.length,
      eligible: eligible.length,
    };
  }),
});

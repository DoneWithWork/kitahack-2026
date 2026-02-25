import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import { getUser } from "@/lib/repositories/users.repo";
import { getScholarship } from "@/lib/repositories/scholarships.repo";
import {
  generateEssayDraft,
  refineEssay,
  generateInterviewQuestions,
  generateInterviewAnswer,
} from "@/lib/services/assistant.service";

export const assistantRouter = router({
  generateEssay: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUser(ctx.user!.uid);
      const scholarship = await getScholarship(input.scholarshipId);

      if (!user || !scholarship) {
        throw new Error("User or scholarship not found");
      }
      const essay = await generateEssayDraft(user, scholarship, input.prompt);
      return { success: true, essay };
    }),

  refineEssay: protectedProcedure
    .input(
      z.object({
        currentEssay: z.string(),
        feedback: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const refined = await refineEssay(input.currentEssay, input.feedback);
      return { success: true, refined };
    }),

  getInterviewQuestions: protectedProcedure
    .input(z.object({ scholarshipId: z.string() }))
    .mutation(async ({ input }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new Error("Scholarship not found");
      }

      const questions = await generateInterviewQuestions(scholarship);
      return { success: true, questions };
    }),

  getInterviewAnswer: protectedProcedure
    .input(
      z.object({
        question: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUser(ctx.user!.uid);

      if (!user) {
        throw new Error("User not found");
      }

      const answer = await generateInterviewAnswer(user, input.question);
      return { success: true, answer };
    }),
});

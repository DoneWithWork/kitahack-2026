import { getAdminDb } from "@/lib/firebase/admin";
import { updateUser } from "@/lib/repositories/users.repo";
import { onboardingProfileSchema } from "@/lib/schemas/user.schema";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import { z } from "zod";
export const onboardingRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const docRef = getAdminDb().collection("users").doc(ctx.user!.uid);
    const userDoc = await docRef.get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const user = userDoc.data();
    console.log("Onboarding status for user:", user);
    if (!user) throw new Error("User data is undefined");
    return {
      onboardingCompleted: user.onboardingCompleted || false,
      onboardingStep: user.onboardingStep || 0,
      profileComplete: !!(
        user.currentSchool &&
        user.graduationYear &&
        user.targetField &&
        user.incomeBracket &&
        user.interests?.length > 0
      ),
      documentsUploaded: user.documentsUploaded || false,
      transcriptUploaded: user.transcriptUploaded || false,
    };
  }),

  saveProfile: protectedProcedure
    .input(onboardingProfileSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("user:", ctx.user);
      const uid = ctx.user!.uid;

      await updateUser(ctx.user!.uid, {
        ...input,
        onboardingStep: 2,
        updatedAt: now(),
      });

      return { success: true };
    }),

  saveTranscriptStatus: protectedProcedure
    .input(z.object({ uploaded: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        transcriptUploaded: input.uploaded,
        onboardingStep: input.uploaded ? 3 : 2,
        updatedAt: now(),
      });

      return { success: true };
    }),

  saveDocumentsStatus: protectedProcedure
    .input(z.object({ uploaded: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        documentsUploaded: input.uploaded,
        onboardingStep: input.uploaded ? 4 : 3,
        updatedAt: now(),
      });

      return { success: true };
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await updateUser(ctx.user!.uid, {
      onboardingCompleted: true,
      onboardingStep: 5,
      updatedAt: now(),
    });

    return { success: true };
  }),
});

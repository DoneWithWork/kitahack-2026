import { getAdminDb } from "@/lib/firebase/admin";
import { getUser, updateUser } from "@/lib/repositories/users.repo";
import { onboardingProfileSchema } from "@/lib/schemas/user.schema";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { z } from "zod";
export const onboardingRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const auth = getAuth();
    const authUser = auth.currentUser;
    const uid = authUser?.uid;
    console.log(uid);
    if (!uid) return {};
    const docRef = getAdminDb().collection("users").doc(uid);
    const userDoc = await docRef.get();
    console.log("hi", userDoc);
    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const user = userDoc.data();
    if (!user) return {};
    return {
      onboardingCompleted: user.onboardingCompleted || false,
      onboardingStep: user.onboardingStep || 0,
      profileComplete: !!(
        user.citizenship &&
        user.incomeBracket &&
        user.educationLevel &&
        user.fieldOfStudy &&
        user.interests?.length > 0
      ),
      documentsUploaded: user.documentsUploaded || false,
      transcriptUploaded: user.transcriptUploaded || false,
    };
  }),

  saveProfile: protectedProcedure
    .input(onboardingProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const auth = getAuth(getApp());
      const authUser = auth.currentUser;
      const uid = authUser?.uid;
      console.log(uid);
      if (!uid) return {};

      await updateUser(ctx.user!.uid, {
        ...input,
        onboardingStep: 1,
        updatedAt: now(),
      });

      return { success: true };
    }),

  saveTranscriptStatus: protectedProcedure
    .input(z.object({ uploaded: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        transcriptUploaded: input.uploaded,
        onboardingStep: input.uploaded ? 2 : 1,
        updatedAt: now(),
      });

      return { success: true };
    }),

  saveDocumentsStatus: protectedProcedure
    .input(z.object({ uploaded: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        documentsUploaded: input.uploaded,
        onboardingStep: input.uploaded ? 3 : 2,
        updatedAt: now(),
      });

      return { success: true };
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await updateUser(ctx.user!.uid, {
      onboardingCompleted: true,
      onboardingStep: 4,
      updatedAt: now(),
    });

    return { success: true };
  }),
});

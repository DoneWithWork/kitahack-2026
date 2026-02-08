import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/server";
import { createUser, getUser } from "@/lib/repositories/users.repo";
import { userSchema } from "@/lib/schemas/user.schema";
import { now } from "@/lib/utils/dates";

export const authenticationRouter = router({
  signIn: publicProcedure
    .input(
      z.object({
        uid: z.string(),
        email: z.string().email(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getUser(input.uid);

      if (!existing) {
        const newUser = userSchema.parse({
          ...input,
          interests: [],
          onboardingCompleted: false,
          onboardingStep: 0,
          documentsUploaded: false,
          transcriptUploaded: false,
          createdAt: now(),
          updatedAt: now(),
        });
        await createUser(newUser);
        ctx.user = newUser;
        return { success: true, user: newUser, isNew: true };
      }

      // Check if user needs to complete onboarding
      const needsOnboarding = !existing.onboardingCompleted;

      return { success: true, user: existing, isNew: needsOnboarding };
    }),

  getUser: publicProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ input }) => {
      const user = await getUser(input.uid);
      return user;
    }),
});

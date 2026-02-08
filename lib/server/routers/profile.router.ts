import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import { getUser, updateUser } from "@/lib/repositories/users.repo";
import { userProfileUpdateSchema } from "@/lib/schemas/user.schema";
import { now } from "@/lib/utils/dates";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUser(ctx.user!.uid);
    return user;
  }),

  update: protectedProcedure
    .input(userProfileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        ...input,
        updatedAt: now(),
      });
      return { success: true };
    }),

  updateInterests: protectedProcedure
    .input(
      z.object({
        interests: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user!.uid, {
        interests: input.interests,
        updatedAt: now(),
      });
      return { success: true };
    }),
});

import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { User } from "@/lib/schemas/user.schema";

export const createContext = cache(async () => {
  return {
    adminAuth: adminAuth(),
    adminDb: adminDb(),
    user: null as User | null,
  };
});

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

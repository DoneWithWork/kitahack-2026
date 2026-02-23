import { initTRPC, TRPCError } from "@trpc/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getUser, createUser } from "@/lib/repositories/users.repo";
import { userSchema, type User } from "@/lib/schemas/user.schema";

type CreateContextOpts = {
  req: Request;
};

export async function createContext({ req }: CreateContextOpts) {
  let user: User | null = null;

  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const decoded = await adminAuth().verifyIdToken(token);

      const uid = decoded.uid;
      const email = decoded.email ?? "";

      let existing = await getUser(uid);

      if (!existing) {
        const newUser = userSchema.parse({
          uid,
          email,
          name: decoded.name ?? email.split("@")[0] ?? "User",
          interests: [],
          onboardingCompleted: false,
          onboardingStep: 0,
          documentsUploaded: false,
          transcriptUploaded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await createUser(newUser);
        existing = newUser;
      }

      user = existing;
    } catch {
      user = null;
    }
  }

  return {
    user,
    adminAuth: adminAuth(),
    adminDb: adminDb(),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type ProtectedContext = Context & { user: NonNullable<Context["user"]> };

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  console.log("ctx.user in protectedProcedure:", ctx.user);
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: ctx as ProtectedContext });
});

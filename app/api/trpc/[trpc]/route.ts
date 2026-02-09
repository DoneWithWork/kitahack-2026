import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/lib/trpc/router";
import { createContext } from "@/lib/trpc/server";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (ctx) =>
      // Forward the request object to our TRPC context creator so per-request
      // auth can be performed on the server.
      createContext({ req: (ctx as any)?.req ?? req }),
  });

export { handler as GET, handler as POST };

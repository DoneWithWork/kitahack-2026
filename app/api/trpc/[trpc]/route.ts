import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/lib/trpc/router";
import { createContext } from "@/lib/trpc/server";

type CreateContextOpts = {
  req: Request;
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (ctx: CreateContextOpts | undefined) =>
      createContext({ req: ctx?.req ?? req }),
  });

export { handler as GET, handler as POST };

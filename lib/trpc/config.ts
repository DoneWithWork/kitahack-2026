import { httpBatchLink } from "@trpc/client";

export const trpcClientConfig = {
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
};

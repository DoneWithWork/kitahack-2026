import { router } from "./server";
import { authenticationRouter } from "@/lib/server/routers/auth.router";
import { profileRouter } from "@/lib/server/routers/profile.router";
import { scholarshipRouter } from "@/lib/server/routers/scholarship.router";
import { transcriptRouter } from "@/lib/server/routers/transcript.router";
import { matchRouter } from "@/lib/server/routers/match.router";
import { assistantRouter } from "@/lib/server/routers/assistant.router";
import { workflowRouter } from "@/lib/server/routers/workflow.router";
import { documentRouter } from "@/lib/server/routers/document.router";
import { onboardingRouter } from "@/lib/server/routers/onboarding.router";
import { scholarshipScrapeRouter } from "../server/routers/scrape.route";

export const appRouter = router({
  authentication: authenticationRouter,
  profile: profileRouter,
  scholarship: scholarshipRouter,
  scrape: scholarshipScrapeRouter,
  transcript: transcriptRouter,
  match: matchRouter,
  assistant: assistantRouter,
  workflow: workflowRouter,
  document: documentRouter,
  onboarding: onboardingRouter,
});

export type AppRouter = typeof appRouter;

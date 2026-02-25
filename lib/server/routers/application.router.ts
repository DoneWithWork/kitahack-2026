import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import {
  getScholarship,
  getAllScholarships,
} from "@/lib/repositories/scholarships.repo";
import {
  createApplicationInScholarship,
  getApplicationById,
  updateApplicationById,
  getUserApplicationsForScholarship,
  getApplicationByApplicationId,
} from "@/lib/repositories/application.repo";

const getApplicationWithScholarship = async (applicationId: string) => {
  const result = await getApplicationByApplicationId(applicationId);
  if (!result) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Application not found",
    });
  }
  const scholarship = await getScholarship(result.scholarshipId);
  if (!scholarship) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Scholarship not found",
    });
  }
  return {
    application: result.application,
    scholarship,
    scholarshipId: result.scholarshipId,
  };
};
import { generateText } from "@/lib/ai";

export const applicationRouter = router({
  checkApplicationStatus: protectedProcedure
    .input(z.object({ scholarshipId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await getUserApplicationsForScholarship(
        ctx.user.uid,
        input.scholarshipId,
      );

      if (!result) {
        return null;
      }

      return {
        applicationId: result.applicationId,
        scholarshipId: result.application.scholarshipId,
        status: result.application.status,
        currentStage: result.application.currentStage,
      };
    }),

  getUserApplications: protectedProcedure.query(async ({ ctx }) => {
    const scholarships = await getAllScholarships();
    const results: Array<{
      scholarshipId: string;
      applicationId: string;
      status: string;
      currentStage: string;
    }> = [];

    for (const scholarship of scholarships) {
      const result = await getUserApplicationsForScholarship(
        ctx.user.uid,
        scholarship.uid!,
      );
      if (result) {
        results.push({
          scholarshipId: result.application.scholarshipId,
          applicationId: result.applicationId,
          status: result.application.status,
          currentStage: result.application.currentStage,
        });
      }
    }

    return results;
  }),

  startApplication: protectedProcedure
    .input(z.object({ scholarshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      if (scholarship.status !== "open") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scholarship is not open for applications",
        });
      }

      const now = new Date();
      const openingDate = new Date(scholarship.openingDate);
      const closingDate = new Date(scholarship.closingDate);

      if (now < openingDate || now > closingDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scholarship is not currently accepting applications",
        });
      }

      // Bypassed for testing - TODO: Re-enable for production
      // const transcript = await getTranscript(ctx.user.uid);
      // const meetsGradeRequirement = checkGradeEligibility(transcript, scholarship);
      // if (!meetsGradeRequirement) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "You do not meet the grade requirements for this scholarship",
      //   });
      // }

      const existingAppResult = await getUserApplicationsForScholarship(
        ctx.user.uid,
        input.scholarshipId,
      );

      if (existingAppResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied for this scholarship",
        });
      }

      const applicationId = crypto.randomUUID();
      const nowISO = new Date().toISOString();

      const application = {
        userId: ctx.user.uid,
        scholarshipId: input.scholarshipId,
        status: "in_progress" as const,
        currentStage: "essay" as const,
        eligibilitySnapshot: {
          meetsGradeRequirement: true,
          checkedAt: nowISO,
        },
        stages: {
          essay: {
            draft: "",
            submitted: false,
            checked: false,
            passed: false,
            reviewerNotes: null,
            aiUsed: false,
            aiHistory: [],
          },
          group: {
            checked: false,
            passed: false,
            reviewerNotes: null,
            aiPreparationUsed: false,
            aiHistory: [],
          },
          interview: {
            status: "pending" as const,
            checked: false,
            passed: false,
            reviewerNotes: null,
            aiPreparationGenerated: false,
            aiHistory: [],
            interviewer: null,
            scheduledAt: null,
            reflectionNotes: null,
          },
        },
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      await createApplicationInScholarship(
        input.scholarshipId,
        applicationId,
        application,
      );

      return { applicationId, scholarship };
    }),

  getApplicationById: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string().optional(),
        applicationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      let application;
      let scholarshipId = input.scholarshipId;

      if (!scholarshipId) {
        const result = await getApplicationByApplicationId(input.applicationId);
        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
        application = result.application;
        scholarshipId = result.scholarshipId;
      } else {
        application = await getApplicationById(
          scholarshipId,
          input.applicationId,
        );
        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }
      }

      const scholarship = await getScholarship(scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      return { application, scholarship };
    }),

  saveEssayDraft: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
        draft: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.userId !== ctx.user.uid) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this application",
        });
      }

      if (application.currentStage !== "essay") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot save essay draft at current stage",
        });
      }

      if (application.stages.essay.checked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Essay has already been reviewed",
        });
      }

      await updateApplicationById(input.scholarshipId, input.applicationId, {
        stages: {
          ...application.stages,
          essay: {
            ...application.stages.essay,
            draft: input.draft,
          },
        },
      });

      return { success: true };
    }),

  submitEssay: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
        draft: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.userId !== ctx.user.uid) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this application",
        });
      }

      if (application.currentStage !== "essay") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot submit essay at current stage",
        });
      }

      const currentDraft = input.draft || application.stages.essay.draft;
      if (!currentDraft || currentDraft.trim() === "") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Essay draft is empty",
        });
      }

      if (application.stages.essay.submitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Essay has already been submitted",
        });
      }

      await updateApplicationById(input.scholarshipId, input.applicationId, {
        stages: {
          ...application.stages,
          essay: {
            ...application.stages.essay,
            draft: currentDraft,
            submitted: true,
          },
        },
      });

      return { success: true };
    }),

  reviewEssay: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
        passed: z.boolean(),
        reviewerNotes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const updateData: Record<string, unknown> = {
        stages: {
          ...application.stages,
          essay: {
            ...application.stages.essay,
            checked: true,
            passed: input.passed,
            reviewerNotes: input.reviewerNotes || null,
          },
        },
      };

      if (input.passed) {
        updateData.status = "essay_passed";
        updateData.currentStage = "group";
      } else {
        updateData.status = "rejected";
      }

      await updateApplicationById(
        input.scholarshipId,
        input.applicationId,
        updateData as Parameters<typeof updateApplicationById>[2],
      );

      return { success: true };
    }),

  reviewGroupStage: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
        passed: z.boolean(),
        reviewerNotes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const updateData: Record<string, unknown> = {
        stages: {
          ...application.stages,
          group: {
            ...application.stages.group,
            checked: true,
            passed: input.passed,
            reviewerNotes: input.reviewerNotes || null,
          },
        },
      };

      if (input.passed) {
        updateData.status = "group_passed";
        updateData.currentStage = "interview";
      } else {
        updateData.status = "rejected";
      }

      await updateApplicationById(
        input.scholarshipId,
        input.applicationId,
        updateData as Parameters<typeof updateApplicationById>[2],
      );

      return { success: true };
    }),

  reviewInterviewStage: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
        passed: z.boolean(),
        reviewerNotes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const updateData: Record<string, unknown> = {
        stages: {
          ...application.stages,
          interview: {
            ...application.stages.interview,
            checked: true,
            passed: input.passed,
            reviewerNotes: input.reviewerNotes || null,
          },
        },
      };

      if (input.passed) {
        updateData.status = "accepted";
      } else {
        updateData.status = "rejected";
      }

      await updateApplicationById(
        input.scholarshipId,
        input.applicationId,
        updateData as Parameters<typeof updateApplicationById>[2],
      );

      return { success: true };
    }),

  getEssayAssistance: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        currentDraft: z.string(),
        applicationId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      const systemInstruction = `You are a writing coach. Provide short, actionable nudges. Do not write the essay. Keep it concise.`;

      let prompt = `You are assisting a student writing a scholarship essay.

Scholarship Title:
${scholarship.title}

Scholarship Description:
${scholarship.description}

Benefits:
${scholarship.benefits.map((b) => `- ${b}`).join("\n")}

Essay Question:
${scholarship.essayQuestion}

Using the scholarship's official website (${scholarship.sourceUrl}), generate:

1. 3-5 key points the student should address
2. 2-3 tone or structure nudges
3. 2 quick questions the student should answer in the essay

Keep it under 120 words. No full sentences longer than 18 words.`;

      if (input.currentDraft && input.currentDraft.trim() !== "") {
        prompt = `You are assisting a student writing a scholarship essay.

Scholarship Title:
${scholarship.title}

Scholarship Description:
${scholarship.description}

Benefits:
${scholarship.benefits.map((b) => `- ${b}`).join("\n")}

Essay Question:
${scholarship.essayQuestion}

Current Draft:
${input.currentDraft}

Using the scholarship's official website (${scholarship.sourceUrl}):

1. 2 strengths in the draft
2. 3 concise improvement nudges
3. 2 clarifying questions for the student

Keep it under 120 words. Do not rewrite the draft.`;
      }

      const result = await generateText({
        prompt,
        systemInstruction,
        model: "gemini-2.5-flash-lite",
      });

      if (input.applicationId) {
        const application = await getApplicationById(
          input.scholarshipId,
          input.applicationId,
        );

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }

        if (application.userId !== ctx.user.uid) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not authorized to update this application",
          });
        }

        await updateApplicationById(input.scholarshipId, input.applicationId, {
          stages: {
            ...application.stages,
            essay: {
              ...application.stages.essay,
              aiUsed: true,
              aiHistory: [
                ...(application.stages.essay.aiHistory ?? []),
                {
                  id: crypto.randomUUID(),
                  type: "essay",
                  title: input.currentDraft.trim()
                    ? "Draft feedback"
                    : "Essay suggestions",
                  response: result,
                  createdAt: now(),
                },
              ],
            },
          },
        });
      }

      return { assistance: result };
    }),

  getGroupStage: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      if (application.currentStage !== "group") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the group stage",
        });
      }

      return {
        application,
        scholarship,
      };
    }),

  markGroupPreparationUsed: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.currentStage !== "group") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the group stage",
        });
      }

      await updateApplicationById(input.scholarshipId, input.applicationId, {
        stages: {
          ...application.stages,
          group: {
            ...application.stages.group,
            aiPreparationUsed: true,
          },
        },
      });

      return { success: true };
    }),

  getGroupAssistance: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        assistanceType: z.enum(["breakdown", "slides", "strategy"]),
        applicationId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      const systemInstruction = `You are assisting a scholarship candidate preparing for a timed group case study. Provide structured, strategic guidance that would help a team of 4 members present effectively.`;

      let prompt = "";

      if (input.assistanceType === "breakdown") {
        prompt = `You are assisting a scholarship candidate preparing for a timed group case study.

Scholarship Title:
${scholarship.title}

Organization Website:
${scholarship.sourceUrl}

Scholarship Description:
${scholarship.description}

Group Case Study Task:
${scholarship.groupTaskDescription}

Time Constraint:
45 minutes

Generate:
1. Problem Breakdown
   - Core issue
   - Stakeholders
   - Risks
   - Key Data Points Needed
2. Market Analysis
   - Industry benchmarks
   - Financial assumptions
   - Competitive landscape
3. Strategic Framework
   - Step-by-step analysis flow
   - Recommended approach

Keep output structured and presentation-ready.`;
      } else if (input.assistanceType === "slides") {
        prompt = `You are assisting a scholarship candidate preparing for a timed group case study.

Scholarship Title:
${scholarship.title}

Organization Website:
${scholarship.sourceUrl}

Scholarship Description:
${scholarship.description}

Group Case Study Task:
${scholarship.groupTaskDescription}

Time Constraint:
45 minutes (team of 4 members)

Generate a Slide Deck Outline (5-7 slides max):
1. Slide Title
2. Key Message
3. Supporting Points
4. Visual Suggestion

Also provide:
- Suggested speaking allocation for 4 members (who presents what)
- Time allocation plan per section

Align case solutions with company values from their official website.`;
      } else {
        prompt = `You are assisting a scholarship candidate preparing for a timed group case study.

Scholarship Title:
${scholarship.title}

Organization Website:
${scholarship.sourceUrl}

Scholarship Description:
${scholarship.description}

Group Case Study Task:
${scholarship.groupTaskDescription}

Time Constraint:
45 minutes

Generate 3 high-impact strategic insights that would impress judges. For each insight:
1. The strategic angle
2. Why it matters
3. How to present it compellingly

Reference the company's mission statement, sustainability goals, and financial reports from their official website to anchor your recommendations.

Consider these Malaysian corporations for context:
- https://www.maxis.com.my
- https://www.petronas.com
- https://www.maybank.com
- https://www.cimb.com.my
- https://www.airasia.com

Provide competitive positioning suggestions that align with the sponsoring organization's values.`;
      }

      const result = await generateText({
        prompt,
        systemInstruction,
        model: "gemini-2.5-flash-lite",
      });

      if (input.applicationId) {
        const application = await getApplicationById(
          input.scholarshipId,
          input.applicationId,
        );

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }

        if (application.userId !== ctx.user.uid) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not authorized to update this application",
          });
        }

        const titleMap: Record<typeof input.assistanceType, string> = {
          breakdown: "Problem breakdown",
          slides: "Slide outline",
          strategy: "Winning strategy",
        };

        await updateApplicationById(input.scholarshipId, input.applicationId, {
          stages: {
            ...application.stages,
            group: {
              ...application.stages.group,
              aiPreparationUsed: true,
              aiHistory: [
                ...(application.stages.group.aiHistory ?? []),
                {
                  id: crypto.randomUUID(),
                  type: input.assistanceType,
                  title: titleMap[input.assistanceType],
                  response: result,
                  createdAt: now(),
                },
              ],
            },
          },
        });
      }

      return { assistance: result };
    }),

  getInterviewStage: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      if (application.currentStage !== "interview") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the interview stage",
        });
      }

      return {
        application,
        scholarship,
      };
    }),

  markInterviewPreparationGenerated: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        scholarshipId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const application = await getApplicationById(
        input.scholarshipId,
        input.applicationId,
      );

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      if (application.currentStage !== "interview") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the interview stage",
        });
      }

      await updateApplicationById(input.scholarshipId, input.applicationId, {
        stages: {
          ...application.stages,
          interview: {
            ...application.stages.interview,
            aiPreparationGenerated: true,
          },
        },
      });

      return { success: true };
    }),

  getInterviewAssistance: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        assistanceType: z.enum([
          "profile",
          "organization",
          "questions",
          "strategy",
          "checklist",
        ]),
        applicationId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Scholarship not found",
        });
      }

      let systemInstruction = "";
      let prompt = "";

      if (input.assistanceType === "profile") {
        systemInstruction = `You are preparing a scholarship candidate for a high-stakes personal interview. Generate a detailed interviewer profile summary including career trajectory, leadership style indicators, and public themes.`;
        prompt = `You are preparing a scholarship candidate for a personal interview.

Scholarship Title:
${scholarship.title}

Scholarship Description:
${scholarship.description}

Interview Focus Areas:
${scholarship.interviewFocusAreas.map((f) => `- ${f}`).join("\n")}

Organization Website:
${scholarship.sourceUrl}

Generate:
1. Interviewer Profile Summary
   - Career trajectory indicators
   - Leadership style indicators
   - Public themes (innovation, ESG, growth, etc.)
2. Likely areas of interest based on scholarship focus
3. Key values the interviewer may be looking for

Keep output concise and actionable.`;
      } else if (input.assistanceType === "organization") {
        systemInstruction = `You are preparing a scholarship candidate for a personal interview. Generate an organization strategic briefing.`;
        prompt = `You are preparing a scholarship candidate for a personal interview.

Scholarship Title:
${scholarship.title}

Organization Website:
${scholarship.sourceUrl}

Scholarship Description:
${scholarship.description}

Generate an Organization Strategic Briefing:
1. Industry positioning
2. Competitive landscape
3. Recent initiatives
4. Financial or growth direction
5. Key strategic priorities

Keep output concise and actionable.`;
      } else if (input.assistanceType === "questions") {
        systemInstruction = `You are preparing a scholarship candidate for a personal interview. Predict likely question clusters and generate model answer frameworks.`;
        prompt = `You are preparing a scholarship candidate for a personal interview.

Scholarship Title:
${scholarship.title}

Interview Focus Areas:
${scholarship.interviewFocusAreas.map((f) => `- ${f}`).join("\n")}

Organization Website:
${scholarship.sourceUrl}

Generate:
1. Predicted Question Clusters
   - Behavioral questions
   - Strategic questions
   - Values alignment questions
   - Industry knowledge questions
   - Stress testing questions

2. Model Answer Frameworks for each cluster

3. Personal Positioning Strategy

4. 3 Smart Questions the candidate should ask the interviewer

Keep output structured and actionable.`;
      } else if (input.assistanceType === "strategy") {
        systemInstruction = `You are preparing a scholarship candidate for a high-stakes personal interview. Simulate difficult questions with structured answer hints.`;
        prompt = `You are preparing a scholarship candidate for a personal interview.

Scholarship Title:
${scholarship.title}

Scholarship Description:
${scholarship.description}

Interview Focus Areas:
${scholarship.interviewFocusAreas.map((f) => `- ${f}`).join("\n")}

Generate 5 difficult interview questions with structured answer hints:
1. Behavioral question with STAR method hints
2. Strategic/thinking question with framework hints
3. Values alignment question with principle hints
4. Industry knowledge question with key points
5. Stress testing question with composure strategy

For each question:
- Why it's challenging
- What interviewers look for
- Key points to include in the answer
- What to avoid

If the organization is Maxis (Malaysian telecom), also include:
- Malaysian telecom market context
- 5G positioning
- Digital transformation focus
- Enterprise strategy direction

Keep output structured and actionable.`;
      } else {
        systemInstruction = `You are preparing a scholarship candidate for a high-stakes interview. Provide a 24-hour preparation checklist.`;
        prompt = `You are preparing a scholarship candidate for a personal interview.

Scholarship Title:
${scholarship.title}

Interview Focus Areas:
${scholarship.interviewFocusAreas.map((f) => `- ${f}`).join("\n")}

Generate a final 24-hour preparation checklist:

1. Hours Before Interview (12-24 hours)
   - What to review
   - Mental preparation
   - Logistics check

2. Hours Before Interview (4-12 hours)
   - Final research
   - Practice routines

3. Hours Before Interview (1-4 hours)
   - Warm-up exercises
   - Final review

4. Day of Interview
   - Pre-interview routine
   - Arrival checklist
   - Mental state preparation

Keep output as a practical, actionable checklist.`;
      }

      const result = await generateText({
        prompt,
        systemInstruction,
        model: "gemini-2.5-flash-lite",
      });

      if (input.applicationId) {
        const application = await getApplicationById(
          input.scholarshipId,
          input.applicationId,
        );

        if (!application) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Application not found",
          });
        }

        if (application.userId !== ctx.user.uid) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not authorized to update this application",
          });
        }

        const titleMap: Record<typeof input.assistanceType, string> = {
          profile: "Interviewer profile",
          organization: "Organization briefing",
          questions: "Predicted questions",
          strategy: "Difficult questions",
          checklist: "24-hour checklist",
        };

        await updateApplicationById(input.scholarshipId, input.applicationId, {
          stages: {
            ...application.stages,
            interview: {
              ...application.stages.interview,
              aiPreparationGenerated: true,
              aiHistory: [
                ...(application.stages.interview.aiHistory ?? []),
                {
                  id: crypto.randomUUID(),
                  type: input.assistanceType,
                  title: titleMap[input.assistanceType],
                  response: result,
                  createdAt: now(),
                },
              ],
            },
          },
        });
      }

      return { assistance: result };
    }),

  getEssayStageById: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ input }) => {
      const { application, scholarship, scholarshipId } =
        await getApplicationWithScholarship(input.applicationId);

      if (application.currentStage !== "essay") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the essay stage",
        });
      }

      return { application, scholarship, scholarshipId };
    }),

  getGroupStageById: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ input }) => {
      const { application, scholarship, scholarshipId } =
        await getApplicationWithScholarship(input.applicationId);

      if (application.currentStage !== "group") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the group stage",
        });
      }

      return { application, scholarship, scholarshipId };
    }),

  getInterviewStageById: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ input }) => {
      const { application, scholarship, scholarshipId } =
        await getApplicationWithScholarship(input.applicationId);

      if (application.currentStage !== "interview") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is not at the interview stage",
        });
      }

      return { application, scholarship, scholarshipId };
    }),
});

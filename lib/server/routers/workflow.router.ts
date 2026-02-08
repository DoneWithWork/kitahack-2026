import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "@/lib/repositories/applications.repo";
import { getScholarship } from "@/lib/repositories/scholarships.repo";
import { applicationSchema } from "@/lib/schemas/ai.schema";
import { generateReminders, generateChecklist } from "@/lib/services/reminders.service";
import { now } from "@/lib/utils/dates";

export const workflowRouter = router({
  getApplications: protectedProcedure.query(async ({ ctx }) => {
    return await getApplications(ctx.user!.uid);
  }),

  createApplication: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        deadline: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scholarship = await getScholarship(input.scholarshipId);
      
      if (!scholarship) {
        throw new Error("Scholarship not found");
      }

      const checklist = generateChecklist(scholarship.description).map((item) => ({
        item,
        completed: false,
      }));

      const application = applicationSchema.parse({
        uid: ctx.user!.uid,
        scholarshipId: input.scholarshipId,
        status: "interested",
        checklist,
        deadline: input.deadline,
        lastUpdated: now(),
      });

      await createApplication(ctx.user!.uid, application);
      return { success: true, application };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        status: z.enum(["interested", "applied", "interview", "accepted", "rejected"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateApplication(ctx.user!.uid, input.scholarshipId, {
        status: input.status,
      });
      return { success: true };
    }),

  updateChecklist: protectedProcedure
    .input(
      z.object({
        scholarshipId: z.string(),
        checklist: z.array(
          z.object({
            item: z.string(),
            completed: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateApplication(ctx.user!.uid, input.scholarshipId, {
        checklist: input.checklist,
      });
      return { success: true };
    }),

  deleteApplication: protectedProcedure
    .input(z.object({ scholarshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteApplication(ctx.user!.uid, input.scholarshipId);
      return { success: true };
    }),

  getReminders: protectedProcedure.query(async ({ ctx }) => {
    const applications = await getApplications(ctx.user!.uid);
    const reminders = generateReminders(applications);
    return { success: true, reminders };
  }),

  startApplication: protectedProcedure
    .input(z.object({ scholarshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const scholarship = await getScholarship(input.scholarshipId);

      if (!scholarship) {
        throw new Error("Scholarship not found");
      }

      const existingApplication = await getApplications(ctx.user!.uid);
      const alreadyApplied = existingApplication.find(
        (app) => app.scholarshipId === input.scholarshipId
      );

      if (alreadyApplied) {
        return { success: true, application: alreadyApplied, alreadyExists: true };
      }

      const checklist = generateChecklist(scholarship.description).map((item) => ({
        item,
        completed: false,
      }));

      const application = applicationSchema.parse({
        uid: ctx.user!.uid,
        scholarshipId: input.scholarshipId,
        status: "interested",
        checklist,
        deadline: scholarship.deadline,
        lastUpdated: now(),
      });

      await createApplication(ctx.user!.uid, application);
      return { success: true, application, alreadyExists: false };
    }),
});

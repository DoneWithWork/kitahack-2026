import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { getUser, updateUser } from "@/lib/repositories/users.repo";
import { getApplicationByApplicationId } from "@/lib/repositories/application.repo";
import { getScholarship } from "@/lib/repositories/scholarships.repo";

const STAGE_ORDER = ["essay", "group", "interview"] as const;

export const adminRouter = router({
  toggleAdminMode: protectedProcedure
    .input(
      z.object({
        enable: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUser(ctx.user.uid);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const newRole = input.enable ? "admin_simulated" : "user";
      const newHackathonMode = input.enable;

      await updateUser(ctx.user.uid, {
        role: newRole,
        hackathonMode: newHackathonMode,
      });

      return { success: true, role: newRole };
    }),

  getUserRole: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUser(ctx.user.uid);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      role: user.role || "user",
      hackathonMode: user.hackathonMode || false,
    };
  }),

  getApplicationForAdmin: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await getUser(ctx.user.uid);

      if (!user || user.role !== "admin_simulated") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin mode not enabled",
        });
      }

      const result = await getApplicationByApplicationId(input.applicationId);

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
    }),

  approveStage: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        passed: z.boolean(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUser(ctx.user.uid);

      if (!user || user.role !== "admin_simulated") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin mode not enabled",
        });
      }

      const result = await getApplicationByApplicationId(input.applicationId);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      const { application, scholarshipId } = result;
      const currentStage = application.currentStage;
      const currentStageData = application.stages[currentStage];

      if (currentStageData.checked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Stage ${currentStage} has already been reviewed`,
        });
      }

      const hasUserSubmitted = (stage: string, data: typeof application.stages) => {
        switch (stage) {
          case "essay":
            return data.essay.submitted === true;
          case "group":
            return data.group.checked === true;
          case "interview":
            return data.interview.checked === true;
          default:
            return false;
        }
      };

      if (!hasUserSubmitted(currentStage, application.stages)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot review ${currentStage} stage - user has not completed this stage yet`,
        });
      }

      const now = new Date().toISOString();
      const nextStageIndex = STAGE_ORDER.indexOf(currentStage) + 1;
      const nextStage = STAGE_ORDER[nextStageIndex] as typeof currentStage | undefined;

      const updateData: Record<string, unknown> = {
        stages: {
          ...application.stages,
          [currentStage]: {
            ...application.stages[currentStage],
            checked: true,
            passed: input.passed,
            reviewerNotes: input.notes || null,
          },
        },
        adminAudit: {
          lastApprovedBy: ctx.user.uid,
          lastApprovedAt: now,
          notes: input.notes || null,
        },
      };

      if (input.passed) {
        if (nextStage) {
          updateData.currentStage = nextStage;
          if (currentStage === "essay") {
            updateData.status = "essay_passed";
          } else if (currentStage === "group") {
            updateData.status = "group_passed";
          }
        } else {
          updateData.status = "completed";
          if (application.stages.interview.status) {
            updateData.status = "accepted";
          }
        }
      } else {
        updateData.status = "rejected";
      }

      const { updateApplicationById } = await import("@/lib/repositories/application.repo");
      await updateApplicationById(scholarshipId, input.applicationId, updateData);

      return {
        success: true,
        newStatus: updateData.status,
        newStage: nextStage || currentStage,
      };
    }),
});

import { z } from "zod";

export const minimumGradesSchema = z.object({
  "A*": z.number(),
  A: z.number(),
  B: z.number(),
});

export const scholarshipSchema = z.object({
  uid: z.string().optional(),
  title: z.string(),
  description: z.string(),
  sourceUrl: z.string(),
  benefits: z.array(z.string()),
  minimumGrades: minimumGradesSchema,
  studyLevel: z.array(z.string()),
  fieldOfStudy: z.string(),
  essayQuestion: z.string(),
  groupTaskDescription: z.string(),
  interviewFocusAreas: z.array(z.string()),
  stages: z.array(z.enum(["essay", "group", "interview"])),
  status: z.enum(["open", "closed"]),
  openingDate: z.string(),
  closingDate: z.string(),
  createdAt: z.string(),
  provider: z.string().optional(),
  providerUrl: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  eligibility: z.string().optional(),
  applicationLink: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  risk: z.any().optional(),
});

export type Scholarship = z.infer<typeof scholarshipSchema>;
export type MinimumGrades = z.infer<typeof minimumGradesSchema>;

export const aiHistoryEntrySchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  response: z.string(),
  createdAt: z.string(),
});

export const essayStageSchema = z.object({
  draft: z.string().optional(),
  submitted: z.boolean().default(false),
  checked: z.boolean().default(false),
  passed: z.boolean().default(false),
  reviewerNotes: z.string().nullable(),
  aiUsed: z.boolean().default(false),
  aiHistory: z.array(aiHistoryEntrySchema).default([]),
});

export const groupStageSchema = z.object({
  checked: z.boolean().default(false),
  passed: z.boolean().default(false),
  reviewerNotes: z.string().nullable(),
  aiPreparationUsed: z.boolean().default(false),
  aiHistory: z.array(aiHistoryEntrySchema).default([]),
});

export const interviewerSchema = z.object({
  name: z.string(),
  title: z.string(),
  organization: z.string(),
  linkedinUrl: z.string().optional(),
  profileSummary: z.string().optional(),
});

export const interviewStageSchema = z.object({
  status: z.enum(["pending", "scheduled", "completed", "approved"]).default("pending"),
  checked: z.boolean().default(false),
  passed: z.boolean().default(false),
  reviewerNotes: z.string().nullable(),
  aiPreparationGenerated: z.boolean().default(false),
  aiHistory: z.array(aiHistoryEntrySchema).default([]),
  interviewer: interviewerSchema.nullable(),
  scheduledAt: z.string().nullable(),
  reflectionNotes: z.string().nullable(),
});

export const applicationStagesSchema = z.object({
  essay: essayStageSchema,
  group: groupStageSchema,
  interview: interviewStageSchema,
});

export const eligibilitySnapshotSchema = z.object({
  meetsGradeRequirement: z.boolean(),
  checkedAt: z.string(),
});

export const adminAuditSchema = z.object({
  lastApprovedBy: z.string(),
  lastApprovedAt: z.string(),
  notes: z.string().nullable(),
});

export const applicationSchema = z.object({
  userId: z.string(),
  scholarshipId: z.string(),
  status: z.enum([
    "in_progress",
    "essay_passed",
    "group_passed",
    "accepted",
    "rejected",
    "completed",
  ]),
  currentStage: z.enum(["essay", "group", "interview"]),
  eligibilitySnapshot: eligibilitySnapshotSchema,
  stages: applicationStagesSchema,
  adminAudit: adminAuditSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EssayStage = z.infer<typeof essayStageSchema>;
export type GroupStage = z.infer<typeof groupStageSchema>;
export type Interviewer = z.infer<typeof interviewerSchema>;
export type InterviewStage = z.infer<typeof interviewStageSchema>;
export type AiHistoryEntry = z.infer<typeof aiHistoryEntrySchema>;
export type ApplicationStages = z.infer<typeof applicationStagesSchema>;
export type EligibilitySnapshot = z.infer<typeof eligibilitySnapshotSchema>;
export type AdminAudit = z.infer<typeof adminAuditSchema>;
export type Application = z.infer<typeof applicationSchema>;

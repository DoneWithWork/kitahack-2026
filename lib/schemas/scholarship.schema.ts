import { z } from "zod";

// Re-export the canonical scholarship schema and types from application.schema
export {
  scholarshipSchema,
  riskSchema,
  type Scholarship,
  type Risk,
} from "@/lib/schemas/application.schema";

/**
 * Input schema for creating a scholarship via the API.
 * Omits auto-generated fields (uid, createdAt, updatedAt, embedding).
 */
export const scholarshipInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  provider: z.string().optional(),
  sourceUrl: z.string(),
  amount: z.string().optional(),
  minimumGrades: z
    .object({ "A*": z.number(), A: z.number(), B: z.number() })
    .optional(),
  studyLevel: z.array(z.string()).optional(),
  fieldOfStudy: z.string().optional(),
  essayQuestion: z.string().optional(),
  groupTaskDescription: z.string().optional(),
  interviewFocusAreas: z.array(z.string()).optional(),
  stages: z.array(z.enum(["essay", "group", "interview"])).optional(),
  status: z.enum(["open", "closed"]).default("open"),
  deadline: z.string().optional(),
  eligibility: z.string().optional(),
  citizenship: z.array(z.string()).optional(),
  incomeCap: z.number().optional(),
  minGPA: z.number().optional(),
  educationLevels: z
    .array(z.enum(["high_school", "undergraduate", "graduate", "postgraduate"]))
    .optional(),
  fieldsAllowed: z.array(z.string()).optional(),
  applicationLink: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Schema for extracting scholarship data from unstructured text (parsing service).
 * This is a loose shape used for AI extraction; results should be mapped
 * to the canonical Scholarship type before storage.
 */
export const extractedScholarshipSchema = z.object({
  title: z.string(),
  description: z.string(),
  provider: z.string(),
  citizenship: z.array(z.string()).optional(),
  incomeCap: z.number().optional(),
  minGPA: z.number().optional(),
  fieldsAllowed: z.array(z.string()).optional(),
  educationLevels: z
    .array(z.enum(["high_school", "undergraduate", "graduate", "postgraduate"]))
    .optional(),
  deadline: z.string(),
  benefits: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  applicationUrl: z.string().optional(),
  applicationProcess: z.string().optional(),
  documentsRequired: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  tags: z.array(z.string()).optional(),
});

export const scholarshipSearchFiltersSchema = z.object({
  query: z.string().optional(),
  fields: z.array(z.string()).optional(),
  educationLevel: z
    .enum(["high_school", "undergraduate", "graduate", "postgraduate"])
    .optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  deadlineBefore: z.string().optional(),
  citizenship: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ExtractedScholarship = z.infer<typeof extractedScholarshipSchema>;
export type ScholarshipInput = z.infer<typeof scholarshipInputSchema>;
export type ScholarshipSearchFilters = z.infer<
  typeof scholarshipSearchFiltersSchema
>;

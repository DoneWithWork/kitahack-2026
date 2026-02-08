import { z } from "zod";

export const scholarshipSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  provider: z.string(),
  amount: z.object({
    value: z.number(),
    currency: z.string().default("USD"),
    type: z.enum(["fixed", "range", "full_tuition", "partial", "variable"]).default("fixed"),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
  }).optional(),
  citizenship: z.array(z.string()).optional(),
  incomeCap: z.number().optional(),
  minGrades: z.record(z.string(), z.number()).optional(),
  minGPA: z.number().optional(),
  fieldsAllowed: z.array(z.string()).optional(),
  educationLevels: z.array(z.enum(["high_school", "undergraduate", "graduate", "postgraduate"])).optional(),
  deadline: z.string(),
  benefits: z.string(),
  requirements: z.array(z.string()).optional(),
  applicationUrl: z.string().url().optional(),
  applicationProcess: z.string().optional(),
  documentsRequired: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  embedding: z.array(z.number()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "expired"]).default("active"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const scholarshipInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  provider: z.string(),
  amount: z.object({
    value: z.number(),
    currency: z.string().default("USD"),
    type: z.enum(["fixed", "range", "full_tuition", "partial", "variable"]).default("fixed"),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
  }).optional(),
  citizenship: z.array(z.string()).optional(),
  incomeCap: z.number().optional(),
  minGrades: z.record(z.string(), z.number()).optional(),
  minGPA: z.number().optional(),
  fieldsAllowed: z.array(z.string()).optional(),
  educationLevels: z.array(z.enum(["high_school", "undergraduate", "graduate", "postgraduate"])).optional(),
  deadline: z.string(),
  benefits: z.string(),
  requirements: z.array(z.string()).optional(),
  applicationUrl: z.string().url().optional(),
  applicationProcess: z.string().optional(),
  documentsRequired: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  tags: z.array(z.string()).optional(),
});

export const extractedScholarshipSchema = z.object({
  title: z.string(),
  description: z.string(),
  provider: z.string(),
  amount: z.object({
    value: z.number(),
    currency: z.string().default("USD"),
    type: z.enum(["fixed", "range", "full_tuition", "partial", "variable"]).default("fixed"),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
  }).optional(),
  citizenship: z.array(z.string()).optional(),
  incomeCap: z.number().optional(),
  minGrades: z.record(z.string(), z.number()).optional(),
  minGPA: z.number().optional(),
  fieldsAllowed: z.array(z.string()).optional(),
  educationLevels: z.array(z.enum(["high_school", "undergraduate", "graduate", "postgraduate"])).optional(),
  deadline: z.string(),
  benefits: z.string(),
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
  educationLevel: z.enum(["high_school", "undergraduate", "graduate", "postgraduate"]).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  deadlineBefore: z.string().optional(),
  citizenship: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type Scholarship = z.infer<typeof scholarshipSchema>;
export type ScholarshipInput = z.infer<typeof scholarshipInputSchema>;
export type ExtractedScholarship = z.infer<typeof extractedScholarshipSchema>;
export type ScholarshipSearchFilters = z.infer<typeof scholarshipSearchFiltersSchema>;

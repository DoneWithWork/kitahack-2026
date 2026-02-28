import { z } from "zod";

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["user", "admin_simulated"]).default("user"),
  hackathonMode: z.boolean().default(false),
  incomeBracket: z.enum(["low", "medium", "high"]).optional(),
  interests: z.array(z.string()).default([]),
  goals: z.string().optional(),
  citizenship: z.string().default("Malaysian"),
  educationLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  currentSchool: z.string().optional(),
  graduationYear: z.number().min(2024).max(2035).optional(),
  targetField: z.string().optional(),
  gpa: z.number().default(3.7),
  onboardingCompleted: z.boolean().default(false),
  onboardingStep: z.number().default(0),
  documentsUploaded: z.boolean().default(false),
  transcriptUploaded: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["user", "admin_simulated"]).optional(),
  hackathonMode: z.boolean().optional(),
  incomeBracket: z.enum(["low", "medium", "high"]).optional(),
  interests: z.array(z.string()).optional(),
  goals: z.string().optional(),
  citizenship: z.string().optional(),
  educationLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  currentSchool: z.string().optional(),
  graduationYear: z.number().min(2024).max(2035).optional(),
  targetField: z.string().optional(),
  gpa: z.number().min(0).max(100).optional(),
  onboardingCompleted: z.boolean().optional(),
  onboardingStep: z.number().optional(),
  documentsUploaded: z.boolean().optional(),
  transcriptUploaded: z.boolean().optional(),
});

export const onboardingProfileSchema = z.object({
  currentSchool: z.string().min(1),
  graduationYear: z.number().min(2024).max(2035),
  targetField: z.string().min(1),
  incomeBracket: z.enum(["low", "medium", "high"]),
  interests: z.array(z.string()).min(1),
  goals: z.string().min(10),
  citizenship: z.string().min(1).optional(),
  educationLevel: z.string().min(1).optional(),
  fieldOfStudy: z.string().min(1).optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;
export type OnboardingProfile = z.infer<typeof onboardingProfileSchema>;

import { z } from "zod";

export const aiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export const matchSchema = z.object({
  uid: z.string(),
  scholarshipId: z.string(),
  eligible: z.boolean(),
  reasons: z.array(z.string()),
  score: z.number().min(0).max(100),
  similarity: z.number().min(0).max(1),
  calculatedAt: z.string(),
});

export const applicationSchema = z.object({
  uid: z.string(),
  scholarshipId: z.string(),
  status: z.enum(["interested", "applied", "interview", "accepted", "rejected"]),
  checklist: z.array(
    z.object({
      item: z.string(),
      completed: z.boolean(),
    })
  ),
  deadline: z.string(),
  lastUpdated: z.string(),
});

export type Match = z.infer<typeof matchSchema>;
export type Application = z.infer<typeof applicationSchema>;

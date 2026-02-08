import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string(),
  grade: z.number().min(0).max(100),
  code: z.string().optional(),
});

export const transcriptSchema = z.object({
  uid: z.string(),
  subjects: z.array(subjectSchema),
  gpa: z.number().min(0).max(100),
  year: z.number().int().min(2000).max(2100),
  uploadedAt: z.string(),
  fileUrl: z.string().url().optional(),
});

export const extractedTranscriptSchema = z.object({
  subjects: z.array(
    z.object({
      name: z.string(),
      grade: z.number(),
    })
  ),
  gpa: z.number(),
  year: z.number(),
});

export type Subject = z.infer<typeof subjectSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;
export type ExtractedTranscript = z.infer<typeof extractedTranscriptSchema>;

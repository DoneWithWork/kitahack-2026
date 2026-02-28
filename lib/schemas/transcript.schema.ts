import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string(),
  grade: z.union([z.string(), z.number()]),
  code: z.string().optional(),
});

export const transcriptSchema = z.object({
  uid: z.string(),
  subjects: z.array(subjectSchema),
  gpa: z.union([z.string(), z.number()]).optional(),
  year: z.union([z.string(), z.number()]).optional(),
  school: z.string().optional(),
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

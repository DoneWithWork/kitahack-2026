import { z } from "zod";

export const documentSchema = z.object({
  id: z.string(),
  uid: z.string(),
  type: z.enum(["transcript", "certificate", "recommendation_letter", "essay", "other"]),
  name: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  extractedData: z.record(z.string(), z.unknown()).optional(),
  ocrText: z.string().optional(),
  isVerified: z.boolean().default(false),
  uploadedAt: z.string(),
  updatedAt: z.string(),
});

export const certificateExtractedDataSchema = z.object({
  certificateName: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  grade: z.string().optional(),
  level: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const documentUploadInputSchema = z.object({
  type: z.enum(["transcript", "certificate", "recommendation_letter", "essay", "other"]),
  name: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
});

export type Document = z.infer<typeof documentSchema>;
export type CertificateExtractedData = z.infer<typeof certificateExtractedDataSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadInputSchema>;

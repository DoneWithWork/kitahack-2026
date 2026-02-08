import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createDocument,
  getDocument,
  getDocumentsByUser,
  getDocumentsByType,
  updateDocument,
  deleteDocument,
} from "@/lib/repositories/documents.repo";
import { documentSchema, documentUploadInputSchema } from "@/lib/schemas/document.schema";
import { extractTextFromImage } from "@/lib/ai/vision";
import { parseCertificateText, classifyDocument } from "@/lib/services/document.service";
import { adminStorage } from "@/lib/firebase/admin";
import { now } from "@/lib/utils/dates";
import { randomUUID } from "crypto";

export const documentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getDocumentsByUser(ctx.user!.uid);
  }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(["transcript", "certificate", "recommendation_letter", "essay", "other"]) }))
    .query(async ({ ctx, input }) => {
      return await getDocumentsByType(ctx.user!.uid, input.type);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await getDocument(input.id);
      if (!doc || doc.uid !== ctx.user!.uid) {
        throw new Error("Document not found");
      }
      return doc;
    }),

  upload: protectedProcedure
    .input(documentUploadInputSchema)
    .mutation(async ({ ctx, input }) => {
      const document = documentSchema.parse({
        id: randomUUID(),
        uid: ctx.user!.uid,
        ...input,
        uploadedAt: now(),
        updatedAt: now(),
      });

      await createDocument(document);
      return { success: true, document };
    }),

  uploadWithOCR: protectedProcedure
    .input(documentUploadInputSchema)
    .mutation(async ({ ctx, input }) => {
      const rawText = await extractTextFromImage(input.fileUrl);
      const classification = await classifyDocument(rawText);
      
      let extractedData = {};
      if (classification === "certificate") {
        extractedData = await parseCertificateText(rawText);
      }

      const document = documentSchema.parse({
        id: randomUUID(),
        uid: ctx.user!.uid,
        ...input,
        type: classification === input.type ? input.type : classification,
        ocrText: rawText,
        extractedData,
        uploadedAt: now(),
        updatedAt: now(),
      });

      await createDocument(document);
      return { success: true, document };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        isVerified: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const doc = await getDocument(input.id);
      if (!doc || doc.uid !== ctx.user!.uid) {
        throw new Error("Document not found");
      }

      await updateDocument(input.id, {
        ...input.data,
        updatedAt: now(),
      });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await getDocument(input.id);
      if (!doc || doc.uid !== ctx.user!.uid) {
        throw new Error("Document not found");
      }

      await deleteDocument(input.id);
      return { success: true };
    }),

  getUploadUrl: protectedProcedure
    .input(z.object({ 
      filename: z.string(),
      contentType: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const bucket = adminStorage().bucket();
      const file = bucket.file(`documents/${ctx.user!.uid}/${randomUUID()}_${input.filename}`);
      
      const [url] = await file.getSignedUrl({
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: input.contentType,
      });

      return { success: true, url, path: file.name };
    }),
});

import { adminStorage } from "@/lib/firebase/admin";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocumentsByType,
  getDocumentsByUser,
  updateDocument,
} from "@/lib/repositories/documents.repo";
import {
  documentSchema,
  documentUploadInputSchema,
} from "@/lib/schemas/document.schema";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import { randomUUID } from "crypto";
import { z } from "zod";

export const documentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await getDocumentsByUser(ctx.user!.uid);
  }),

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "transcripts",
          "certificates",
          "recommendation_letter",
          "essay",
          "other",
        ]),
      }),
    )
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
    .mutation(async () => {}),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          isVerified: z.boolean().optional(),
        }),
      }),
    )
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
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bucket = adminStorage().bucket();
      const file = bucket.file(
        `documents/${ctx.user!.uid}/${randomUUID()}_${input.filename}`,
      );

      const [url] = await file.getSignedUrl({
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: input.contentType,
      });

      return { success: true, url, path: file.name };
    }),
});

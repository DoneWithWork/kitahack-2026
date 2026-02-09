import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createTranscript,
  getTranscript,
  updateTranscript,
} from "@/lib/repositories/transcripts.repo";
import { transcriptSchema } from "@/lib/schemas/transcript.schema";
import { parseTranscriptText } from "@/lib/services/parsing.service";
import { extractTextFromImage, extractTextFromPDF } from "@/lib/ai/vision";
import { adminStorage } from "@/lib/firebase/admin";
import { now } from "@/lib/utils/dates";

export const transcriptRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await getTranscript(ctx.user!.uid);
  }),

  uploadFromImage: protectedProcedure
    .input(z.object({ imageUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const rawText = await extractTextFromImage(input.imageUrl);
      console.log("Extracted text:", rawText);
      const extracted = await parseTranscriptText(rawText);

      const transcript = transcriptSchema.parse({
        ...extracted,
        uid: ctx.user!.uid,
        uploadedAt: now(),
        fileUrl: input.imageUrl,
      });

      await createTranscript(transcript);
      return { success: true, transcript };
    }),

  uploadFromPDF: protectedProcedure
    .input(z.object({ gcsUri: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const rawText = await extractTextFromPDF(input.gcsUri);
      const extracted = await parseTranscriptText(rawText);
      console.log("Extracted transcript data:", extracted);
      const transcript = transcriptSchema.parse({
        ...extracted,
        uid: ctx.user!.uid,
        uploadedAt: now(),
      });

      await createTranscript(transcript);
      return { success: true, transcript };
    }),

  update: protectedProcedure
    .input(
      z.object({
        subjects: z.array(
          z.object({
            name: z.string(),
            grade: z.number(),
            code: z.string().optional(),
          }),
        ),
        gpa: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateTranscript(ctx.user!.uid, input);
      return { success: true };
    }),

  getUploadUrl: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const bucket = adminStorage().bucket();
      const file = bucket.file(
        `transcripts/${ctx.user!.uid}/${input.filename}`,
      );

      const [url] = await file.getSignedUrl({
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: "application/pdf",
      });

      return { success: true, url, path: file.name };
    }),
});

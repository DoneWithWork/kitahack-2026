import { getEmbedding } from "@/lib/ai/embeddings";
import {
  getAllScholarships,
  getScholarship,
} from "@/lib/repositories/scholarships.repo";
import {
  scholarshipInputSchema,
  scholarshipSchema,
  scholarshipSearchFiltersSchema,
} from "@/lib/schemas/scholarship.schema";
import { parseScholarshipText } from "@/lib/services/parsing.service";
import { protectedProcedure, router } from "@/lib/trpc/server";
import { now } from "@/lib/utils/dates";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

export const scholarshipRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await getAllScholarships();
  }),

  search: protectedProcedure
    .input(scholarshipSearchFiltersSchema)
    .query(async () => {}),

  getByField: protectedProcedure
    .input(z.object({ field: z.string() }))
    .query(async () => {}),

  getUrgent: protectedProcedure.query(async () => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getScholarship(input.id);
    }),

  create: protectedProcedure
    .input(scholarshipInputSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();

      const embeddingText = `${input.title} ${input.description} ${input.provider} ${input.fieldsAllowed?.join(" ") || ""}`;
      let embedding: number[] | undefined;

      try {
        embedding = await getEmbedding(embeddingText);
      } catch (error) {
        logger.error({ error }, "Failed to generate embedding for scholarship");
      }

      const scholarship = scholarshipSchema.parse({
        ...input,
        id,
        embedding,
        createdAt: now(),
        updatedAt: now(),
      });

      return { success: true, scholarship };
    }),

  parseFromText: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const extracted = await parseScholarshipText(input.text);
      return { success: true, extracted };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: scholarshipInputSchema.partial(),
      }),
    )
    .mutation(async () => {
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),
});

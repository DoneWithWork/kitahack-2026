import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createScholarship,
  getScholarship,
  getAllScholarships,
  searchScholarships,
  getScholarshipsByField,
  getScholarshipsByDeadline,
  updateScholarship,
  deleteScholarship,
} from "@/lib/repositories/scholarships.repo";
import {
  scholarshipInputSchema,
  scholarshipSchema,
  scholarshipSearchFiltersSchema,
} from "@/lib/schemas/scholarship.schema";
import { parseScholarshipText } from "@/lib/services/parsing.service";
import { getEmbedding } from "@/lib/ai/embeddings";
import { now } from "@/lib/utils/dates";
import { logger } from "@/lib/utils/logger";

export const scholarshipRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await getAllScholarships();
  }),

  search: protectedProcedure
    .input(scholarshipSearchFiltersSchema)
    .query(async ({ input }) => {
      return await searchScholarships(input);
    }),

  getByField: protectedProcedure
    .input(z.object({ field: z.string() }))
    .query(async ({ input }) => {
      return await getScholarshipsByField(input.field);
    }),

  getUrgent: protectedProcedure.query(async () => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return await getScholarshipsByDeadline(twoWeeksFromNow.toISOString());
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

      await createScholarship(scholarship);
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
      })
    )
    .mutation(async ({ input }) => {
      await updateScholarship(input.id, input.data);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await deleteScholarship(input.id);
      return { success: true };
    }),
});

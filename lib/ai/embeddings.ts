import { generateEmbedding } from "./gemini";
import { logger } from "@/lib/utils/logger";

const embeddingCache = new Map<string, number[]>();

export const getEmbedding = async (text: string): Promise<number[]> => {
  const cached = embeddingCache.get(text);
  if (cached) {
    return cached;
  }

  try {
    const embedding = await generateEmbedding(text);
    embeddingCache.set(text, embedding);
    return embedding;
  } catch (error) {
    logger.error({ error, text: text.slice(0, 100) }, "Embedding error");
    throw error;
  }
};

export const clearEmbeddingCache = (): void => {
  embeddingCache.clear();
};

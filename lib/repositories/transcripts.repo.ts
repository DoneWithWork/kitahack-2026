import { adminDb } from "@/lib/firebase/admin";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import { logger } from "@/lib/utils/logger";

const TRANSCRIPTS_COLLECTION = "transcripts";

function convertTimestamp(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    if ("toDate" in obj && typeof obj.toDate === "function") {
      return (obj.toDate() as Date).toISOString();
    }
    if ("_seconds" in obj && "_nanoseconds" in obj) {
      const seconds = obj._seconds as number;
      return new Date(seconds * 1000).toISOString();
    }
  }
  return String(value);
}

function sanitizeTranscriptData(data: Record<string, unknown>): Transcript {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "uploadedAt" || key === "createdAt" || key === "updatedAt") {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as Transcript;
}

export const createTranscript = async (
  transcript: Transcript,
): Promise<void> => {
  try {
    await adminDb()
      .collection(TRANSCRIPTS_COLLECTION)
      .doc(transcript.uid)
      .set(transcript);
  } catch (error) {
    logger.error({ error, uid: transcript.uid }, "Error creating transcript");
    throw error;
  }
};

export const getTranscript = async (
  uid: string,
): Promise<Transcript | null> => {
  try {
    const doc = await adminDb()
      .collection(TRANSCRIPTS_COLLECTION)
      .doc(uid)
      .get();
    if (!doc.exists) return null;
    return sanitizeTranscriptData(doc.data() as Record<string, unknown>);
  } catch (error) {
    logger.error({ error, uid }, "Error getting transcript");
    throw error;
  }
};

export const updateTranscript = async (
  uid: string,
  data: Partial<Transcript>,
): Promise<void> => {
  try {
    await adminDb().collection(TRANSCRIPTS_COLLECTION).doc(uid).update(data);
  } catch (error) {
    logger.error({ error, uid }, "Error updating transcript");
    throw error;
  }
};

export const deleteTranscript = async (uid: string): Promise<void> => {
  try {
    await adminDb().collection(TRANSCRIPTS_COLLECTION).doc(uid).delete();
  } catch (error) {
    logger.error({ error, uid }, "Error deleting transcript");
    throw error;
  }
};

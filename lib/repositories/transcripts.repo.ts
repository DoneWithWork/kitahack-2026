import { adminDb } from "@/lib/firebase/admin";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import { logger } from "@/lib/utils/logger";

const TRANSCRIPTS_COLLECTION = "transcripts";

export const createTranscript = async (
  transcript: Transcript
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
  uid: string
): Promise<Transcript | null> => {
  try {
    const doc = await adminDb()
      .collection(TRANSCRIPTS_COLLECTION)
      .doc(uid)
      .get();
    if (!doc.exists) return null;
    return doc.data() as Transcript;
  } catch (error) {
    logger.error({ error, uid }, "Error getting transcript");
    throw error;
  }
};

export const updateTranscript = async (
  uid: string,
  data: Partial<Transcript>
): Promise<void> => {
  try {
    await adminDb()
      .collection(TRANSCRIPTS_COLLECTION)
      .doc(uid)
      .update(data);
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

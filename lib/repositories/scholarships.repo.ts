import { adminDb } from "@/lib/firebase/admin";
import { logger } from "@/lib/utils/logger";
import type { Scholarship } from "@/lib/schemas/application.schema";
const SCHOLARSHIPS_COLLECTION = "scholarships";
export const createScholarship = async (
  scholarship: Scholarship,
): Promise<void> => {
  try {
    const id = crypto.randomUUID();
    await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(id)
      .set({ ...scholarship, createdAt: new Date().toISOString() });
  } catch (error) {
    throw error;
  }
};

export const getScholarship = async (
  id: string,
): Promise<Scholarship | null> => {
  try {
    const doc = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return doc.data() as Scholarship;
  } catch (error) {
    logger.error({ error, id }, "Error getting scholarship");
    throw error;
  }
};

export const getAllScholarships = async (): Promise<Scholarship[]> => {
  try {
    const snapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .orderBy("deadline", "asc")
      .get();
    console.log(`Fetched ${snapshot.size} scholarships from Firestore`);
    return snapshot.docs.map((doc) => doc.data() as Scholarship);
  } catch (error) {
    logger.error({ error }, "Error getting all scholarships");
    throw error;
  }
};

import { adminDb } from "@/lib/firebase/admin";
import { logger } from "@/lib/utils/logger";
import type { Scholarship } from "@/lib/schemas/application.schema";
const SCHOLARSHIPS_COLLECTION = "scholarships";

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

function sanitizeScholarshipData(data: Record<string, unknown>): Scholarship {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "createdAt" || key === "updatedAt" || key === "deadline" || key === "openingDate" || key === "closingDate") {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as Scholarship;
}
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
    return sanitizeScholarshipData(doc.data() as Record<string, unknown>);
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
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      const sanitized = sanitizeScholarshipData(data);
      return {
        ...sanitized,
        uid: (data.uid as string) ?? doc.id,
      } as Scholarship;
    });
  } catch (error) {
    logger.error({ error }, "Error getting all scholarships");
    throw error;
  }
};

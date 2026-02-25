import { adminDb } from "@/lib/firebase/admin";
import type { Match, Application } from "@/lib/schemas/ai.schema";
import { logger } from "@/lib/utils/logger";

const MATCHES_COLLECTION = "matches";
const APPLICATIONS_COLLECTION = "applications";

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

function sanitizeData<T>(data: Record<string, unknown>, fields: string[]): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (fields.includes(key)) {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export const createMatch = async (uid: string, match: Match): Promise<void> => {
  try {
    await adminDb()
      .collection(MATCHES_COLLECTION)
      .doc(uid)
      .collection("items")
      .doc(match.scholarshipId)
      .set(match);
  } catch (error) {
    logger.error(
      { error, uid, scholarshipId: match.scholarshipId },
      "Error creating match",
    );
    throw error;
  }
};

export const getMatches = async (uid: string): Promise<Match[]> => {
  try {
    const snapshot = await adminDb()
      .collection(MATCHES_COLLECTION)
      .doc(uid)
      .collection("items")
      .orderBy("score", "desc")
      .get();
    return snapshot.docs.map((doc) => sanitizeData<Match>(doc.data() as Record<string, unknown>, ["createdAt", "updatedAt"]));
  } catch (error) {
    logger.error({ error, uid }, "Error getting matches");
    throw error;
  }
};

export const createApplication = async (
  uid: string,
  application: Application,
): Promise<void> => {
  try {
    await adminDb()
      .collection(APPLICATIONS_COLLECTION)
      .doc(uid)
      .collection("items")
      .doc(application.scholarshipId)
      .set(application);
  } catch (error) {
    logger.error(
      { error, uid, scholarshipId: application.scholarshipId },
      "Error creating application",
    );
    throw error;
  }
};

export const getApplications = async (uid: string): Promise<Application[]> => {
  try {
    const snapshot = await adminDb()
      .collection(APPLICATIONS_COLLECTION)
      .doc(uid)
      .collection("items")
      .orderBy("deadline", "asc")
      .get();
    return snapshot.docs.map((doc) => sanitizeData<Application>(doc.data() as Record<string, unknown>, ["createdAt", "updatedAt", "deadline"]));
  } catch (error) {
    logger.error({ error, uid }, "Error getting applications");
    throw error;
  }
};

export const updateApplication = async (
  uid: string,
  scholarshipId: string,
  data: Partial<Application>,
): Promise<void> => {
  try {
    await adminDb()
      .collection(APPLICATIONS_COLLECTION)
      .doc(uid)
      .collection("items")
      .doc(scholarshipId)
      .update({
        ...data,
        lastUpdated: new Date().toISOString(),
      });
  } catch (error) {
    logger.error({ error, uid, scholarshipId }, "Error updating application");
    throw error;
  }
};

export const deleteApplication = async (
  uid: string,
  scholarshipId: string,
): Promise<void> => {
  try {
    await adminDb()
      .collection(APPLICATIONS_COLLECTION)
      .doc(uid)
      .collection("items")
      .doc(scholarshipId)
      .delete();
  } catch (error) {
    logger.error({ error, uid, scholarshipId }, "Error deleting application");
    throw error;
  }
};

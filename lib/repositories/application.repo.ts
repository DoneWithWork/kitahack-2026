import { adminDb } from "@/lib/firebase/admin";
import type { Application } from "@/lib/schemas/application.schema";
import { logger } from "@/lib/utils/logger";

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

function sanitizeApplicationData(data: Record<string, unknown>): Application {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "createdAt" || key === "updatedAt") {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as Application;
}

export const createApplicationInScholarship = async (
  scholarshipId: string,
  applicationId: string,
  application: Application,
): Promise<void> => {
  try {
    await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarshipId)
      .collection("applications")
      .doc(applicationId)
      .set(application);
  } catch (error) {
    logger.error(
      { error, scholarshipId, applicationId },
      "Error creating application",
    );
    throw error;
  }
};

export const getApplicationById = async (
  scholarshipId: string,
  applicationId: string,
): Promise<Application | null> => {
  try {
    const doc = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarshipId)
      .collection("applications")
      .doc(applicationId)
      .get();

    if (!doc.exists) return null;
    return sanitizeApplicationData(doc.data() as Record<string, unknown>);
  } catch (error) {
    logger.error(
      { error, scholarshipId, applicationId },
      "Error getting application",
    );
    throw error;
  }
};

export const updateApplicationById = async (
  scholarshipId: string,
  applicationId: string,
  data: Partial<Application>,
): Promise<void> => {
  try {
    await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarshipId)
      .collection("applications")
      .doc(applicationId)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    logger.error(
      { error, scholarshipId, applicationId },
      "Error updating application",
    );
    throw error;
  }
};

export const getApplicationsForScholarship = async (
  scholarshipId: string,
): Promise<Application[]> => {
  try {
    const snapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarshipId)
      .collection("applications")
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => sanitizeApplicationData(doc.data() as Record<string, unknown>));
  } catch (error) {
    logger.error({ error, scholarshipId }, "Error getting applications");
    throw error;
  }
};

export const getUserApplicationsForScholarship = async (
  userId: string,
  scholarshipId: string,
): Promise<{ application: Application; applicationId: string } | null> => {
  try {
    const snapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarshipId)
      .collection("applications")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      application: sanitizeApplicationData(doc.data() as Record<string, unknown>),
      applicationId: doc.id,
    };
  } catch (error) {
    logger.error({ error, userId, scholarshipId }, "Error getting user application");
    throw error;
  }
};

export const getApplicationByApplicationId = async (
  applicationId: string,
): Promise<{ application: Application; scholarshipId: string } | null> => {
  try {
    const scholarshipsSnapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .limit(100)
      .get();

    for (const scholarshipDoc of scholarshipsSnapshot.docs) {
      const appDoc = await adminDb()
        .collection(SCHOLARSHIPS_COLLECTION)
        .doc(scholarshipDoc.id)
        .collection("applications")
        .doc(applicationId)
        .get();

      if (appDoc.exists) {
        const application = sanitizeApplicationData(appDoc.data() as Record<string, unknown>);
        return { application, scholarshipId: scholarshipDoc.id };
      }
    }

    return null;
  } catch (error) {
    logger.error({ error, applicationId }, "Error getting application by ID");
    throw error;
  }
};

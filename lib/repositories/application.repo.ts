import { adminDb } from "@/lib/firebase/admin";
import type { Application } from "@/lib/schemas/application.schema";
import { logger } from "@/lib/utils/logger";

const SCHOLARSHIPS_COLLECTION = "scholarships";

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
    return doc.data() as Application;
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
    return snapshot.docs.map((doc) => doc.data() as Application);
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
      application: doc.data() as Application,
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
        const application = appDoc.data() as Application;
        return { application, scholarshipId: scholarshipDoc.id };
      }
    }

    return null;
  } catch (error) {
    logger.error({ error, applicationId }, "Error getting application by ID");
    throw error;
  }
};

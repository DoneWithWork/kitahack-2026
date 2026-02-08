import { adminDb } from "@/lib/firebase/admin";
import type { Scholarship, ScholarshipSearchFilters } from "@/lib/schemas/scholarship.schema";
import { logger } from "@/lib/utils/logger";

const SCHOLARSHIPS_COLLECTION = "scholarships";

export const createScholarship = async (
  scholarship: Scholarship
): Promise<void> => {
  try {
    await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(scholarship.id)
      .set(scholarship);
  } catch (error) {
    logger.error({ error, id: scholarship.id }, "Error creating scholarship");
    throw error;
  }
};

export const getScholarship = async (
  id: string
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
    return snapshot.docs.map((doc) => doc.data() as Scholarship);
  } catch (error) {
    logger.error({ error }, "Error getting all scholarships");
    throw error;
  }
};

export const searchScholarships = async (
  filters: ScholarshipSearchFilters
): Promise<Scholarship[]> => {
  try {
    const collection = adminDb().collection(SCHOLARSHIPS_COLLECTION);
    let query: FirebaseFirestore.Query = collection.where("status", "==", "active");

    if (filters.deadlineBefore) {
      query = query.where("deadline", "<=", filters.deadlineBefore);
    }

    if (filters.educationLevel) {
      query = query.where("educationLevels", "array-contains", filters.educationLevel);
    }

    const snapshot = await query.orderBy("deadline", "asc").get();
    let scholarships = snapshot.docs.map((doc) => doc.data() as Scholarship);

    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      scholarships = scholarships.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm) ||
          s.description.toLowerCase().includes(searchTerm) ||
          s.provider.toLowerCase().includes(searchTerm) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.fields && filters.fields.length > 0) {
      scholarships = scholarships.filter((s) =>
        s.fieldsAllowed?.some((field) =>
          filters.fields?.some((f) => field.toLowerCase().includes(f.toLowerCase()))
        )
      );
    }

    if (filters.minAmount !== undefined) {
      scholarships = scholarships.filter(
        (s) => s.amount && (s.amount.value >= filters.minAmount! || s.amount.minAmount! >= filters.minAmount!)
      );
    }

    if (filters.maxAmount !== undefined) {
      scholarships = scholarships.filter(
        (s) => s.amount && (s.amount.value <= filters.maxAmount! || s.amount.maxAmount! <= filters.maxAmount!)
      );
    }

    if (filters.citizenship) {
      scholarships = scholarships.filter(
        (s) => !s.citizenship || s.citizenship.includes(filters.citizenship!)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      scholarships = scholarships.filter((s) =>
        filters.tags?.some((tag) => s.tags?.includes(tag))
      );
    }

    return scholarships;
  } catch (error) {
    logger.error({ error, filters }, "Error searching scholarships");
    throw error;
  }
};

export const getScholarshipsByField = async (field: string): Promise<Scholarship[]> => {
  try {
    const snapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .where("fieldsAllowed", "array-contains", field)
      .where("status", "==", "active")
      .orderBy("deadline", "asc")
      .get();
    return snapshot.docs.map((doc) => doc.data() as Scholarship);
  } catch (error) {
    logger.error({ error, field }, "Error getting scholarships by field");
    throw error;
  }
};

export const getScholarshipsByDeadline = async (beforeDate: string): Promise<Scholarship[]> => {
  try {
    const snapshot = await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .where("deadline", "<=", beforeDate)
      .where("status", "==", "active")
      .orderBy("deadline", "asc")
      .get();
    return snapshot.docs.map((doc) => doc.data() as Scholarship);
  } catch (error) {
    logger.error({ error, beforeDate }, "Error getting scholarships by deadline");
    throw error;
  }
};

export const updateScholarship = async (
  id: string,
  data: Partial<Scholarship>
): Promise<void> => {
  try {
    await adminDb()
      .collection(SCHOLARSHIPS_COLLECTION)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    logger.error({ error, id }, "Error updating scholarship");
    throw error;
  }
};

export const deleteScholarship = async (id: string): Promise<void> => {
  try {
    await adminDb().collection(SCHOLARSHIPS_COLLECTION).doc(id).delete();
  } catch (error) {
    logger.error({ error, id }, "Error deleting scholarship");
    throw error;
  }
};

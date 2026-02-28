import { adminDb } from "@/lib/firebase/admin";
import type { Document } from "@/lib/schemas/document.schema";
import { logger } from "@/lib/utils/logger";

const DOCUMENTS_COLLECTION = "documents";

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

function sanitizeDocumentData(data: Record<string, unknown>): Document {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "uploadedAt" || key === "createdAt" || key === "updatedAt") {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as Document;
}

export const createDocument = async (document: Document): Promise<void> => {
  try {
    await adminDb()
      .collection(DOCUMENTS_COLLECTION)
      .doc(document.id)
      .set(document);
  } catch (error) {
    logger.error({ error, documentId: document.id }, "Error creating document");
    throw error;
  }
};

export const getDocument = async (id: string): Promise<Document | null> => {
  try {
    const doc = await adminDb().collection(DOCUMENTS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return sanitizeDocumentData(doc.data() as Record<string, unknown>);
  } catch (error) {
    logger.error({ error, id }, "Error getting document");
    throw error;
  }
};

export const getDocumentsByUser = async (uid: string): Promise<Document[]> => {
  try {
    const snapshot = await adminDb()
      .collection(DOCUMENTS_COLLECTION)
      .where("uid", "==", uid)
      .orderBy("uploadedAt", "desc")
      .get();
    return snapshot.docs.map((doc) => sanitizeDocumentData(doc.data() as Record<string, unknown>));
  } catch (error) {
    logger.error({ error, uid }, "Error getting user documents");
    throw error;
  }
};

export const getDocumentsByType = async (
  uid: string,
  type: string,
): Promise<Document[]> => {
  try {
    const snapshot = await adminDb()
      .collection(DOCUMENTS_COLLECTION)
      .where("uid", "==", uid)
      .where("type", "==", type)
      .orderBy("uploadedAt", "desc")
      .get();
    return snapshot.docs.map((doc) =>
      sanitizeDocumentData({ id: doc.id, ...doc.data() as Record<string, unknown> }),
    );
  } catch (error) {
    logger.error({ error, uid, type }, "Error getting documents by type");
    throw error;
  }
};

export const updateDocument = async (
  id: string,
  data: Partial<Document>,
): Promise<void> => {
  try {
    await adminDb().collection(DOCUMENTS_COLLECTION).doc(id).update(data);
  } catch (error) {
    logger.error({ error, id }, "Error updating document");
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    await adminDb().collection(DOCUMENTS_COLLECTION).doc(id).delete();
  } catch (error) {
    logger.error({ error, id }, "Error deleting document");
    throw error;
  }
};

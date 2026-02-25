import { adminDb } from "@/lib/firebase/admin";
import type { User } from "@/lib/schemas/user.schema";
import { logger } from "@/lib/utils/logger";

const USERS_COLLECTION = "users";

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

function sanitizeUserData(data: Record<string, unknown>): Partial<User> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "createdAt" || key === "updatedAt") {
      result[key] = convertTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result as Partial<User>;
}

export const createUser = async (user: User): Promise<void> => {
  try {
    await adminDb().collection(USERS_COLLECTION).doc(user.uid).set(user);
  } catch (error) {
    logger.error({ error, uid: user.uid }, "Error creating user");
    throw error;
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const doc = await adminDb().collection(USERS_COLLECTION).doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data() as Record<string, unknown>;
    return sanitizeUserData(data) as User;
  } catch (error) {
    logger.error({ error, uid }, "Error getting user");
    throw error;
  }
};

export const updateUser = async (
  uid: string,
  data: Partial<User>,
): Promise<void> => {
  try {
    await adminDb()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    logger.error({ error, uid }, "Error updating user");
    throw error;
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    await adminDb().collection(USERS_COLLECTION).doc(uid).delete();
  } catch (error) {
    logger.error({ error, uid }, "Error deleting user");
    throw error;
  }
};

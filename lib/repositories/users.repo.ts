import { adminDb } from "@/lib/firebase/admin";
import type { User } from "@/lib/schemas/user.schema";
import { logger } from "@/lib/utils/logger";

const USERS_COLLECTION = "users";

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
    return doc.data() as User;
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

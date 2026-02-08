import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";

let app: App | undefined;
let adminDbInstance: Firestore | undefined;
let adminAuthInstance: Auth | undefined;
let adminStorageInstance: Storage | undefined;

function getApp(): App {
  if (app) return app;

  const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(firebaseAdminConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    app = getApps()[0];
  }

  return app;
}

export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    adminDbInstance = getFirestore(getApp());
  }
  return adminDbInstance;
}

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    adminAuthInstance = getAuth(getApp());
  }
  return adminAuthInstance;
}

export function getAdminStorage(): Storage {
  if (!adminStorageInstance) {
    adminStorageInstance = getStorage(getApp());
  }
  return adminStorageInstance;
}

export {
  getAdminDb as adminDb,
  getAdminAuth as adminAuth,
  getAdminStorage as adminStorage,
};

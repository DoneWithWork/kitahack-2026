import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBA8PUqlnmE_iEa069eUeRFmIWurLL3qWM",
  authDomain: "kitahack-2026-2d937.firebaseapp.com",
  projectId: "kitahack-2026-2d937",
  storageBucket: "kitahack-2026-2d937.firebasestorage.app",
  messagingSenderId: "1031025448931",
  appId: "1:1031025448931:web:5cdd1a69b84fb2970032d6",
  measurementId: "G-EJNG55MCGK",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

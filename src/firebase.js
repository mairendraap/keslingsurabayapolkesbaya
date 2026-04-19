import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAfoa7oxrcAQqXPG0P2LLoAIh0eahRnc8o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "projectpoltekkes.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "projectpoltekkes",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "projectpoltekkes.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "38223967087",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:38223967087:web:ec0eccdcfa6b3900a1ee9a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-STK84MZ55D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

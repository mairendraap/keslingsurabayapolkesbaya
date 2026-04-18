import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfoa7oxrcAQqXPG0P2LLoAIh0eahRnc8o",
  authDomain: "projectpoltekkes.firebaseapp.com",
  projectId: "projectpoltekkes",
  storageBucket: "projectpoltekkes.firebasestorage.app",
  messagingSenderId: "38223967087",
  appId: "1:38223967087:web:ec0eccdcfa6b3900a1ee9a",
  measurementId: "G-STK84MZ55D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

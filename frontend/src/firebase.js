import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDA_2qijGC6Cu-1wxDOa8XgxFfRIZhVp3g",
  authDomain: "safecontractai-7767b.firebaseapp.com",
  projectId: "safecontractai-7767b",
  storageBucket: "safecontractai-7767b.firebasestorage.app",
  messagingSenderId: "74424395784",
  appId: "1:74424395784:web:9c89298e02ff199ab2c9bd",
  measurementId: "G-JLTDQD326S"
};

const app = initializeApp(firebaseConfig);

// ✅ Authentication (already used by Login & Signup)
export const auth = getAuth(app);

// ✅ Firestore Database (for user profiles, plans, usage, subscriptions)
export const db = getFirestore(app);

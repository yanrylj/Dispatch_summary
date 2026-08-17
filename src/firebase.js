// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- ADDED THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwF20wvvnvdWJUKYEOWvJcta562sS7ZLk",
  authDomain: "dispatch-summary.firebaseapp.com",
  projectId: "dispatch-summary",
  storageBucket: "dispatch-summary.firebasestorage.app",
  messagingSenderId: "172950457884",
  appId: "1:172950457884:web:2d5294651b72e0ab7899d9",
  measurementId: "G-YPV3CPGP1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Cloud Firestore and export it so the dashboard can use it
export const db = getFirestore(app); // <-- ADDED THIS
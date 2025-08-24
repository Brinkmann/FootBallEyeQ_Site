// /firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy164WRqX29NFm_N96bQa0gk_tIIGe_EY",
  authDomain: "footballeyeq-39b68.firebaseapp.com",
  projectId: "footballeyeq-39b68",
  storageBucket: "footballeyeq-39b68.firebasestorage.app",
  messagingSenderId: "1021562185489",
  appId: "1:1021562185489:web:d30418fdcc0b9743f6ceb0",
  measurementId: "G-PVS1TC39G6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;

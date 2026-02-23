import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3FGqBsbN-JW4OCtBKrJNGm-ZLsflx4l4",
  authDomain: "qiraa-h.firebaseapp.com",
  projectId: "qiraa-h",
  storageBucket: "qiraa-h.firebasestorage.app",
  messagingSenderId: "509263660322",
  appId: "1:509263660322:web:42646e191b95d33a67517b",
  measurementId: "G-CBTJ8MWP63"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // Optional

export default app;
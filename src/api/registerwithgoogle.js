import {
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "../schema/User";

const provider = new GoogleAuthProvider();

const generateId = () => Math.random().toString(36).substring(2, 12);

export const loginWithGoogle = async ({ setUser }) => {
  let firebaseUser = null;
  let userRef = null;

  try {
    // 1. Google Popup
    const result = await signInWithPopup(auth, provider);
    firebaseUser = result.user;

    const uid = firebaseUser.uid;
    userRef = doc(db, "users", uid);

    const snap = await getDoc(userRef);

    let data;

    // 2. If NEW user → create Firestore
    if (!snap.exists()) {

  const subscriptionId = generateId();
  const now = Date.now();

  /* ---------- CREATE SUBSCRIPTION ---------- */

  const subscriptionRef = doc(db, "subscriptions", subscriptionId);

  await setDoc(subscriptionRef, {
    subscriptionId,
    userId: uid,
    type: "Basic",
    creditPerDay: 20,
    expiryDate: null,
    createdAt: now
  });

  /* ---------- CREATE USER ---------- */

  data = {
    fullname: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    role: "user",
    credits: 20,
    createdAt: now,
    lastLogin: now,
    subscriptionId
  };

  await setDoc(userRef, data);
}
else {
      // 3. Existing user
      data = snap.data();

      await updateDoc(userRef, {
        lastLogin: Date.now()
      });
    }

    // 4. Normalize to User Model
    const normalizedUser = new User({
      userId: uid,
      name: data.fullname,
      email: data.email,
      role: data.role,
      credits: data.credits,
      createdAt: data.createdAt,
      lastLogin: Date.now(),
      subscription: data.subscription
    });

    // 5. Store in Context
    setUser(normalizedUser);

    return { success: true, user: normalizedUser };

  } catch (error) {
    console.error("Google Auth Failed:", error.message);

    // ---------- ROLLBACK ----------
    try {
      if (userRef) await deleteDoc(userRef);
      if (firebaseUser) await deleteUser(firebaseUser);
    } catch (rollbackErr) {
      console.error("Rollback Error:", rollbackErr.message);
    }

    return { success: false, message: error.message };
  }
};

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "../schema/User"; // your class
// NO other imports

export const loginUser = async ({ email, password, setUser }) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;

    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      throw new Error("User record not found");
    }

    const data = snap.data();

    await updateDoc(userRef, {
      lastLogin: Date.now(),
    });

    const normalizedUser = new User({
      userId: firebaseUser.uid,
      name: data.fullname || "",
      email: data.email || "",
      role: data.role || "user",
      credits: data.credits || 0,
      createdAt: data.createdAt || null,
      lastLogin: Date.now(),
      subscription: data.subscription || {}
    });

    setUser(normalizedUser);

    return { success: true, user: normalizedUser };

  } catch (error) {
    console.error("Login Failed:", error.message);
    return { success: false, message: error.message };
  }
};


const generateId = () => Math.random().toString(36).substring(2, 12);

export const signupUser = async ({ email, password, fullname }) => {
  let firebaseUser = null;
  let userDocRef = null;
  let subscriptionDocRef = null;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    firebaseUser = cred.user;

    const uid = firebaseUser.uid;
    const subscriptionId = generateId();

    const now = Date.now();

    /* ---------- CREATE SUBSCRIPTION ---------- */

    subscriptionDocRef = doc(db, "subscriptions", subscriptionId);

    await setDoc(subscriptionDocRef, {
      subscriptionId,
      userId: uid,
      type: "Basic",
      creditPerDay: 20,
      expiryDate: null,
      createdAt: now
    });

    /* ---------- CREATE USER ---------- */

    userDocRef = doc(db, "users", uid);

    await setDoc(userDocRef, {
      fullname,
      email,
      role: "user",
      credits: 20,
      createdAt: now,
      lastLogin: null,
      subscriptionId
    });

    return { success: true };

  } catch (error) {
    console.error("Signup Failed:", error.message);

    /* ---------- ROLLBACK ---------- */
    try {
      if (subscriptionDocRef) await deleteDoc(subscriptionDocRef);
      if (userDocRef) await deleteDoc(userDocRef);
      if (firebaseUser) await deleteUser(firebaseUser);
    } catch (rollbackError) {
      console.error("Rollback Failed:", rollbackError.message);
    }

    return { success: false, message: error.message };
  }
};

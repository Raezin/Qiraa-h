import { loginUser, signupUser } from "../api/login&signup";
import { loginWithGoogle as googleAuth } from "../api/registerwithgoogle";
import { useUser } from "./UserContext";

export function sendFeedback(subject, comment) {
  console.log(subject + " " + comment);
}

export function sendReview(rating, review) {
  console.log(rating + " " + review);
}

export function getReview() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

export function getRecordUser() {
  const user = 25;
  const evalu = 130;
  return { user, evalu };
}

/* ============================= */
/* AUTH FUNCTIONS */
/* ============================= */

export async function login(email, password, setUser) {
  try {
    const result = await loginUser({
      email,
      password,
      setUser
    });

    return result;

  } catch (e) {
    console.error("Login Error:", e);
    return { success: false, message: e.message };
  }
}

export async function signup(name, email, password) {
  try {
    const result = await signupUser({
      email,
      password,
      fullname: name
    });

    return result;

  } catch (e) {
    console.error("Signup Error:", e);
    return { success: false, message: e.message };
  }
}

export async function loginWithGoogleHandler(setUser) {
  try {
    const result = await googleAuth({ setUser });
    return result;

  } catch (e) {
    console.error("Google Login Error:", e);
    return { success: false, message: e.message };
  }
}

export async function signupWithGoogleHandler(setUser) {
  return await loginWithGoogleHandler(setUser);
}

export function clearUserRecord(removeUser) {
  try {
    removeUser();
    return true;
  } catch (e) {
    console.error("Clear User Error:", e);
    return false;
  }
}

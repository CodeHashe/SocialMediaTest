import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { success: true, user };
  } catch (error) {
    let message = "Something went wrong!";
    if (error.code === "auth/user-not-found") message = "User not found!";
    if (error.code === "auth/wrong-password") message = "Wrong password!";
    if (error.code === "auth/invalid-email") message = "Invalid email!";
    return { success: false, error: message };
  }
};

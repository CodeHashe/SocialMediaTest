// controllers/SignUpController.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

/**
 * Handles user signup with Firebase Auth & Firestore
 * @param {string} email 
 * @param {string} password 
 * @param {string} fullName
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const signUpUser = async (email, password, fullName) => {
  try {
    // Firebase Auth signup
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user profile in "users" collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      createdAt: new Date().toISOString(),
      followerCount: "0",
      postCount: "0",
      followingCount: "0",
      profilePic:""
    });

    // Initialize "friends" collection for this user
    await setDoc(doc(db, "friends", user.uid), {
      uid: user.uid,
      friends: [],
    });

    // Initialize "requests" collection for this user
    await setDoc(doc(db, "requests", user.uid), {
      uid: user.uid,
      requests: [],
    });

    return { success: true, message: "User created successfully!" };
  } catch (error) {
    let errorMessage = "Sign up failed!";
    console.log(error);
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already in use.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters.";
    }
    return { success: false, message: errorMessage };
  }
};

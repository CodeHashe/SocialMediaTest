import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios";

// Upload to Cloudinary
export const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  data.append("upload_preset", "socialmedia_unsigned");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dzamevr3s/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Cloudinary Upload Success:", response.data);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    throw error;
  }
};

// Create Post
export const createPost = async (uid, postContent, imageUri) => {
  try {
    const imageLink = await uploadToCloudinary(imageUri);

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User profile not found");

    const { fullName } = userSnap.data();

    await addDoc(collection(db, "posts"), {
      uid,
      fullName,
      postContent,
      imageLink,
      likes: 0,
      likedBy: [], // Ensure field is initialized
      comments: [],
      timestamp: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Post creation failed:", error);
    return { success: false, error: error.message };
  }
};

// Toggle Like
export const likePost = async (postId) => {
  try {
    const userId = auth.currentUser.uid;
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];

      if (likedBy.includes(userId)) {
        // Unlike
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: postData.likes > 0 ? postData.likes - 1 : 0,
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likedBy: arrayUnion(userId),
          likes: postData.likes + 1,
        });
      }
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    throw err;
  }
};

// Real-time listener for posts
export const subscribeToPosts = (callback) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });

  return unsubscribe;
};

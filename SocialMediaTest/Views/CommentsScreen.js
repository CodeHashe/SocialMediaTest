import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export default function CommentsScreen() {
  const route = useRoute();
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const userRef = doc(db, "users", data.uid);
        const userSnap = await getDoc(userRef);
        const userName = userSnap.exists() ? userSnap.data().fullName : "Unknown User";

        return {
          id: docSnap.id,
          ...data,
          userName,
        };
      });

      const commentsWithNames = await Promise.all(commentPromises);
      setComments(commentsWithNames);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Save as `text`
      const commentRef = await addDoc(collection(db, "comments"), {
        postId,
        uid: user.uid,
        text: newComment, // key is `text` instead of `content`
        timestamp: serverTimestamp(),
      });

      // Update post's `comments` array
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef.id),
      });

      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const renderItem = ({ item }) => {
    const time = item.timestamp?.toDate();
    const formattedTime = time
      ? new Intl.DateTimeFormat("en", {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
        }).format(time)
      : "";

    return (
      <View style={styles.commentBox}>
        <Text style={styles.commentAuthor}>{item.userName}</Text>
        <Text style={styles.commentTime}>{formattedTime}</Text>
        <Text style={styles.commentContent}>{item.text}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
      style={styles.mainContainer}
    >
      <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1 }}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }} // Leave space for input
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  commentBox: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#00BFA6",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

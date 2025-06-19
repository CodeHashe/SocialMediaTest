import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { subscribeToPosts } from "../Controllers/PostController";
import { AntDesign, Feather } from "@expo/vector-icons";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function HomePageScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

 useEffect(() => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const uid = currentUser.uid;
  setUserId(uid);

  
  const userRef = doc(db, "users", uid);
  const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      setProfilePic(docSnap.data().profilePic || null);
    }
  });

  const fetchFriendsAndSubscribe = async () => {
    try {
      const friendDoc = await getDoc(doc(db, "friends", uid));
      const friendUIDs = friendDoc.exists() ? friendDoc.data().friends || [] : [];

      const allowedUIDs = [...friendUIDs, uid];

      const unsubscribePosts = subscribeToPosts(allowedUIDs, async (rawPosts) => {
        const enriched = await Promise.all(
          rawPosts.map(async (post) => {
            try {
              const userSnap = await getDoc(doc(db, "users", post.uid));
              const userData = userSnap.exists() ? userSnap.data() : {};
              return {
                ...post,
                fullName: userData.fullName || "Unknown User",
                profilePic: userData.profilePic || null,
              };
            } catch {
              return { ...post, fullName: "Unknown User", profilePic: null };
            }
          })
        );
        setPosts(enriched);
      });

      return unsubscribePosts;
    } catch (err) {
      console.error("Error fetching friends or posts:", err);
    }
  };

  const unsubscribePromise = fetchFriendsAndSubscribe();

  return () => {
    unsubscribeUser(); 
    unsubscribePromise.then((unsub) => unsub && unsub()); 
  };
}, []);


  const handleLike = async (postId) => {
    try {
      const { likePost } = await import("../Controllers/PostController");
      await likePost(postId);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleCommentPress = (postId) => {
    navigation.navigate("Comments", { postId });
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
        style={styles.mainContainer}
      >
        <TouchableOpacity style={styles.profileBubble} onPress={handleProfilePress}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.bubbleImage} />
          ) : (
            <View style={styles.bubblePlaceholder} />
          )}
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.feed}>
          {posts.map((post) => {
            const likedByUser = post.likedBy?.includes(userId);
            return (
              <View key={post.id} style={styles.postCard}>
                {/* User Info */}
                <View style={styles.userRow}>
                  {post.profilePic ? (
                    <Image source={{ uri: post.profilePic }} style={styles.profilePic} />
                  ) : (
                    <View style={styles.placeholderPic} />
                  )}
                  <Text style={styles.userName}>{post.fullName}</Text>
                </View>

                {post.imageLink && (
                  <Image source={{ uri: post.imageLink }} style={styles.image} />
                )}
                <Text style={styles.text}>{post.postContent}</Text>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <AntDesign
                      name={likedByUser ? "like1" : "like2"}
                      size={20}
                      color={likedByUser ? "#00BFA6" : "#333"}
                    />
                    <Text style={styles.count}>{post.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCommentPress(post.id)}
                  >
                    <Feather name="message-circle" size={20} color="#333" />
                    <Text style={styles.count}>{post.comments?.length || 0}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  feed: {
    paddingVertical: 100,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  profileBubble: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    paddingTop:20,
  },
  bubbleImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  bubblePlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ccc",
  },
  postCard: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    marginLeft: 5,
    color: "#333",
    fontSize: 14,
  },
});

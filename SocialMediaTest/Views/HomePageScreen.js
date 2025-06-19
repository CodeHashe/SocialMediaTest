import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { subscribeToPosts, likePost } from "../Controllers/PostController";
import { AntDesign, Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function HomePageScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUserId(currentUser.uid);

    const unsubscribe = subscribeToPosts(async (rawPosts) => {
      const enrichedPosts = await Promise.all(
        rawPosts.map(async (post) => {
          try {
            const userRef = doc(db, "users", post.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              return {
                ...post,
                fullName: userData.fullName || "Unknown User",
                profilePic: userData.profilePic || null,
              };
            }
          } catch (err) {
            console.error("Error fetching user:", err);
          }

          return {
            ...post,
            fullName: "Unknown User",
            profilePic: null,
          };
        })
      );

      setPosts(enrichedPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    try {
      await likePost(postId); // toggles like
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <LinearGradient
      colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
      style={styles.mainContainer}
    >

      



      



      <ScrollView contentContainerStyle={styles.feed}>
        {posts.map((post) => {
          const likedByUser = post.likedBy?.includes(userId);

          return (
            <View key={post.id} style={styles.postCard}>
              {/* User Info Row */}
              <View style={styles.userRow}>
                {post.profilePic ? (
                  <Image
                    source={{ uri: post.profilePic }}
                    style={styles.profilePic}
                  />
                ) : (
                  <View style={styles.placeholderPic} />
                )}
                <Text style={styles.userName}>
                  {post.fullName || "Unknown User"}
                </Text>
              </View>

              {/* Post Image */}
              {post.imageLink ? (
                <Image source={{ uri: post.imageLink }} style={styles.image} />
              ) : null}

              {/* Post Text */}
              <Text style={styles.text}>{post.postContent}</Text>

              {/* Like & Comment Buttons */}
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
                <TouchableOpacity style={styles.actionButton}>
                  <Feather name="message-circle" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  feed: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
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

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function ProfilePageScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
      const postsSnap = await getDocs(postsQuery);
      const userPosts = postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);

      const followersSnap = await getDoc(doc(db, "followers", uid));
      setFollowerCount(followersSnap.exists() ? followersSnap.data().followers.length : 0);

      const friendsSnap = await getDoc(doc(db, "friends", uid));
      setFollowingCount(friendsSnap.exists() ? friendsSnap.data().friends.length : 0);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    }
  };

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        const imageUrl = await uploadToCloudinary(uri);
        await updateProfilePicture(imageUrl);
        fetchProfileData();
      } catch (err) {
        Alert.alert("Upload Failed", err.message);
      }
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    data.append("upload_preset", "socialmedia_unsigned");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dzamevr3s/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  };

  const updateProfilePicture = async (url) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { profilePic: url });

    const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
    const postDocs = await getDocs(postsQuery);
    for (const docSnap of postDocs.docs) {
      const postRef = doc(db, "posts", docSnap.id);
      await updateDoc(postRef, { profilePic: url });
    }
  };

  const signOutUser = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      Alert.alert("Sign Out Failed", error.message);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={pickAndUploadImage}>
        <Image
          source={{ uri: userData.profilePic || "https://placehold.co/100x100" }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.username}>@{userData.uid || "username"}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Post</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{followerCount}</Text>
          <Text style={styles.statLabel}>Follower</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <TouchableOpacity onPress={signOutUser} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

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
      <View style={styles.postCard}>
        {item.imageLink && (
          <Image source={{ uri: item.imageLink }} style={styles.postImage} />
        )}
        <Text style={styles.postContent}>{item.postContent}</Text>
        <Text style={styles.postTimestamp}>{formattedTime}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
      style={styles.mainContainer}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gallery}
        renderItem={renderItem}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  gallery: {
    paddingBottom: 30,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  postTimestamp: {
    fontSize: 12,
    color: "#888",
  },
  signOutButton: {
    marginTop: 15,
    backgroundColor: "#ff6666",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

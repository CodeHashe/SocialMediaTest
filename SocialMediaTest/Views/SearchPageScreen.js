import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function SearchPageScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const currentUid = auth.currentUser?.uid;
  const [currentUserData, setCurrentUserData] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUserRef = doc(db, "users", currentUid);
      const snap = await getDoc(currentUserRef);
      if (snap.exists()) {
        setCurrentUserData(snap.data());
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const usersRef = collection(db, "users");

      const byNameQuery = query(usersRef, where("fullName", ">=", searchTerm));
      const byUidQuery = query(usersRef, where("uid", "==", searchTerm));

      const [nameSnap, uidSnap] = await Promise.all([
        getDocs(byNameQuery),
        getDocs(byUidQuery),
      ]);

      const usersMap = new Map();

      nameSnap.forEach((doc) => {
        if (doc.id !== currentUid) usersMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      uidSnap.forEach((doc) => {
        if (doc.id !== currentUid) usersMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      setResults(Array.from(usersMap.values()));
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const sendFriendRequest = async (targetUid) => {
    try {
      const requestRef = doc(db, "requests", targetUid);
      const userName = currentUserData.fullName || "Unknown User";

      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        await updateDoc(requestRef, {
          requests: arrayUnion({ uid: currentUid, name: userName }),
        });
      } else {
        await setDoc(requestRef, {
          requests: [{ uid: currentUid, name: userName }],
        });
      }

      Alert.alert("Request Sent", "Your friend request has been sent.");
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.name}>{item.fullName} (@{item.username || item.id})</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => sendFriendRequest(item.id)}
      >
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
        style={styles.mainContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Search by name or UID"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 2,
  },
  resultItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#00BFA6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
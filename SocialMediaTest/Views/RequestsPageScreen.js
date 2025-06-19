import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function RequestsPageScreen() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);

  const fetchFriendsAndRequests = async () => {
    try {
      const friendsSnap = await getDoc(doc(db, "friends", uid));
      setFriends(friendsSnap.exists() ? friendsSnap.data().friends || [] : []);

      const requestsSnap = await getDoc(doc(db, "requests", uid));
      setRequests(requestsSnap.exists() ? requestsSnap.data().requests || [] : []);
    } catch (err) {
      console.error("Failed to fetch friends or requests:", err);
    }
  };

  const acceptRequest = async (sender) => {
    try {
     
      const userRef = doc(db, "friends", uid);
      await updateDoc(userRef, {
        friends: arrayUnion(sender.uid),
      });

      const senderRef = doc(db, "friends", sender.uid);
      await updateDoc(senderRef, {
        friends: arrayUnion(uid),
      });

      
      const reqRef = doc(db, "requests", uid);
      await updateDoc(reqRef, {
        requests: arrayRemove(sender),
      });

      fetchFriendsAndRequests();
    } catch (err) {
      Alert.alert("Error accepting request", err.message);
    }
  };

  return (
    <LinearGradient
      colors={["#8EFBE1", "#BDFBED", "#EDF9F5", "#F8F8F8"]}
      style={styles.mainContainer}
    >
      <Text style={styles.heading}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text>{item}</Text>
          </View>
        )}
      />

      <Text style={styles.heading}>Friend Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text>{item.name}</Text>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => acceptRequest(item)}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  itemBox: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  acceptBtn: {
    backgroundColor: "#00BFA6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
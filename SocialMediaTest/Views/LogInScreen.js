import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, TextInput, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useState } from "react";
import Button from "./Button.js";
import { signInUser } from "../Controllers/SignInController.js"; // import controller

export default function LogInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await signInUser(email, password);
    if (result.success) {
      Alert.alert("Login Successful", `Welcome back ${result.user.email}`);
      navigation.navigate("Home")
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  return (
    <LinearGradient
      colors={['#8EFBE1', '#BDFBED', '#EDF9F5', '#F8F8F8']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.heading}>Log In</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Log In"
            textColor="white"
            buttonColor="#a8fdea"
            buttonEvent={handleLogin}
          />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  heading: {
    fontFamily: "Altone-Bold",
    fontSize: 28,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Altone-Bold",
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
  backgroundColor: "#fff",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 15,
  fontSize: 14,
  fontFamily: "Poppins_400Regular", // <-- switch here
  color: "#000",
  borderColor: "#ccc",
  borderWidth: 1,
},
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
});

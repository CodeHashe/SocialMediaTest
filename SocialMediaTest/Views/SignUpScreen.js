import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "./Button.js";
import { signUpUser } from "../Controllers/SignUpController";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    setLoading(true);

    const fullName = `${firstName} ${lastName}`;
    const { success, message } = await signUpUser(email, password, fullName);

    setLoading(false);

    if (success) {
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          },
        },
      ]);
    } else {
      Alert.alert("Sign Up Failed", message);
    }
  };

  return (
    <LinearGradient
      colors={['#8EFBE1', '#BDFBED', '#EDF9F5', '#F8F8F8']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.heading}>Sign Up</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  placeholder="Enter your First Name"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Enter your Last Name"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="Enter your Email"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="Enter your Password"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>

              <View style={styles.buttonContainer}>
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="#00c7be" />
                    <Text style={styles.loadingText}>Signing you up...</Text>
                  </>
                ) : (
                  <Button
                    text="Sign Up"
                    textColor="white"
                    buttonColor="#a8fdea"
                    buttonEvent={handleSignUp}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
    fontFamily: "Poppins_400Regular",
    color: "#000",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
});

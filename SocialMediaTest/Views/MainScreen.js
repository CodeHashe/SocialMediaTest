import { View, StyleSheet, Image } from "react-native";
import Button from "./Button";
import { LinearGradient } from 'expo-linear-gradient';

export default function MainScreen({navigation}) {
  return (
    <LinearGradient
      colors={['#8EFBE1', '#BDFBED','#EDF9F5','#F8F8F8']}
      style={styles.mainContainer}
    >
      <Image source={require("../assets/LogoBlack.png")} style={styles.logo} />

      <Button
        text="Log In"
        textColor="white"
        buttonColor="#a8fdea"
        buttonEvent={() => navigation.navigate("LogIn")}
      />

      <Button
        text="Sign Up"
        textColor="#a8fdea"
        buttonColor="white"
        buttonEvent={() => navigation.navigate("SignUp")}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width:"100%",
    gap:30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain',
  },
});

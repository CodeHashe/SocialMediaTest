import { View, StyleSheet, Image } from "react-native";
import Button from "./Button";
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchPageScreen({navigation}) {
  return (
    <LinearGradient
      colors={['#8EFBE1', '#BDFBED','#EDF9F5','#F8F8F8']}
      style={styles.mainContainer}
    >
      
      

      
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

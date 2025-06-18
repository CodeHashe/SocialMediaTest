import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function Button({ text, textColor, buttonColor, buttonEvent }) {
  return (
    <TouchableOpacity
      style={[
        styles.mainContainer,
        {
          backgroundColor: buttonColor,
          borderColor: buttonColor,
        },
      ]}
      onPress={buttonEvent}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    borderRadius: 30,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  text: {
    fontFamily: "Altone-BoldOblique",
    fontSize: 20,
  },
});

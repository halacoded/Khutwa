import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Khutwa</Text>

      <View style={styles.buttonGroup}>
        <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
        <View style={styles.spacer} />
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  buttonGroup: {
    width: "100%",
    paddingHorizontal: 20,
  },
  spacer: {
    height: 12,
  },
});

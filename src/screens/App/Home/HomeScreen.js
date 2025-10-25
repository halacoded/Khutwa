import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import UserContext from "../../../context/UserContext";

const HomeScreen = () => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Welcome Home!</Text>
      <Text style={styles.subtitle}>
        Hello, {user?.user?.name || "Guest"} 👋
      </Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
});

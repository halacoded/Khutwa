import React from "react";
import { View, Text, StyleSheet } from "react-native";
const SettingsScreen = () => (
  <View style={styles.container}>
    <Text>Welcome to Stting!</Text>
  </View>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

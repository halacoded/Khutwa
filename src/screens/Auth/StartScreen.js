import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Top Spacer */}
        <View style={styles.topSpacer} />

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.appName}>Khutwa.</Text>
          <Text style={styles.subtitle}>Diabetic Foot Care</Text>

          <View style={styles.divider} />

          <Text style={styles.description}>
            Smart monitoring for prevention and peace of mind.
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("SignIn")}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>© Khutwa 2024</Text>
        </View>
      </View>
    </>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  topSpacer: {
    flex: 0.2,
  },
  content: {
    flex: 0.5,
    justifyContent: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "300",
    color: "#1A202C",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4299E1",
    fontWeight: "400",
    letterSpacing: 0.3,
    marginBottom: 24,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: "#4299E1",
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: "#718096",
    fontWeight: "400",
    lineHeight: 22,
    maxWidth: "80%",
  },
  bottomSection: {
    flex: 0.3,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  signInButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#4299E1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  signUpButton: {
    width: "100%",
    height: 52,
    backgroundColor: "transparent",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#4299E1",
  },
  signUpText: {
    color: "#4299E1",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  footerText: {
    color: "#A0AEC0",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
});

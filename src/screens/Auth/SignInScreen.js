import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { signin, getMe } from "../../apis/user";
import UserContext from "../../context/UserContext";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleSignIn = async () => {
    // Only log in development mode if needed
    if (__DEV__) {
      console.log("Sign in attempted");
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signin({ email, password });
      const profile = await getMe();
      // Only log in development
      if (__DEV__) {
        console.log("Login successful");
      }
      setUser(profile);
    } catch (error) {
      // Don't log the full error to console to avoid "Unauthorized" message

      // Get the actual error message from the response
      const errorStatus = error.response?.status;
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error;

      // Handle 401 Unauthorized specifically
      if (errorStatus === 401) {
        // Clear both fields and show error
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password",
        });

        Alert.alert(
          "Login Failed",
          "The email or password you entered is incorrect. Please try again.",
          [{ text: "OK" }],
        );
      }
      // Handle 404 Not Found (user doesn't exist)
      else if (errorStatus === 404) {
        setErrors({
          email: "Account not found",
        });

        Alert.alert(
          "Account Not Found",
          "No account found with this email. Would you like to create one?",
          [
            { text: "Try Again", style: "cancel" },
            {
              text: "Sign Up",
              onPress: () => navigation.navigate("SignUp"),
              style: "default",
            },
          ],
        );
      }
      // Handle 400 Bad Request (validation errors)
      else if (errorStatus === 400) {
        if (errorData?.errors) {
          // Handle field-specific validation errors from backend
          const backendErrors = {};
          Object.keys(errorData.errors).forEach((key) => {
            backendErrors[key] = errorData.errors[key];
          });
          setErrors(backendErrors);
        } else {
          Alert.alert(
            "Login Failed",
            errorMessage || "Please check your input and try again.",
          );
        }
      }
      // Handle network errors
      else if (
        error.message &&
        error.message.toLowerCase().includes("network")
      ) {
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection.",
          [{ text: "OK" }],
        );
      }
      // Handle all other errors silently
      else {
        Alert.alert(
          "Login Failed",
          "An unexpected error occurred. Please try again.",
          [{ text: "OK" }],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password?",
      "Please contact support for password recovery or create a new account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Up",
          onPress: () => navigation.navigate("SignUp"),
          style: "default",
        },
      ],
    );
  };

  const getInputStyle = (fieldName) => [
    styles.input,
    errors[fieldName] && styles.inputError,
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Spacer for status bar */}
          <View style={styles.topSpacer} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Khutwa.</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
          </View>

          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={getInputStyle("email")}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!loading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Password <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={getInputStyle("password")}
                placeholder="Enter your password"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  topSpacer: {
    height: Platform.OS === "ios" ? 50 : 40,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    color: "#1A202C",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#4299E1",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 6,
  },
  required: {
    color: "#4299E1",
    fontWeight: "400",
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A202C",
  },
  inputError: {
    borderColor: "#E53E3E",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#718096",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4299E1",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4299E1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#BEE3F8",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#718096",
    fontSize: 14,
  },
  linkText: {
    color: "#4299E1",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SignInScreen;

import React, { useState } from "react";
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
  Picker,
} from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient",
    dateOfBirth: "",
    licenseNumber: "",
    specialization: "",
    hospital: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignUp = () => {
    console.log("Sign up attempted with:", formData);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Registration successful!");
      navigation.replace("MainTabs");
    }, 1500);
  };

  const isPatient = formData.role === "patient";
  const isDoctor = formData.role === "doctor";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Khutwa</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>
        </View>

        <View style={styles.form}>
          {/* Common Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Type *</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  isPatient && styles.roleButtonActive,
                ]}
                onPress={() => handleInputChange("role", "patient")}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    isPatient && styles.roleButtonTextActive,
                  ]}
                >
                  Patient
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, isDoctor && styles.roleButtonActive]}
                onPress={() => handleInputChange("role", "doctor")}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    isDoctor && styles.roleButtonTextActive,
                  ]}
                >
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Patient Specific Fields */}
          {isPatient && (
            <View style={styles.roleSection}>
              <Text style={styles.roleSectionTitle}>Patient Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                  value={formData.dateOfBirth}
                  onChangeText={(value) =>
                    handleInputChange("dateOfBirth", value)
                  }
                  editable={!loading}
                />
              </View>
            </View>
          )}

          {/* Doctor Specific Fields */}
          {isDoctor && (
            <View style={styles.roleSection}>
              <Text style={styles.roleSectionTitle}>Doctor Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>License Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your medical license number"
                  placeholderTextColor="#999"
                  value={formData.licenseNumber}
                  onChangeText={(value) =>
                    handleInputChange("licenseNumber", value)
                  }
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Specialization</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Podiatry, Endocrinology"
                  placeholderTextColor="#999"
                  value={formData.specialization}
                  onChangeText={(value) =>
                    handleInputChange("specialization", value)
                  }
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Hospital/Clinic</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your hospital or clinic name"
                  placeholderTextColor="#999"
                  value={formData.hospital}
                  onChangeText={(value) => handleInputChange("hospital", value)}
                  editable={!loading}
                />
              </View>
            </View>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2D3748",
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#4299E1",
    borderColor: "#4299E1",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#718096",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  roleSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4299E1",
  },
  roleSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4299E1",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#BEE3F8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "600",
  },
});

export default SignUpScreen;

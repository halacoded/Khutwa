import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import UserContext from "../../../context/UserContext";
import { deleteToken } from "../../../apis/storage";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const details = user?.user || {};
  const profile = details?.profile || {};

  const handleLogout = async () => {
    await deleteToken();
    setUser(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{details.name || "—"}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{details.email || "—"}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{details.phone || "—"}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{details.role || "—"}</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>
          {profile?.dateOfBirth?.slice(0, 10) || "—"}
        </Text>

        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{details.id || "—"}</Text>

        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>
          {details.createdAt?.slice(0, 10) || "—"}
        </Text>
      </View>

      <View style={styles.logoutBox}>
        <Button title="Log Out" color="#E53E3E" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: "#4A5568",
  },
  logoutBox: {
    marginTop: 40,
    alignItems: "center",
  },
});

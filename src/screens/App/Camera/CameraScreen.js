import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { createFootAnalysis } from "../../../apis/footAnalysis";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CameraScreen = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Request permission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Take photo with camera
  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setSelectedImage(photo.uri);
        analyzeImage(photo.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  // Upload to backend for analysis
  const analyzeImage = async (uri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "foot.jpg",
      });

      const data = await createFootAnalysis(formData);
      setResult(data);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Analysis Failed", "Please try again");
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle permission states
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Back Arrow Button - Positioned at top left */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Live camera preview */}
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />

      {/* Capture button */}
      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePhoto}
        disabled={loading}
      />

      {/* Gallery button bottom-left */}
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={pickImage}
        disabled={loading}
      >
        <Text style={styles.galleryText}>Gallery</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing...</Text>
        </View>
      )}

      {/* Result popup */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.resultTitle}>Analysis Results</Text>
            <Text>{JSON.stringify(result, null, 2)}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50, // Adjust for status bar
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  galleryButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  galleryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxHeight: "70%",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraScreen;

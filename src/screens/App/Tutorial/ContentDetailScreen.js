import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as educationalAPI from "../../../apis/educational";

const ContentDetailScreen = ({ route, navigation }) => {
  const { contentId } = route.params;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await educationalAPI.getContentById(contentId);
      setContent(response.content);
    } catch (error) {
      setError("Failed to load content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (photo) => {
    if (!photo) return null;
    return { uri: `http://192.168.8.87:10000/media/${photo}` };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  if (error || !content) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#CBD5E0" />
        <Text style={styles.errorText}>{error || "Content not found"}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Image */}
          {content.photo ? (
            <Image
              source={getImageUrl(content.photo)}
              style={styles.headerImage}
            />
          ) : (
            <View style={styles.headerPlaceholder}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#CBD5E0"
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Meta Info */}
            <View style={styles.metaContainer}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{content.contentType}</Text>
              </View>
              <View style={styles.viewsContainer}>
                <Ionicons name="eye-outline" size={16} color="#A0AEC0" />
                <Text style={styles.viewsText}>{content.views} views</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{content.title}</Text>

            {/* Author & Date */}
            <View style={styles.authorContainer}>
              <View style={styles.authorInfo}>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#4299E1"
                />
                <Text style={styles.authorText}>
                  {content.createdBy?.name || "Khutwa Team"}
                </Text>
              </View>
              <Text style={styles.dateText}>
                {new Date(content.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>

            {/* Category */}
            <View style={styles.categoryContainer}>
              <Ionicons name="pricetag-outline" size={16} color="#4299E1" />
              <Text style={styles.categoryText}>
                {content.category.replace("_", " ")}
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>{content.description}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Full Content */}
            <Text style={styles.contentText}>{content.content}</Text>
          </View>
        </ScrollView>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4299E1" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: "#4299E1",
    fontSize: 16,
    fontWeight: "600",
  },
  headerImage: {
    width: "100%",
    height: 250,
  },
  headerPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    color: "#4299E1",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  viewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 14,
    color: "#718096",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorText: {
    fontSize: 14,
    color: "#4299E1",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    color: "#A0AEC0",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: "#4299E1",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 15,
    color: "#2D3748",
    lineHeight: 24,
  },
});

export default ContentDetailScreen;

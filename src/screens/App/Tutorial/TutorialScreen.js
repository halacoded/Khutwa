import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as educationalAPI from "../../../apis/educational";

const TutorialScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const categories = [
    { id: "all", label: "All", icon: "apps-outline" },
    { id: "prevention", label: "Prevention", icon: "shield-outline" },
    { id: "foot_care", label: "Foot Care", icon: "footsteps-outline" },
    { id: "nutrition", label: "Nutrition", icon: "nutrition-outline" },
    { id: "exercise", label: "Exercise", icon: "fitness-outline" },
    { id: "monitoring", label: "Monitoring", icon: "pulse-outline" },
    { id: "emergency", label: "Emergency", icon: "warning-outline" },
  ];

  const loadContent = async (
    page = 1,
    category = selectedCategory,
    search = searchQuery,
  ) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit,
        sort: "createdAt",
        order: "desc",
      };

      if (category !== "all") {
        params.category = category;
      }

      if (search.trim()) {
        params.search = search;
      }

      const response = await educationalAPI.getAllContent(params);

      if (page === 1) {
        setContent(response.content);
      } else {
        setContent((prev) => [...prev, ...response.content]);
      }

      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadContent(1, selectedCategory, searchQuery);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages && !loading) {
      loadContent(pagination.page + 1, selectedCategory, searchQuery);
    }
  };

  const handleSearch = () => {
    loadContent(1, selectedCategory, searchQuery);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    loadContent(1, categoryId, searchQuery);
  };

  const handleContentPress = (contentId) => {
    navigation.navigate("ContentDetail", { contentId });
  };

  const getImageUrl = (photo) => {
    if (!photo) return null;
    return { uri: `http://192.168.8.87:10000/media/${photo}` };
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={selectedCategory === item.id ? "#4299E1" : "#718096"}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contentCard}
      onPress={() => handleContentPress(item._id)}
      activeOpacity={0.7}
    >
      {item.photo ? (
        <Image source={getImageUrl(item.photo)} style={styles.contentImage} />
      ) : (
        <View style={styles.contentImagePlaceholder}>
          <Ionicons name="document-text-outline" size={32} color="#CBD5E0" />
        </View>
      )}

      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <View style={styles.contentTypeBadge}>
            <Text style={styles.contentTypeText}>{item.contentType}</Text>
          </View>
          <View style={styles.viewsContainer}>
            <Ionicons name="eye-outline" size={14} color="#A0AEC0" />
            <Text style={styles.viewsText}>{item.views}</Text>
          </View>
        </View>

        <Text style={styles.contentTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.contentDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.contentFooter}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag-outline" size={12} color="#4299E1" />
            <Text style={styles.categoryBadgeText}>
              {item.category.replace("_", " ")}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}></View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#A0AEC0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, guides..."
            placeholderTextColor="#A0AEC0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                loadContent(1, selectedCategory, "");
              }}
            >
              <Ionicons name="close-circle" size={20} color="#A0AEC0" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {pagination.total} {pagination.total === 1 ? "result" : "results"}
        </Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={64} color="#CBD5E0" />
      <Text style={styles.emptyTitle}>No content found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your search or category filter
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || content.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4299E1" />
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={content}
          renderItem={renderContentItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmpty : null}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1A202C",
  },
  searchButton: {
    backgroundColor: "#4299E1",
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  categoryItemActive: {
    backgroundColor: "#EBF8FF",
    borderColor: "#4299E1",
  },
  categoryText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#4299E1",
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  contentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contentImage: {
    width: 100,
    height: 100,
  },
  contentImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  contentInfo: {
    flex: 1,
    padding: 12,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  contentTypeBadge: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  contentTypeText: {
    fontSize: 10,
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
    fontSize: 12,
    color: "#A0AEC0",
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 13,
    color: "#718096",
    lineHeight: 18,
    marginBottom: 8,
  },
  contentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: "#4299E1",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  dateText: {
    fontSize: 11,
    color: "#A0AEC0",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default TutorialScreen;

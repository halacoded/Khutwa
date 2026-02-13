import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons"; // CHANGED: Single import for all icons
import * as ImagePicker from "expo-image-picker";
import UserContext from "../../../context/UserContext";
import { deleteToken } from "../../../apis/storage";
import {
  updateUser,
  getUsersSharingWithMe,
  getUsersICanSee,
  removeSharedAccess,
  shareMyData,
  searchUsersForSharing,
  stopSeeingUserData,
} from "../../../apis/user";

const SettingsScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sharedAccessModal, setSharedAccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("peopleIShareWith");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [peopleIShareWith, setPeopleIShareWith] = useState([]);
  const [peopleSharingWithMe, setPeopleSharingWithMe] = useState([]);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const details = user?.user || {};
  const profileImage = details.ProfileImage
    ? { uri: `http://192.168.8.87:10000/media/${details.ProfileImage}` }
    : null;

  const [editForm, setEditForm] = useState({
    name: details.name || "",
    phone: details.phone || "",
  });

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await deleteToken();
          setUser(false);
        },
      },
    ]);
  };

  const handleChangePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to allow access to your photos",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLoading(true);
        const formData = new FormData();
        const asset = result.assets[0];

        const uriParts = asset.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("ProfileImage", {
          uri: asset.uri,
          type: `image/${fileType}`,
          name: `profile.${fileType}`,
        });

        await updateUser(formData);
        Alert.alert("Success", "Profile photo updated");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to update photo");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("phone", editForm.phone);

      await updateUser(formData);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSharedAccessData = async () => {
    try {
      setLoading(true);
      const [sharingWithMe, iCanSee] = await Promise.all([
        getUsersSharingWithMe(),
        getUsersICanSee(),
      ]);

      setPeopleSharingWithMe(sharingWithMe.users || []);
      setPeopleIShareWith(iCanSee.users || []);
      setSharedAccessModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to load shared access data");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeMyAccess = (userId, name) => {
    Alert.alert("Revoke Access", `Stop sharing your data with ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Revoke",
        style: "destructive",
        onPress: async () => {
          try {
            await removeSharedAccess(userId);
            loadSharedAccessData();
            Alert.alert("Success", `Access revoked from ${name}`);
          } catch (error) {
            Alert.alert("Error", "Failed to revoke access");
          }
        },
      },
    ]);
  };

  const handleStopSeeingData = (userId, name) => {
    Alert.alert("Stop Viewing", `Remove yourself from seeing ${name}'s data?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await stopSeeingUserData(userId);
            loadSharedAccessData();
            Alert.alert("Success", `You can no longer see ${name}'s data`);
          } catch (error) {
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to remove access",
            );
          }
        },
      },
    ]);
  };

  const openSearchModal = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchModalVisible(true);
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      Alert.alert("Search", "Please enter at least 2 characters");
      return;
    }

    try {
      setSearchLoading(true);
      const results = await searchUsersForSharing(searchQuery);
      setSearchResults(results.users || []);
    } catch (error) {
      Alert.alert("Error", "Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddUserToShareMyData = async (targetUserId, targetUserName) => {
    Alert.alert(
      "Share Your Data",
      `Allow ${targetUserName} to see YOUR health data?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Share",
          onPress: async () => {
            try {
              await shareMyData(targetUserId);
              Alert.alert("Success", `${targetUserName} can now see your data`);
              setSearchModalVisible(false);
              loadSharedAccessData();
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to share data",
              );
            }
          },
        },
      ],
    );
  };

  const renderSettingItem = (
    icon,
    title,
    subtitle,
    onPress,
    rightElement = null,
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <Ionicons
          name={icon}
          size={24}
          color="#4A5568"
          style={styles.settingIcon}
        />
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward-outline" size={20} color="#A0AEC0" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <TouchableOpacity
                onPress={handleChangePhoto}
                style={styles.profileImageContainer}
              >
                {profileImage ? (
                  <Image source={profileImage} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImagePlaceholderText}>
                      {details.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
                <View style={styles.editBadge}>
                  <Ionicons name="camera-outline" size={12} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{details.name || "User"}</Text>
                <Text style={styles.profileEmail}>{details.email || ""}</Text>
                <View style={styles.roleBadge}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={12}
                    color="#3182CE"
                  />
                  <Text style={styles.roleText}>
                    {details.isAdmin ? "Admin" : "Patient"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>

            {renderSettingItem(
              "person-outline",
              "Edit Profile",
              "Update your personal information",
              () => setEditModalVisible(true),
            )}

            {renderSettingItem(
              "people-outline",
              "Data Sharing",
              `Manage who sees your data and whose data you see`,
              loadSharedAccessData,
            )}
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>

            {renderSettingItem(
              "notifications-outline",
              "Notifications",
              "Manage your alerts and reminders",
              null,
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#CBD5E0", true: "#4299E1" }}
                thumbColor="#fff"
              />,
            )}

            {renderSettingItem(
              "moon-outline",
              "Dark Mode",
              "Switch between light and dark theme",
              null,
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#CBD5E0", true: "#4299E1" }}
                thumbColor="#fff"
              />,
            )}
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>

            {renderSettingItem(
              "help-circle-outline",
              "Help Center",
              "Get help and learn more",
              () => navigation.navigate("HelpCenter"),
            )}

            {renderSettingItem(
              "document-text-outline",
              "Terms & Privacy",
              "Read our terms and privacy policy",
              () => navigation.navigate("TermsPrivacy"),
            )}

            {renderSettingItem(
              "information-circle-outline",
              "About",
              "Version 1.0.0",
              () => navigation.navigate("About"),
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#E53E3E" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Khutwa v1.0.0</Text>
            <Text style={styles.footerText}>
              ID: {details.id?.slice(-8) || "—"}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, name: text })
                }
                placeholder="Enter your name"
                placeholderTextColor="#A0AEC0"
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, phone: text })
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#A0AEC0"
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Data Sharing Modal - FIXED HEIGHT */}
      <Modal
        visible={sharedAccessModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: "80%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Data Sharing</Text>
              <TouchableOpacity onPress={() => setSharedAccessModal(false)}>
                <Ionicons name="close-outline" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#4299E1"
              />
              <Text style={styles.infoBannerText}>
                Control who can see your data and whose data you can see
              </Text>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "peopleIShareWith" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("peopleIShareWith")}
              >
                <View style={styles.tabIconContainer}>
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={24}
                    color={
                      activeTab === "peopleIShareWith" ? "#4299E1" : "#718096"
                    }
                  />
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>
                      {peopleIShareWith.length}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "peopleIShareWith" && styles.activeTabText,
                  ]}
                >
                  People I Share With
                </Text>
                <Text style={styles.tabSubtext}>I share MY data with them</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "peopleSharingWithMe" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("peopleSharingWithMe")}
              >
                <View style={styles.tabIconContainer}>
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={24}
                    color={
                      activeTab === "peopleSharingWithMe"
                        ? "#4299E1"
                        : "#718096"
                    }
                  />
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>
                      {peopleSharingWithMe.length}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "peopleSharingWithMe" && styles.activeTabText,
                  ]}
                >
                  People Sharing With Me
                </Text>
                <Text style={styles.tabSubtext}>
                  They share THEIR data with me
                </Text>
              </TouchableOpacity>
            </View>

            {/* ScrollView with fixed container */}
            <View style={styles.modalBodyContainer}>
              <ScrollView
                style={styles.modalBodyScroll}
                contentContainerStyle={styles.modalBodyContent}
                showsVerticalScrollIndicator={true}
              >
                {activeTab === "peopleIShareWith" ? (
                  <>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <Ionicons
                          name="arrow-up-circle-outline"
                          size={20}
                          color="#4299E1"
                        />
                        <Text style={styles.sectionHeaderTitle}>
                          People who can see MY data
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addButtonSmall}
                        onPress={() => {
                          setSharedAccessModal(false);
                          openSearchModal();
                        }}
                      >
                        <Ionicons
                          name="add-outline"
                          size={18}
                          color="#4299E1"
                        />
                        <Text style={styles.addButtonSmallText}>Add</Text>
                      </TouchableOpacity>
                    </View>

                    {peopleIShareWith.length > 0 ? (
                      peopleIShareWith.map((item) => (
                        <View key={item.id} style={styles.userCard}>
                          <View style={styles.userInfo}>
                            <View style={styles.userAvatar}>
                              <Text style={styles.avatarText}>
                                {item.name?.charAt(0)?.toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.userDetails}>
                              <Text style={styles.userName}>{item.name}</Text>
                              <Text style={styles.userEmail}>{item.email}</Text>
                              {item.phone && (
                                <View style={styles.userMeta}>
                                  <Ionicons
                                    name="call-outline"
                                    size={12}
                                    color="#718096"
                                  />
                                  <Text style={styles.userMetaText}>
                                    {item.phone}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.revokeButton}
                            onPress={() =>
                              handleRevokeMyAccess(item.id, item.name)
                            }
                          >
                            <Ionicons
                              name="close-circle-outline"
                              size={22}
                              color="#E53E3E"
                            />
                            <Text style={styles.revokeButtonText}>Revoke</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Ionicons
                          name="arrow-up-circle-outline"
                          size={64}
                          color="#CBD5E0"
                        />
                        <Text style={styles.emptyTitle}>No one has access</Text>
                        <Text style={styles.emptyText}>
                          You haven't shared your data with anyone yet
                        </Text>
                        <TouchableOpacity
                          style={styles.emptyButton}
                          onPress={() => {
                            setSharedAccessModal(false);
                            openSearchModal();
                          }}
                        >
                          <Ionicons
                            name="add-circle-outline"
                            size={20}
                            color="#fff"
                          />
                          <Text style={styles.emptyButtonText}>
                            Share Your Data
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionHeaderLeft}>
                        <Ionicons
                          name="arrow-down-circle-outline"
                          size={20}
                          color="#4299E1"
                        />
                        <Text style={styles.sectionHeaderTitle}>
                          People whose data I can see
                        </Text>
                      </View>
                    </View>

                    {peopleSharingWithMe.length > 0 ? (
                      peopleSharingWithMe.map((item) => (
                        <View key={item.id} style={styles.userCard}>
                          <View style={styles.userInfo}>
                            <View style={styles.userAvatar}>
                              <Text style={styles.avatarText}>
                                {item.name?.charAt(0)?.toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.userDetails}>
                              <Text style={styles.userName}>{item.name}</Text>
                              <Text style={styles.userEmail}>{item.email}</Text>
                              {item.sharedSince && (
                                <View style={styles.userMeta}>
                                  <Ionicons
                                    name="time-outline"
                                    size={12}
                                    color="#48BB78"
                                  />
                                  <Text
                                    style={[
                                      styles.userMetaText,
                                      { color: "#48BB78" },
                                    ]}
                                  >
                                    Since{" "}
                                    {new Date(
                                      item.sharedSince,
                                    ).toLocaleDateString()}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.stopViewingButton}
                            onPress={() =>
                              handleStopSeeingData(item.id, item.name)
                            }
                          >
                            <Ionicons
                              name="eye-off-outline"
                              size={22}
                              color="#E53E3E"
                            />
                            <Text style={styles.stopViewingButtonText}>
                              Stop
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Ionicons
                          name="arrow-down-circle-outline"
                          size={64}
                          color="#CBD5E0"
                        />
                        <Text style={styles.emptyTitle}>No shared data</Text>
                        <Text style={styles.emptyText}>
                          No one has shared their data with you yet
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Add extra bottom padding for better scrolling */}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Users Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: "80%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Data</Text>
              <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBodyContainer}>
              <ScrollView
                style={styles.modalBodyScroll}
                contentContainerStyle={styles.modalBodyContent}
              >
                <Text style={styles.searchDescription}>
                  Search for people you want to share your health data with
                </Text>

                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    autoCapitalize="none"
                    placeholderTextColor="#A0AEC0"
                  />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="search-outline" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <View key={user.id} style={styles.searchResultItem}>
                      <View style={styles.searchResultInfo}>
                        <View style={styles.searchResultAvatar}>
                          <Text style={styles.avatarText}>
                            {user.name?.charAt(0)?.toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.searchResultName}>
                            {user.name}
                          </Text>
                          <Text style={styles.searchResultEmail}>
                            {user.email}
                          </Text>
                        </View>
                      </View>
                      {user.canSeeMyData ? (
                        <View style={styles.alreadySharedBadge}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            color="#48BB78"
                          />
                          <Text style={styles.alreadySharedText}>Shared</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.shareButton}
                          onPress={() =>
                            handleAddUserToShareMyData(user.id, user.name)
                          }
                        >
                          <Ionicons
                            name="share-social-outline"
                            size={16}
                            color="#fff"
                          />
                          <Text style={styles.shareButtonText}>Share</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                ) : searchQuery.length > 0 && !searchLoading ? (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={48} color="#CBD5E0" />
                    <Text style={styles.noResultsText}>
                      No users found matching "{searchQuery}"
                    </Text>
                  </View>
                ) : (
                  <View style={styles.searchEmptyContainer}>
                    <Ionicons name="search-outline" size={64} color="#CBD5E0" />
                    <Text style={styles.emptyTitle}>Find Users</Text>
                    <Text style={styles.emptyText}>
                      Search by name or email to share your data
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: 0,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4299E1",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4299E1",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    color: "#3182CE",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#718096",
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#1A202C",
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  logoutText: {
    fontSize: 16,
    color: "#E53E3E",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#A0AEC0",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F7FAFC",
  },
  saveButton: {
    backgroundColor: "#4299E1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Styles for fixed height modal
  modalBodyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalBodyScroll: {
    flex: 1,
  },
  modalBodyContent: {
    paddingBottom: 16,
    minHeight: "100%",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#4299E1",
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#2C5282",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeTab: {
    backgroundColor: "#EBF8FF",
    borderColor: "#4299E1",
  },
  tabIconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  tabBadge: {
    position: "absolute",
    top: -8,
    right: -10,
    backgroundColor: "#4299E1",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
  },
  activeTabText: {
    color: "#4299E1",
  },
  tabSubtext: {
    fontSize: 9,
    color: "#A0AEC0",
    textAlign: "center",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
  },
  addButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonSmallText: {
    color: "#4299E1",
    fontSize: 13,
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4299E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 2,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userMetaText: {
    fontSize: 11,
    color: "#718096",
  },
  revokeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  revokeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E53E3E",
  },
  stopViewingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9E7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: "#FEEBC8",
  },
  stopViewingButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E53E3E",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    minHeight: 200,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4299E1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchDescription: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F7FAFC",
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#4299E1",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 52,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  searchResultInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchResultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4299E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A202C",
    marginBottom: 2,
  },
  searchResultEmail: {
    fontSize: 14,
    color: "#718096",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#48BB78",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  alreadySharedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  alreadySharedText: {
    color: "#48BB78",
    fontSize: 12,
    fontWeight: "600",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginTop: 12,
  },
  searchEmptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
});

export default SettingsScreen;

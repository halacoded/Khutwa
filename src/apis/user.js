import instance from ".";
import { storeToken } from "./storage";

const signup = async (userInfo) => {
  try {
    const { data } = await instance.post("/users/signup", userInfo);
    storeToken(data.token);
    return data;
  } catch (error) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw error;
  }
};

const signin = async (userInfo) => {
  try {
    const { data } = await instance.post("/users/signin", userInfo);
    storeToken(data.token);
    return data;
  } catch (error) {
    console.error("Error signing in:", error.response?.data || error.message);
    throw error;
  }
};

const getMe = async () => {
  try {
    const { data } = await instance.get("/users/profile");
    return data;
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const updateUser = async (userInfo) => {
  try {
    const { data } = await instance.put("/users/profile", userInfo);
    return data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ============================
// SHARED ACCESS FUNCTIONS
// ============================

/**
 * Share your data with another user
 * @param {string} targetUserId - The ID of the user to share data with
 */
const shareMyData = async (targetUserId) => {
  try {
    const { data } = await instance.post("/users/share", { targetUserId });
    return data;
  } catch (error) {
    console.error("Error sharing data:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Remove sharing access from a user
 * @param {string} targetUserId - The ID of the user to remove sharing from
 */
const removeSharedAccess = async (targetUserId) => {
  try {
    const { data } = await instance.delete(`/users/unshare/${targetUserId}`);
    return data;
  } catch (error) {
    console.error(
      "Error removing shared access:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get users who can see your data (people you've shared with)
 */
const getUsersICanSee = async () => {
  try {
    const { data } = await instance.get("/users/shared/users-i-can-see");
    return data;
  } catch (error) {
    console.error(
      "Error fetching users I can see:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Get users whose data you can see (people sharing with you)
 */
const getUsersSharingWithMe = async () => {
  try {
    const { data } = await instance.get("/users/shared/users-sharing-with-me");
    return data;
  } catch (error) {
    console.error(
      "Error fetching users sharing with me:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Search for users to share with
 * @param {string} searchQuery - Search term (name or email)
 */
const searchUsersForSharing = async (searchQuery) => {
  try {
    const { data } = await instance.get(
      `/users/shared/search?search=${encodeURIComponent(searchQuery)}`,
    );
    return data;
  } catch (error) {
    console.error(
      "Error searching users:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Remove a user from my shared list (stop seeing their data)
 * @param {string} targetUserId - The ID of the user to stop seeing
 */
const stopSeeingUserData = async (targetUserId) => {
  try {
    const { data } = await instance.delete(
      `/users/shared/remove/${targetUserId}`,
    );
    return data;
  } catch (error) {
    console.error(
      "Error stopping data visibility:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export {
  signup,
  signin,
  getMe,
  updateUser,
  shareMyData,
  removeSharedAccess,
  getUsersICanSee,
  getUsersSharingWithMe,
  searchUsersForSharing,
  stopSeeingUserData,
};

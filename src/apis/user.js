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
      error.response?.data || error.message
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
      error.response?.data || error.message
    );
    throw error;
  }
};

export { signup, signin, getMe, updateUser };

import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const storeToken = async (token) => {
  console.log("token", token);
  return await setItemAsync("token", token);
};

const getToken = async () => {
  const token = await getItemAsync("token");

  return token;
};

const deleteToken = async () => {
  const token = await deleteItemAsync("token");
  return token;
};

export { storeToken, getToken, deleteToken };

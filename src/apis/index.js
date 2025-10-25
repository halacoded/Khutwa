import axios from "axios";
import { getToken } from "./storage";
const BASE_URL = "http://192.168.8.54:10000";
const instance = axios.create({
  baseURL: `${BASE_URL}`,
});
instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default instance;
export { BASE_URL };

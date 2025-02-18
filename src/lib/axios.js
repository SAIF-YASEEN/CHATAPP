import axios from "axios";
import { BACKEND_URL } from "../backendurl.js";
export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // Ensures cookies are sent
});

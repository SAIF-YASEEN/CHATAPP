import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://test-repo-production-5712.up.railway.app/api"
      : "/api",
  withCredentials: true,
});

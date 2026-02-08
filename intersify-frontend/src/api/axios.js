import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Separate instance for public requests (no auth header)
export const publicApi = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT automatically for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
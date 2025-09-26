import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://flow-crm-backend.onrender.com/api";

console.log("🚀 API Base URL at runtime:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

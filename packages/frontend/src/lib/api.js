import axios from "axios";
import { getToken, clearToken } from "./tokenManager.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const endpoints = {
  health: "/api/health",
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    me: "/api/auth/me",
  },
};

// Request: gắn token nếu có
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: xử lý lỗi 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearToken();

      // Tránh vòng lặp khi đang ở /login
      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
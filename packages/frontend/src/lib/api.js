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
    checkUsername: "/api/auth/check-username",
    checkEmail: "/api/auth/check-email",
    checkPhone: "/api/auth/check-phone",
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

// API functions for checking availability
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await api.get(endpoints.auth.checkUsername, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkEmailAvailability = async (email) => {
  try {
    const response = await api.get(endpoints.auth.checkEmail, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkPhoneAvailability = async (phone) => {
  try {
    const response = await api.get(endpoints.auth.checkPhone, {
      params: { phone }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
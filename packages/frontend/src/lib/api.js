import axios from "axios";
import {
  getToken,
  getRefreshToken,
  clearAllTokens,
  setTokens,
  isTokenExpired,
} from "./tokenManager.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Quan trọng: withCredentials để FE nhận cookie (Google OAuth)
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const endpoints = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
    checkUsername: "/api/auth/check-username",
    checkEmail: "/api/auth/check-email",
    checkPhone: "/api/auth/check-phone",
    forgot: "/api/auth/forgot-password",
  },

  // OAuth session-based (Passport)
  oauth: {
    me: "/auth/me",
    google: "/auth/google",
  },

  // Onboarding endpoints
  onboarding: {
    session: "/api/onboarding/session",
    step: (key) => `/api/onboarding/steps/${key}`,
    answer: (key) => `/api/onboarding/steps/${key}/answer`,
  },

  // Nutrition endpoints
  nutrition: {
    plan: "/api/nutrition/plan",
  },

  admin: {
    users: "/api/admin/users",
    userRole: (id) => `/api/admin/users/${id}/role`,
    userPlan: (id) => `/api/admin/users/${id}/plan`,
  },
};

// Những endpoint đi “thẳng” (không ép refresh/redirect)
const PASS_THROUGH = [
  "/auth/me",
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/google",
  "/auth/google/callback",
];

const isPassThroughUrl = (u) => PASS_THROUGH.some((p) => (u || "").includes(p));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ===== Request interceptor =====
api.interceptors.request.use(
  async (config) => {
    const url = config.url || "";
    const pass = isPassThroughUrl(url);
    let token = getToken();

    if (pass) {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      else delete config.headers.Authorization;
      return config;
    }

    if (token) {
      // token đã/sắp hết hạn
      if (isTokenExpired(token) && !isRefreshing) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          isRefreshing = true;
          try {
            const response = await axios.post(
              `${BASE_URL}${endpoints.auth.refresh}`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            const { token: newAccessToken, refreshToken: newRefreshToken } =
              response.data.data;

            setTokens(newAccessToken, newRefreshToken, true);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return config;
          } catch (err) {
            processQueue(err, null);
            clearAllTokens();
            if (!window.location.pathname.startsWith("/login")) {
              window.location.replace("/login");
            }
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        } else {
          clearAllTokens();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.replace("/login");
          }
        }
      } else if (isRefreshing) {
        // chờ refresh xong
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((t) => {
            config.headers.Authorization = `Bearer ${t}`;
            return config;
          })
          .catch((err) => Promise.reject(err));
      }

      const currentToken = getToken();
      if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = originalRequest.url || "";

    // 401 từ pass-through (vd /auth/me khi chưa login) -> không redirect
    if (error?.response?.status === 401 && isPassThroughUrl(url)) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken && !url.includes(endpoints.auth.refresh)) {
        isRefreshing = true;
        try {
          const response = await axios.post(
            `${BASE_URL}${endpoints.auth.refresh}`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );
          const { token: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          setTokens(newAccessToken, newRefreshToken, true);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearAllTokens();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.replace("/login");
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        clearAllTokens();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

// ===== Convenience APIs =====
export const checkUsernameAvailability = async (username) => {
  const response = await api.get(endpoints.auth.checkUsername, { params: { username } });
  return response.data;
};

export const checkEmailAvailability = async (email) => {
  const response = await api.get(endpoints.auth.checkEmail, { params: { email } });
  return response.data;
};

export const checkPhoneAvailability = async (phone) => {
  const response = await api.get(endpoints.auth.checkPhone, { params: { phone } });
  return response.data;
};

export const patchUserRole = async (userId, role) => {
  const res = await api.patch(endpoints.admin.userRole(userId), { role });
  return res.data;
};

export const patchUserPlan = async (userId, plan) => {
  const res = await api.patch(endpoints.admin.userPlan(userId), { plan });
  return res.data;
};

// ===== Admin APIs =====
export const getAdminUsers = async ({
  limit = 50,
  offset = 0,
  search = "",
  plan,
  role,
} = {}) => {
  const params = { limit, offset };
  if (search) params.search = search;
  if (plan && plan !== "ALL") params.plan = String(plan).toUpperCase();
  if (role && role !== "ALL") params.role = String(role).toUpperCase();
  const res = await api.get(endpoints.admin.users, { params });
  return res.data;
};

export default api;

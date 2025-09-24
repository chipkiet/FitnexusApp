import axios from "axios";
import { 
  getToken, 
  getRefreshToken, 
  clearAllTokens,
  setTokens,
  isTokenExpired
 } from "./tokenManager.js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// ⚠️ Quan trọng: cần withCredentials để FE nhận cookie từ Google OAuth
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
    refresh: "/api/auth/refresh",
    checkUsername: "/api/auth/check-username",
    checkEmail: "/api/auth/check-email",
    checkPhone: "/api/auth/check-phone",
  },
};

// Những endpoint cho phép đi “thẳng” (không ép refresh/redirect)
// - /auth/me: để bắt phiên cookie từ Google sau khi popup đóng
// - /auth/login, /auth/register, /auth/refresh: bản chất đã không cần check token
const PASS_THROUGH = [
  "/auth/me",
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if(error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request: gắn token nếu có + chỉ refresh khi KHÔNG phải pass-through
api.interceptors.request.use(
  async (config) => {
    const url = config.url || "";
    const isPassThrough = PASS_THROUGH.some(p => url.includes(p));
    let token = getToken();

    // Nếu là pass-through:
    // - /auth/me: cho phép chạy không cần token để nhận cookie session (Google)
    // - login/register/refresh: luôn để nguyên
    if (isPassThrough) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // có token thì vẫn gửi
      } else {
        delete config.headers.Authorization;
      }
      return config;
    }

    // Phần dưới chỉ áp dụng cho các endpoint còn lại
    if (token) {
      // Nếu token sắp/đã hết hạn -> refresh
      if (isTokenExpired(token) && !isRefreshing) {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          isRefreshing = true;
          try {
            const response = await axios.post(
              `${BASE_URL}${endpoints.auth.refresh}`,
              { refreshToken },
              {
                headers: {"Content-Type": "application/json" },
                withCredentials: true
              }
            );

            const { token: newAccessToken , refreshToken: newRefreshToken } = response.data.data;

            setTokens(newAccessToken, newRefreshToken , true);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            processQueue(refreshError, null);
            clearAllTokens();
            // Chỉ chuyển về /login nếu không đang ở /login
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
      } else if (isRefreshing) {
        // Nếu đang refresh, hàng đợi các request để thực thi lại
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(t => {
          config.headers.Authorization = `Bearer ${t}`;
          return config;
        }).catch(err => Promise.reject(err));
      }

      // Gắn token hiện tại (sau refresh nếu có)
      const currentToken = getToken();
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    } else {
      // Không có token -> đừng gửi header Authorization rỗng
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 + retry khi cần
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = originalRequest.url || "";

    // Nếu 401 từ /auth/me -> KHÔNG redirect.
    // Trường hợp này thường xảy ra khi người dùng chưa đăng nhập (bình thường).
    if (error?.response?.status === 401 && PASS_THROUGH.some(p => url.includes(p))) {
      return Promise.reject(error);
    }

    // 401 cho các route khác -> thử refresh (nếu có) rồi retry
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken && !url.includes('/auth/refresh')) {
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${BASE_URL}${endpoints.auth.refresh}`,
            { refreshToken },
            { 
              headers: { "Content-Type": "application/json" },
              withCredentials: true 
            }
          );

          const { token: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
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
        // Không có refresh token
        clearAllTokens();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
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

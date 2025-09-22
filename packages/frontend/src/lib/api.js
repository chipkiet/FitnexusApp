import axios from "axios";
import { 
  getToken, 
  getRefreshToken, 
  clearAllTokens,
  setTokens,
  isTokenExpired
 } from "./tokenManager.js";

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
    refresh: "/api/auth/refresh",
    checkUsername: "/api/auth/check-username",
    checkEmail: "/api/auth/check-email",
    checkPhone: "/api/auth/check-phone",
  },
};


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
}

// Request: gắn token nếu có
api.interceptors.request.use(
  
  async (config) => {
    let token = getToken();
    
    //skip token logic for auth endpoints
    if (config.url?.includes('/auth/login') || 
        config.url?.includes('/auth/register') || 
        config.url?.includes('/auth/refresh')) {
      return config;
    }

    if(token) {
      // check xem token co need refresh ( 5 minutes before expiry)

      if(isTokenExpired(token) && !isRefreshing) {
        const refreshToken = getRefreshToken();

        if(refreshToken) {
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

            // update token in storage
            setTokens(newAccessToken, newRefreshToken , true);

            //update current request with new token 
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            processQueue(refreshError, null);
            clearAllTokens();
            
            // Redirect to login if not already there
            if (!window.location.pathname.startsWith("/login")) {
              window.location.replace("/login");
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          clearAllTokens();
          if(!window.location.pathname.startsWith("/login")) {
            window.location.replace("/login");
          }
        }
      } else if(isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(token => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      const currentToken = getToken();
      if(currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
    }
    return config;
},
(error) => {
  return Promise.reject(error);
}
);

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
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

          // Retry original request
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
        // No refresh token available
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

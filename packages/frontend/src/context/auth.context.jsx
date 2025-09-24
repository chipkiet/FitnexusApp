import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { endpoints } from "../lib/api.js";
import {
  setTokens,
  clearAllTokens,
  getToken,
  getRefreshToken,
  isRemembered,
  getTokenInfo,
} from "../lib/tokenManager.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const oauthLogin = async (token, userFromOAuth, remember = true) => {
  setTokens(token, null, remember);
  if (userFromOAuth) setUser(userFromOAuth);

  // gọi lại /me để confirm user (optional)
  try {
    const r = await api.get(endpoints.auth.me);
    if (r?.data?.data) setUser(r.data.data);
  } catch {}
};

  // Bootstrap session from storage or cookie session (Google OAuth)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const refreshToken = getRefreshToken();
        const remembered = isRemembered();
        console.log("Bootstrap: Token found:", !!token, "Refresh:", !!refreshToken, "Remembered:", remembered);

        // 1) Luôn thử "me" trước để nhận diện cookie session (Google OAuth)
        try {
          const r = await api.get(endpoints.auth.me);
          if (r?.data?.success && r?.data?.data) {
            setUser(r.data.data);
            console.log("Bootstrap: Authenticated via cookie session.");
            setLoading(false);
            return; // đã có user từ cookie session
          }
        } catch {
          // bỏ qua, sẽ thử theo token ở bước 2
        }

        // 2) Nếu có token (JWT) thì thử xác thực lại
        if (token) {
          console.log("Token info:", getTokenInfo());
          const r2 = await api.get(endpoints.auth.me);
          if (r2?.data?.success && r2?.data?.data) {
            setUser(r2.data.data);
            console.log("Bootstrap: Authenticated via JWT.");
          } else {
            clearAllTokens();
          }
        }
      } catch (e) {
        console.error("Bootstrap: Authentication failed:", e);
        clearAllTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.auth.register, payload);
      const { data } = response.data || {};

      if (data?.user && data?.token) {
        setUser(data.user);
        setTokens(data.token, data.refreshToken, !!payload.rememberMe);
        console.log("Register: Success, Remember me:", !!payload.rememberMe);
      }

      return response.data;
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.status === 400) {
        setError({ message: "Dữ liệu không hợp lệ" });
      } else if (err.response?.status === 422) {
        setError({ message: "Thông tin đăng ký không đúng định dạng" });
      } else {
        setError(err?.response?.data || { message: err.message });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.auth.login, payload);
      const { data } = response.data || {};

      if (data?.user && data?.token) {
        setUser(data.user);
        setTokens(data.token, data.refreshToken, !!payload.rememberMe);
        console.log("Login: Success, Remember me:", !!payload.rememberMe);
        console.log("Token expires:", getTokenInfo()?.expiresAt);
      }

      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 400) {
        setError({ message: "Dữ liệu không hợp lệ" });
      } else if (err.response?.status === 401) {
        setError({ message: "Sai tài khoản hoặc mật khẩu" });
      } else if (err.response?.status === 403) {
        setError({ message: "Tài khoản đã bị khóa" });
      } else {
        setError(err?.response?.data || { message: err.message });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      clearAllTokens();
      console.log("Logout: Success");
      // Optional: await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = () => !!user && !!getToken(); // vẫn hợp lệ với JWT
  // Lưu ý: nếu bạn muốn coi cookie-session là "đăng nhập" luôn,
  // có thể sửa thành:  return !!user;

  const getAuthStatus = () => {
    const token = getToken();
    const tokenInfo = getTokenInfo();
    return {
      isAuthenticated: isAuthenticated(),
      isRemembered: isRemembered(),
      tokenInfo,
      user,
    };
  };

const value = useMemo(() => ({
  user, loading, error,
  register, login, logout,
  oauthLogin,
  isAuthenticated, getAuthStatus,
  clearError: () => setError(null),
}), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

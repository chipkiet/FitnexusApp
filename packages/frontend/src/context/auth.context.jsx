import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { endpoints } from "../lib/api.js";
import {
  setTokens,
  clearAllTokens,
  getToken,
  isRemembered,
  getTokenInfo,
} from "../lib/tokenManager.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // OAuth (Google) – lấy user từ session cookie
  const oauthLogin = async (remember = true) => {
    try {
      const r = await api.get(endpoints.oauth.me); // /auth/me
      const u = r.data?.user || r.data?.data || null;
      if (u) {
        setUser(u);
        return true;
      }
      return false;
    } catch (e) {
      console.error("OAuth me error:", e);
      return false;
    }
  };

  // (tuỳ chọn) tiện gọi lại khi cần
  const refreshUser = async () => {
    try {
      const r = await api.get(endpoints.oauth.me);
      if (r?.data?.user) { setUser(r.data.user); return true; }
      const r2 = await api.get(endpoints.auth.me);
      if (r2?.data?.success && r2?.data?.data) { setUser(r2.data.data); return true; }
      return false;
    } catch { return false; }
  };

  // Bootstrap: ưu tiên session (Google), sau đó JWT
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        try {
          const r = await api.get(endpoints.oauth.me); // /auth/me
          if (r?.data?.user) { setUser(r.data.user); return; }
        } catch {}
        const token = getToken();
        if (token) {
          try {
            const r2 = await api.get(endpoints.auth.me); // /api/auth/me
            if (r2?.data?.success && r2?.data?.data) { setUser(r2.data.data); return; }
            else { clearAllTokens(); }
          } catch { clearAllTokens(); }
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
      }
      return response.data;
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.status === 400) setError({ message: "Dữ liệu không hợp lệ" });
      else if (err.response?.status === 422) setError({ message: "Thông tin đăng ký không đúng định dạng" });
      else setError(err?.response?.data || { message: err.message });
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
      }
      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 400) setError({ message: "Dữ liệu không hợp lệ" });
      else if (err.response?.status === 401) setError({ message: "Sai tài khoản hoặc mật khẩu" });
      else if (err.response?.status === 403) setError({ message: "Tài khoản đã bị khóa" });
      else setError(err?.response?.data || { message: err.message });
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
      // Optional: await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Đã đăng nhập khi có user (hỗ trợ cả session & JWT)
  const isAuthenticated = () => !!user;

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

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      register,
      login,
      logout,
      oauthLogin,
      refreshUser, // (tuỳ chọn) export ra nếu cần
      isAuthenticated,
      getAuthStatus,
      clearError: () => setError(null),
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

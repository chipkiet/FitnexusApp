import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { endpoints } from "../lib/api.js";
import {
  setToken as setTokenManager,
  clearToken,
  getToken as getTokenManager,
} from "../lib/tokenManager.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ chờ bootstrap
  const [error, setError] = useState(null);

  // Bootstrap session from storage (sessionStorage/localStorage) and fetch profile
  useEffect(() => {
    // Ưu tiên sessionStorage, sau đó localStorage (được đóng gói trong tokenManager)
    const saved = getTokenManager(); // sẽ chỉ lấy được token nếu remember=true
    if (!saved) {
      setLoading(false);
      return;
    }
    const isLocal = !!localStorage.getItem("token"); // để biết có phải "remember" không

    console.log("Bootstrap: Found token:", !!saved, "source:", isLocal ? "localStorage" : "sessionStorage");

    if (!saved) {
      setLoading(false);
      return;
    }

    setToken(saved);

    // Cập nhật vào RAM mà KHÔNG đổi nơi lưu (remember = isLocal)
    setTokenManager(saved, isLocal);

    // Fetch current user
    api
      .get(endpoints.auth.me)
      .then((res) => {
        console.log("Bootstrap: API response:", res?.data);
        if (res?.data?.data) setUser(res.data.data);
      })
      .catch((err) => {
        console.log("Bootstrap: API error:", err);
        // token invalid → cleanup
        clearToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(endpoints.auth.register, payload);
      const { data } = res.data || {};
      if (data?.user) setUser(data.user);
      if (data?.token) {
        setToken(data.token);
        // Đăng ký mặc định KHÔNG remember
        setTokenManager(data.token, false);
      }
      return res.data;
    } catch (err) {
      setError(err?.response?.data || { message: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(endpoints.auth.login, payload);
      const { data } = res.data || {};
      if (data?.user) setUser(data.user);
      if (data?.token) {
        setToken(data.token);
        setTokenManager(data.token, !!payload.rememberMe);

        if (payload.rememberMe) {
          console.log("Login: token persisted in localStorage");
        } else {
          console.log("Login: token only in memory (lost on reload)");
        }
      }
      return res.data;
    } catch (err) {
      if (err.response?.status === 400) {
        setError({ message: "Dữ liệu không hợp lệ" });
      } else if (err.response?.status === 401) {
        setError({ message: "Sai tài khoản hoặc mật khẩu" });
      } else {
        setError(err?.response?.data || { message: err.message });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, error, register, login, logout }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

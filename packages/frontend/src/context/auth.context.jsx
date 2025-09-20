import React, { createContext, useContext, useMemo, useState } from "react";
import api, { endpoints } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(endpoints.auth.register, payload);
      const data = res.data;

      if (data?.user) setUser(data.user);
      if (data?.token) setToken(data.token);

      return data;
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
      const data = res.data;

      if (data?.user) setUser(data.user);
      if (data?.token) {
        setToken(data.token);
        if (payload.rememberMe) {
          localStorage.setItem("token", data.token);
        }
      }

      return data;
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

  const value = useMemo(
    () => ({ user, token, loading, error, register, login }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

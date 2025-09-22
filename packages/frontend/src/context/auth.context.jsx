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

  // Bootstrap session from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const refreshToken = getRefreshToken();
        const remembered = isRemembered();
        
        console.log('Bootstrap: Token found:', !!token, 'Refresh:', !!refreshToken, 'Remembered:', remembered);

        if (!token) {
          setLoading(false);
          return;
        }

        // Check token info
        const tokenInfo = getTokenInfo();
        console.log('Token info:', tokenInfo);

        // Try to fetch current user
        const response = await api.get(endpoints.auth.me);
        
        if (response?.data?.success && response?.data?.data) {
          setUser(response.data.data);
          console.log('Bootstrap: User authenticated successfully');
        }
      } catch (error) {
        console.error('Bootstrap: Authentication failed:', error);
        // Token is invalid, clear everything
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
        
        console.log('Register: Success, Remember me:', !!payload.rememberMe);
      }
      
      return response.data;
    } catch (err) {
      console.error('Register error:', err);
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
        
        console.log('Login: Success, Remember me:', !!payload.rememberMe);
        console.log('Token expires:', getTokenInfo()?.expiresAt);
      }
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
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
      // Clear client-side state
      setUser(null);
      clearAllTokens();
      
      console.log('Logout: Success');
      
      // Optional: Call logout endpoint to invalidate server-side session
      // await api.post(endpoints.auth.logout);
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

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
      isAuthenticated,
      getAuthStatus,
      // Utility functions
      clearError: () => setError(null),
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
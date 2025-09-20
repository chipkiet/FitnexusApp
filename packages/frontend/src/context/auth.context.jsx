import React, { createContext, useContext, useMemo, useState } from 'react';
import { api, endpoints } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (payload) => { // payload chính là form object từ Register.jsx
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(endpoints.auth.register, payload);
      // HTTP request ->  api.post(url, data);
      // POST http://localhost:3001/api/auth/register
      // Content-Type: application/json
      // Body: {"username":"john123","email":"john@email.com",...}

      const { data } = res.data || {};
      if (data?.user) setUser(data.user);
      if (data?.token) setToken(data.token);
      return res.data;
    } catch (err) {
      setError(err?.response?.data || { message: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({ user, token, loading, error, register }), [user, token, loading, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

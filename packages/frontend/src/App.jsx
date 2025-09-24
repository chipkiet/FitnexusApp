import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context.jsx";
import HealthStatus from "./components/HealthStatus.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardPreview from "./pages/DashboardPreview.jsx";

function PrivateRoute({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return user || token ? children : <Navigate to="/login" replace />;
}

function App() {
  useEffect(() => {
    // Debug listener để xem FE có nhận được message từ popup Google không
    window.addEventListener("message", (e) => {
      console.log("oauth msg:", e.origin, e.data);
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/health" element={<HealthStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<DashboardPreview />} />
          <Route path="*" element={<DashboardPreview />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

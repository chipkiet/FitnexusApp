import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context.jsx";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Onboarding from "./pages/Onboarding.jsx";

// Admin layout & pages
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminOverview from "./pages/admin/Overview.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";
import AdminContentManage from "./pages/admin/ContentManage.jsx";
import AdminFinancialManage from "./pages/admin/FinancialManage.jsx";
import Role from "./pages/admin/Role.jsx";
import Plan from "./pages/admin/Plan.jsx";
import AdminLockUnlock from "./pages/admin/LockUnlock.jsx";
import AdminResetPassword from "./pages/admin/ResetPassword.jsx";

// (Optional) trang quản lý users nếu bạn có file này
import AdminUsers from "./pages/AdminUsers.jsx";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "ADMIN" ? children : <Navigate to="/" replace />;
}

function App() {
  useEffect(() => {
    // Debug listener để xem FE có nhận message từ popup OAuth hay không
    const handler = (e) => {
      console.log("oauth msg:", e.origin, e.data);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main app routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Admin pages */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="user-detail" element={<AdminUserDetail />} />
            <Route path="role" element={<Role />} />
            <Route path="plan" element={<Plan />} />
            <Route path="lock-unlock" element={<AdminLockUnlock />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
            <Route path="content" element={<AdminContentManage />} />
            <Route path="finance" element={<AdminFinancialManage />} />
            {/* Thêm route này nếu bạn dùng trang AdminUsers */}
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

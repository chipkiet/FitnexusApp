import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context.jsx";

import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardPreview from "./pages/DashboardPreview.jsx";
import Onboarding from "./pages/Onboarding.jsx";

// Admin layout & pages
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminOverview from "./pages/admin/Overview.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";
// ⛔ ĐÃ TÁCH: bỏ AdminRolePlan
import AdminLockUnlock from "./pages/admin/LockUnlock.jsx";
import AdminResetPassword from "./pages/admin/ResetPassword.jsx";
import AdminContentManage from "./pages/admin/ContentManage.jsx";
import AdminTrainerManage from "./pages/admin/TrainerManage.jsx";
import AdminFinancialManage from "./pages/admin/FinancialManage.jsx";
import AdminSocial from "./pages/admin/Social.jsx";

// ✅ Trang mới đã tách riêng
import Role from "./pages/admin/Role.jsx";
import Plan from "./pages/admin/Plan.jsx";

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
    // Debug listener để xem FE có nhận được message từ popup Google không
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

          {/* Dashboard (user) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin pages (role-protected, nested) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="user-detail" element={<AdminUserDetail />} />
            {/* ⛔ BỎ: <Route path="role-plan" element={<AdminRolePlan />} /> */}
            <Route path="role" element={<Role />} />
            <Route path="plan" element={<Plan />} />
            <Route path="lock-unlock" element={<AdminLockUnlock />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
            <Route path="content" element={<AdminContentManage />} />
            <Route path="trainers" element={<AdminTrainerManage />} />
            <Route path="finance" element={<AdminFinancialManage />} />
            <Route path="social" element={<AdminSocial />} />
          </Route>

          {/* Public landing / fallback */}
          <Route path="/" element={<DashboardPreview />} />
          <Route path="*" element={<DashboardPreview />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

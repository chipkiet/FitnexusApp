import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth.context.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyCode from "./pages/VerifyCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardPreview from "./pages/DashboardPreview.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminOverview from "./pages/admin/Overview.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";
import AdminRolePlan from "./pages/admin/RolePlan.jsx";
import AdminLockUnlock from "./pages/admin/LockUnlock.jsx";
import AdminResetPassword from "./pages/admin/ResetPassword.jsx";
import AdminContentManage from "./pages/admin/ContentManage.jsx";
import AdminTrainerManage from "./pages/admin/TrainerManage.jsx";
import AdminFinancialManage from "./pages/admin/FinancialManage.jsx";
import AdminSocial from "./pages/admin/Social.jsx";


function PrivateRoute({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return user || token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
            <Route path="role-plan" element={<AdminRolePlan />} />
            <Route path="lock-unlock" element={<AdminLockUnlock />} />
            <Route path="reset-password" element={<AdminResetPassword />} />
            <Route path="content" element={<AdminContentManage />} />
            <Route path="trainers" element={<AdminTrainerManage />} />
            <Route path="finance" element={<AdminFinancialManage />} />
            <Route path="social" element={<AdminSocial />} />
          </Route>

         
          <Route path="/" element={<DashboardPreview />} />
          <Route path="*" element={<DashboardPreview />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'ADMIN' ? children : <Navigate to="/" replace />;
}

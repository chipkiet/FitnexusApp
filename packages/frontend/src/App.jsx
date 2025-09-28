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
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminOverview from "./pages/admin/Overview.jsx";
import AdminUserDetail from "./pages/admin/UserDetail.jsx";
import AdminRolePlan from "./pages/admin/RolePlan.jsx";
import AdminContentManage from "./pages/admin/ContentManage.jsx";
import AdminFinancialManage from "./pages/admin/FinancialManage.jsx";


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
            <Route path="role-plan" element={<AdminRolePlan />} />
            <Route path="content" element={<AdminContentManage />} />
            <Route path="finance" element={<AdminFinancialManage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
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

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth.context.jsx";
import loginImg from "../../assets/login.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Alert from "../../components/common/Alert.jsx";
import api, { endpoints } from "../../lib/api.js";
import { setTokens } from "../../lib/tokenManager.js"; // ✅ thêm

function OAuthNotFoundModal({ email, onClose, onSignup }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[420px] text-center">
        <h2 className="mb-2 text-lg font-semibold">Không tìm thấy tài khoản</h2>
        <p className="mb-4 text-sm text-gray-600">
          Tài khoản Google {email ? <b>{email}</b> : "vừa dùng"} chưa liên kết với FITNEXUS.
        </p>
        <div className="flex gap-3">
          <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>
            Đăng nhập bằng cách khác
          </button>
          <button
            className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={onSignup}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });
  const [oauthLoading, setOauthLoading] = useState(false);

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [showNotFound, setShowNotFound] = useState(false);
  const [nfEmail, setNfEmail] = useState("");

  const location = useLocation();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("oauth") === "not_found") {
      setShowNotFound(true);
      setNfEmail(q.get("email") || "");
      const url = new URL(window.location.href);
      url.searchParams.delete("oauth");
      url.searchParams.delete("email");
      window.history.replaceState({}, "", url.toString());
    }
  }, [location.search]);

  const closeNotFound = () => setShowNotFound(false);
  const goSignup = () => {
    setShowNotFound(false);
    navigate(`/register${nfEmail ? `?email=${encodeURIComponent(nfEmail)}` : ""}`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ====== Submit bằng email/username + password ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        identifier: form.identifier,
        password: form.password,
        rememberMe: form.remember,
      });

      // Lưu token vào tokenManager
      const accessToken =
        result?.data?.accessToken ||
        result?.data?.token ||
        result?.accessToken ||
        result?.token;
      const refreshToken =
        result?.data?.refreshToken || result?.refreshToken || null;

      if (accessToken) {
        setTokens(accessToken, refreshToken, !!form.remember);
      }

      const role = result?.data?.user?.role;
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (_) {
      // error đã được context xử lý
    }
  };

  // ====== Đăng nhập bằng Google ======
  const handleGoogleLogin = () => {
    setOauthLoading(true);
    const be = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    window.location.href = `${be}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        {/* Left */}
        <div className="w-1/2 pr-8">
          <h1 className="mb-6 text-xl font-semibold text-center text-gray-800">
            Your Logo
          </h1>
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

          {error && (
            <div className="mt-4">
              <Alert type="error">{error.message || "Login failed"}</Alert>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember me
              </label>
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={oauthLoading}
              className="flex items-center justify-center flex-1 gap-2 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              <FcGoogle size={20} />
              {oauthLoading ? "Đang chuyển hướng…" : "Google"}
            </button>

            <button className="flex items-center justify-center flex-1 gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FaApple size={20} /> Apple
            </button>
          </div>

          <p className="mt-4 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center w-1/2">
          <img src={loginImg} alt="Login Illustration" className="w-3/4" />
        </div>
      </div>

      {showNotFound && (
        <OAuthNotFoundModal
          email={nfEmail}
          onClose={closeNotFound}
          onSignup={goSignup}
        />
      )}
    </div>
  );
}

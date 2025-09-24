import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import loginImg from "../assets/login.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import Alert from "../components/common/Alert.jsx";
import { openOAuthPopup } from "../lib/openOAuthPopup.js";
import api, { endpoints } from "../lib/api.js";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });
  const [oauthLoading, setOauthLoading] = useState(false);

  const { login, loading, error, oauthLogin } = useAuth();
  const navigate = useNavigate();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ====== Submit bằng email/username + password ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        identifier: form.identifier,
        password: form.password,
        rememberMe: form.remember,
      });
      navigate("/dashboard", { replace: true });
    } catch (_) {
      // error đã được context xử lý
    }
  };

// ====== Đăng nhập bằng Google (popup, không reload) ======
// Poll session cho tới khi /api/auth/me trả 200
async function waitForSession(maxMs = 10000, intervalMs = 400) {
  const deadline = Date.now() + maxMs;

  while (Date.now() < deadline) {
    try {
      // dùng axios instance => withCredentials đã bật sẵn
      const { data } = await api.get(endpoints.auth.me, {
        params: { t: Date.now() }, // bust cache
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      if (data?.success) return data; // đã có session
    } catch (err) {
      // 401 thì tiếp tục poll, lỗi khác thì throw để biết mà xử lý
      if (err?.response?.status !== 401) throw err;
    }
    await sleep(intervalMs);
  }
  throw new Error("Timeout waiting for session");
}

// ====== Đăng nhập bằng Google (popup + poll, KHÔNG dùng fetch tay) ======
async function handleGoogleLogin() {
  try {
    const payload = await openOAuthPopup("http://localhost:3001/api/auth/google");
    if (!payload?.token) throw new Error("No token from OAuth");

    // Lưu token và user vào context
    await oauthLogin(payload.token, payload.user, true);

    navigate("/"); // hoặc "/home"
  } catch (err) {
    console.error("Google login error:", err);
  }
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        {/* Left */}
        <div className="w-1/2 pr-8">
          <h1 className="mb-6 text-xl font-semibold text-center text-gray-800">Your Logo</h1>
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
              <FcGoogle size={20} /> {oauthLoading ? "Connecting..." : "Google"}
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
    </div>
  );
}

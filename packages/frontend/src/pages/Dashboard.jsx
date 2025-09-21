import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
      <h1 className="text-3xl text-green-600 mb-6">Chào mừng đến Dashboard 🚀</h1>

      {user && (
        <p className="mb-4 text-lg text-gray-700">
          Xin chào, <span className="font-semibold">{user.username}</span>
        </p>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 text-white rounded-lg bg-sky-500 hover:bg-sky-600 transition"
        >
          Register
        </button>

        <button
          onClick={handleLogout}
          className="px-6 py-3 text-white rounded-lg bg-red-500 hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

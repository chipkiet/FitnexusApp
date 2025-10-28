import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context.jsx";
import logo from "../../assets/logo.png";
import HeaderLogin from "../../components/header/HeaderLogin.jsx";
import LeaderboardCard from "../../components/leaderboard/LeaderboardCard.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  const displayName = (user?.username || "").replaceAll("_", " ");

  return (
    <div className="flex flex-col min-h-screen text-black bg-white">
      <HeaderLogin/>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LeaderboardCard />
          {/* TODO: add more dashboard widgets here */}
        </div>
      </main>
    </div>
  );
}

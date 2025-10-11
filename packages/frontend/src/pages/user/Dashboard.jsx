import React from "react";
import { useAuth } from "../../context/auth.context.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          {user ? (
            <>
              Welcome back{user.fullName ? `, ${user.fullName}` : ""}!<br />
              Role: <b>{user.role}</b> · Plan: <b>{user.plan || "FREE"}</b>
            </>
          ) : (
            "Loading profile..."
          )}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">Your program overview</div>
          <div className="p-4 bg-white rounded-xl shadow">Today’s workout</div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotImg from "../assets/forgot.png";

export default function ResetPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("New password:", form.password);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        
      
        <div className="w-1/2 pr-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Your Logo</h1>
          <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter and confirm your new password to continue.
          </p>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Password
            </button>
          </form>
        </div>

        
        <div className="w-1/2 flex items-center justify-center">
          <img src={forgotImg} alt="Reset Password Illustration" className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

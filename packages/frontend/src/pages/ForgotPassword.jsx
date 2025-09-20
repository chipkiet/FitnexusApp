import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotImg from "../assets/forgot.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password email:", email);
    navigate("/verify-code");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        
        {/* Form bên trái */}
        <div className="w-1/2 pr-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Your Logo</h1>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Forgot your password?</h2>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Send code
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social login buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 text-blue-600">
              <FaFacebook size={20} /> Facebook
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FaApple size={20} /> Apple
            </button>
          </div>
        </div>

        {/* Ảnh minh họa */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={forgotImg} alt="Forgot Password Illustration" className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

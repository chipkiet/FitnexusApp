import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpImg from "../assets/image 2.png"; 
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!form.agree) {
      alert("You must agree to the Terms and Privacy Policies!");
      return;
    }
    console.log("Register data:", form);
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex w-full max-w-5xl p-8 bg-white shadow-xl rounded-xl">
        
       
        <div className="w-1/2 flex flex-col items-center justify-center -mt-6">
          <img
            src={SignUpImg}
            alt="Register Illustration"
            className="w-3/4"
          />
          <h1 className="mt-2 text-2xl font-bold text-blue-500 tracking-wider">
            FITNEXUS
          </h1>
        </div>

   
        <div className="w-1/2 pl-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign up</h2>
          <p className="text-gray-500 mb-6">
            Let’s get you all set up so you can access your personal account.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            
            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <label>
                I agree to all the{" "}
                <span className="text-blue-600 cursor-pointer">Terms</span> and{" "}
                <span className="text-pink-500 cursor-pointer">
                  Privacy Policies
                </span>
              </label>
            </div>

            {/* Nút tạo tài khoản */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create account
            </button>
          </form>

          {/* Login link */}
          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              className="text-red-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">Or Sign up with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social login */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FaFacebook size={20} className="text-blue-600" />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FcGoogle size={20} />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
              <FaApple size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

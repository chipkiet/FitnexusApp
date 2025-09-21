import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPreview() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Fitnexus – Dashboard Preview</h1>
          <p className="mt-2 text-gray-600">Khám phá tổng quan. Đăng nhập để vào dashboard chính.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full px-6 py-3 text-blue-700 transition-colors bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          >
            Đăng ký
          </button>
        </div>

        <div className="mt-8 p-4 border rounded-lg bg-slate-50 text-slate-700">
          <p>Trang này là bản xem trước công khai (dashboard 1). Sau khi đăng nhập, bạn sẽ được chuyển vào dashboard chính với nhiều tính năng hơn.</p>
        </div>
      </div>
    </div>
  );
}


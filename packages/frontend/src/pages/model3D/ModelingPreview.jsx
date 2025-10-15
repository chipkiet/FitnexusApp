import React from "react";
import { useNavigate } from "react-router-dom";
import ModelViewer from "../../components/ModelViewer.jsx";
import logo from "../../assets/logo.png";

function ModelingPreview() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen text-black from-gray-200 to-gray-400">
      {/* Top bar */}
      <header className="flex items-center justify-between w-full px-6 py-4 border-b from-gray200 to-gray-400">
        <div className="text-base/6 text-zinc-950 dark:text-white hover:underline -m-1.5 p-1.5 shrink-0">
          <img src={logo} alt="Fitnexus logo" className="h-48" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-700 rounded-full hover:bg-gray-800"
          >
            Trang chủ
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 font-semibold text-black bg-white rounded-full hover:bg-gray-200"
          >
            Đăng nhập để trải nghiệm đầy đủ
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container flex-1 p-6 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Xem thử mô hình 3D</h1>
          <p className="mt-2 text-gray-400">
            Khám phá mô hình 3D tương tác. Đăng nhập để xem bài tập theo từng
            nhóm cơ và lưu tiến độ.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl">
          {/* Model preview */}
          <ModelViewer
            onSelectMuscleGroup={() => {
              /* preview mode: no-op */
            }}
          />
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-gray-400 to-gray-600 hover:opacity-90"
          >
            Đăng nhập để tiếp tục
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-gray-700 rounded-full hover:bg-gray-800"
          >
            Quay lại
          </button>
        </div>
      </main>
    </div>
  );
}

export default ModelingPreview;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModelViewer from '../../components/ModelViewer.jsx';

function ModelingPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-black/80">
        <div className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
          Fitnexus — Mô hình 3D (Preview)
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-800"
          >
            Trang chủ
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200"
          >
            Đăng nhập để trải nghiệm đầy đủ
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Xem thử mô hình 3D</h1>
          <p className="text-gray-400 mt-2">
            Khám phá mô hình 3D tương tác. Đăng nhập để xem bài tập theo từng nhóm cơ và lưu tiến độ.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4">
          {/* Model preview */}
          <ModelViewer onSelectMuscleGroup={() => { /* preview mode: no-op */ }} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:opacity-90"
          >
            Đăng nhập để tiếp tục
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full border border-gray-700 hover:bg-gray-800"
          >
            Quay lại
          </button>
        </div>
      </main>
    </div>
  );
}

export default ModelingPreview;


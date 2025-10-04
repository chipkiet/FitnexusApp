import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, Target, Star, ChevronRight, Menu, User } from 'lucide-react';

const Fitnexus3DLanding = () => {
  const navigate = useNavigate();
  const [hoveredPart, setHoveredPart] = useState(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const bodyParts = [
    { id: 'chest', name: 'Ngực (Chest)', color: '#ef4444', exercises: 3, y: 180, x: 200 },
    { id: 'shoulders', name: 'Vai (Shoulders)', color: '#f59e0b', exercises: 5, y: 160, x: 200 },
    { id: 'arms', name: 'Tay (Arms)', color: '#10b981', exercises: 4, y: 200, x: 150 },
    { id: 'core', name: 'Core', color: '#3b82f6', exercises: 6, y: 240, x: 200 },
    { id: 'legs', name: 'Chân (Legs)', color: '#8b5cf6', exercises: 5, y: 320, x: 200 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Head
    ctx.fillStyle = hoveredPart === 'shoulders' ? '#f59e0b' : '#374151';
    ctx.beginPath();
    ctx.arc(centerX, 140, 30, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.fillStyle = hoveredPart === 'shoulders' ? '#f59e0b' : '#4b5563';
    ctx.fillRect(centerX - 60, 155, 120, 20);

    // Chest
    ctx.fillStyle = hoveredPart === 'chest' ? '#ef4444' : '#6b7280';
    ctx.beginPath();
    ctx.moveTo(centerX - 50, 175);
    ctx.lineTo(centerX + 50, 175);
    ctx.lineTo(centerX + 40, 230);
    ctx.lineTo(centerX - 40, 230);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.fillStyle = hoveredPart === 'arms' ? '#10b981' : '#6b7280';
    ctx.fillRect(centerX - 80, 175, 20, 80); // Left arm
    ctx.fillRect(centerX + 60, 175, 20, 80); // Right arm

    // Core
    ctx.fillStyle = hoveredPart === 'core' ? '#3b82f6' : '#6b7280';
    ctx.fillRect(centerX - 40, 230, 80, 60);

    // Legs
    ctx.fillStyle = hoveredPart === 'legs' ? '#8b5cf6' : '#6b7280';
    ctx.fillRect(centerX - 35, 290, 30, 100); // Left leg
    ctx.fillRect(centerX + 5, 290, 30, 100); // Right leg

    ctx.restore();
  }, [rotation, hoveredPart]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastX.current;
      setRotation((prev) => prev + deltaX * 0.5);
      lastX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple hit detection
    if (y > 155 && y < 175) setHoveredPart('shoulders');
    else if (y > 175 && y < 230) setHoveredPart('chest');
    else if ((x < 150 || x > 250) && y > 175 && y < 255) setHoveredPart('arms');
    else if (y > 230 && y < 290) setHoveredPart('core');
    else if (y > 290) setHoveredPart('legs');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Fitnexus
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="hover:text-blue-400 transition">Tính năng</a>
            <a href="#" className="hover:text-blue-400 transition">Thư viện</a>
            <a href="#" className="hover:text-blue-400 transition">Về chúng tôi</a>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="hover:text-blue-400 transition" onClick={() => navigate('/login')}>Đăng nhập</button>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-semibold hover:scale-105 transition">
              Bắt đầu
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Model */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-semibold">
                🚀 Công nghệ 3D Interactive
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Luyện thông minh hơn.
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Tiến bộ nhanh hơn.
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                AI cá nhân hóa lộ trình luyện tập của bạn. Mục tiêu và nhu cầu của cơ thể ban.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full font-semibold hover:scale-105 transition flex items-center gap-2">
                  Khám phá ngay
                  <ChevronRight size={20} />
                </button>
                <button className="border border-gray-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition">
                  Xem demo
                </button>
              </div>
              <div className="flex gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold text-blue-400">200+</div>
                  <div className="text-gray-400">Bài tập</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">12K+</div>
                  <div className="text-gray-400">Người dùng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">15+</div>
                  <div className="text-gray-400">Nhóm cơ</div>
                </div>
              </div>
            </div>

            {/* Right: Interactive 3D Model */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 backdrop-blur-sm border border-gray-700">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">Khám phá cơ thể của bạn</h3>
                  <p className="text-gray-400 text-sm">Click vào từng bộ phận để xem bài tập</p>
                </div>
                
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={500}
                  className="w-full cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                  onMouseEnter={() => setHoveredPart(null)}
                />

                {/* Tooltip */}
                {hoveredPart && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {bodyParts.find(p => p.id === hoveredPart)?.name}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {bodyParts.find(p => p.id === hoveredPart)?.exercises} bài tập
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Push-ups</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Dumbbell</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Bench</span>
                    </div>
                    <button className="w-full mt-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition">
                      Xem tất cả bài tập
                    </button>
                  </div>
                )}

                <div className="text-center mt-4 text-sm text-gray-500">
                  ↔️ Kéo để xoay mô hình
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cách hoạt động</h2>
            <p className="text-gray-400 text-lg">Chỉ 3 bước đơn giản để bắt đầu</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Chọn nhóm cơ', desc: 'Click vào bộ phận cơ thể bạn muốn tập' },
              { icon: Zap, title: 'Nhận gợi ý AI', desc: 'Thuật toán đề xuất bài tập phù hợp nhất' },
              { icon: Activity, title: 'Bắt đầu luyện tập', desc: 'Theo dõi tiến độ và đạt mục tiêu' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muscle Groups Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Thư viện bài tập</h2>
            <p className="text-gray-400 text-lg">Khám phá 200+ bài tập theo nhóm cơ, mục đích, cấp độ</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bodyParts.map((part) => (
              <div key={part.id} className="group cursor-pointer">
                <div className="aspect-square bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition"
                       style={{ background: `linear-gradient(135deg, ${part.color}, transparent)` }}>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold mb-1">{part.name}</h3>
                    <p className="text-sm text-gray-400">{part.exercises} bài tập</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Hơn 12,000 người đang luyện tập mỗi tuần</h2>
          <p className="text-gray-400 mb-12">Kết quả thực sự từ cộng đồng Fitnexus</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                <div className="flex gap-1 mb-3 justify-center">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 mb-4">"App giúp mình theo dõi tiến độ, đề ra kế hoạch chi tiết, đạt mục tiêu tốt."</p>
                <div className="font-semibold">Người dùng {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Sẵn sàng khám phá cơ thể bạn từ bên trong?</h2>
          <p className="text-xl text-gray-400 mb-8">Bắt đầu hành trình fitness với công nghệ 3D interactive</p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-5 rounded-full text-xl font-semibold hover:scale-105 transition">
            Mở mô hình 3D →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Fitnexus
          </div>
          <p>© 2025 Fitnexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Fitnexus3DLanding;

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Zap,
  Target,
  Star,
  ChevronRight,
  Menu,
  User,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { HumanModel } from "../../components/3d/HumanModel";
import { Bounds, OrbitControls } from "@react-three/drei";

const Fitnexus3DLanding = () => {
  const navigate = useNavigate();
  const [hoveredPart, setHoveredPart] = useState(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const bodyParts = [
    {
      id: "chest",
      name: "Ngực (Chest)",
      color: "#ef4444",
      exercises: 3,
      y: 180,
      x: 200,
    },
    {
      id: "shoulders",
      name: "Vai (Shoulders)",
      color: "#f59e0b",
      exercises: 5,
      y: 160,
      x: 200,
    },
    {
      id: "arms",
      name: "Tay (Arms)",
      color: "#10b981",
      exercises: 4,
      y: 200,
      x: 150,
    },
    {
      id: "core",
      name: "Core",
      color: "#3b82f6",
      exercises: 6,
      y: 240,
      x: 200,
    },
    {
      id: "legs",
      name: "Chân (Legs)",
      color: "#8b5cf6",
      exercises: 5,
      y: 320,
      x: 200,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Head
    ctx.fillStyle = hoveredPart === "shoulders" ? "#f59e0b" : "#374151";
    ctx.beginPath();
    ctx.arc(centerX, 140, 30, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.fillStyle = hoveredPart === "shoulders" ? "#f59e0b" : "#4b5563";
    ctx.fillRect(centerX - 60, 155, 120, 20);

    // Chest
    ctx.fillStyle = hoveredPart === "chest" ? "#ef4444" : "#6b7280";
    ctx.beginPath();
    ctx.moveTo(centerX - 50, 175);
    ctx.lineTo(centerX + 50, 175);
    ctx.lineTo(centerX + 40, 230);
    ctx.lineTo(centerX - 40, 230);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.fillStyle = hoveredPart === "arms" ? "#10b981" : "#6b7280";
    ctx.fillRect(centerX - 80, 175, 20, 80); // Left arm
    ctx.fillRect(centerX + 60, 175, 20, 80); // Right arm

    // Core
    ctx.fillStyle = hoveredPart === "core" ? "#3b82f6" : "#6b7280";
    ctx.fillRect(centerX - 40, 230, 80, 60);

    // Legs
    ctx.fillStyle = hoveredPart === "legs" ? "#8b5cf6" : "#6b7280";
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
    if (y > 155 && y < 175) setHoveredPart("shoulders");
    else if (y > 175 && y < 230) setHoveredPart("chest");
    else if ((x < 150 || x > 250) && y > 175 && y < 255) setHoveredPart("arms");
    else if (y > 230 && y < 290) setHoveredPart("core");
    else if (y > 290) setHoveredPart("legs");
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Fitnexus
          </div>
          <nav className="hidden gap-8 md:flex">
            <a href="#" className="transition hover:text-blue-400">
              Tính năng
            </a>
            <a href="#" className="transition hover:text-blue-400">
              Thư viện
            </a>
            <a href="#" className="transition hover:text-blue-400">
              Về chúng tôi
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              className="transition hover:text-blue-400"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
            <button className="px-6 py-2 font-semibold transition rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">
              Bắt đầu
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Model */}
      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 text-sm font-semibold text-blue-400 rounded-full bg-blue-500/20">
                Công nghệ 3D Interactive
              </div>
              <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
                Luyện tập thông minh 
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                  Tiến bộ nhanh hơn.
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                AI cá nhân hóa lộ trình luyện tập của bạn. Mục tiêu và nhu cầu
                của cơ thể ban.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="flex items-center gap-2 px-8 py-4 font-semibold transition rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">
                  Khám phá ngay
                  <ChevronRight size={20} />
                </button>
                <button className="px-8 py-4 font-semibold transition border border-gray-600 rounded-full hover:bg-gray-800">
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
              <div className="p-8 border border-gray-700 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm">
                <div className="mb-4 text-center">
                  <h3 className="mb-2 text-xl font-semibold">
                    Khám phá cơ thể của bạn
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click vào từng bộ phận để xem bài tập
                  </p>
                </div>
                <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-gray-900/3">
                  <Canvas
                    camera={{
                      position: [0, 1.6, 5],
                      fov: 50,
                      near: 0.01,
                      far: 10000,
                    }}
                  >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[10, 12, 8]} intensity={1} />
                    <directionalLight
                      position={[-10, -5, -5]}
                      intensity={0.3}
                    />
                    <Suspense fallback={null}>
                      <Bounds fit observe margin={1.0}>
                        <HumanModel />
                      </Bounds>
                    </Suspense>
                    <OrbitControls
                      makeDefault
                      target={[0, 1, 0]}
                      enablePan={false}
                      minDistance={1}
                      maxDistance={10}
                      zoomSpeed={0.9}
                    />
                  </Canvas>
                </div>

                {/* Tooltip */}
                {hoveredPart && (
                  <div className="p-5 mt-6 bg-gray-800 border border-gray-700 rounded-xl animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-semibold capitalize">
                        {hoveredPart}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {bodyParts.find((p) => p.id === hoveredPart)
                          ?.exercises || 5}{" "}
                        bài tập
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 text-sm">
                      <span className="px-3 py-1 text-blue-400 rounded-full bg-blue-500/20">
                        Push-ups
                      </span>
                      <span className="px-3 py-1 text-blue-400 rounded-full bg-blue-500/20">
                        Dumbbell
                      </span>
                      <span className="px-3 py-1 text-blue-400 rounded-full bg-blue-500/20">
                        Bench Press
                      </span>
                    </div>
                    <button className="w-full py-3 text-base font-semibold transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">
                      Xem tất cả bài tập →
                    </button>
                  </div>
                )}

                <div className="mt-4 text-sm text-center text-gray-500">
                  ↔️ Kéo để xoay mô hình
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Cách hoạt động</h2>
            <p className="text-lg text-gray-400">
              Chỉ 3 bước đơn giản để bắt đầu
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Chọn nhóm cơ",
                desc: "Click vào bộ phận cơ thể bạn muốn tập",
              },
              {
                icon: Zap,
                title: "Nhận gợi ý AI",
                desc: "Thuật toán đề xuất bài tập phù hợp nhất",
              },
              {
                icon: Activity,
                title: "Bắt đầu luyện tập",
                desc: "Theo dõi tiến độ và đạt mục tiêu",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 transition border border-gray-700 bg-gray-800/50 rounded-2xl hover:border-blue-500"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <item.icon size={24} />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muscle Groups Preview */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Thư viện bài tập</h2>
            <p className="text-lg text-gray-400">
              Khám phá 200+ bài tập theo nhóm cơ, mục đích, cấp độ
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {bodyParts.map((part) => (
              <div key={part.id} className="cursor-pointer group">
                <div className="relative overflow-hidden transition bg-gray-800 border border-gray-700 aspect-square rounded-2xl hover:border-blue-500">
                  <div
                    className="absolute inset-0 transition bg-gradient-to-br opacity-20 group-hover:opacity-40"
                    style={{
                      background: `linear-gradient(135deg, ${part.color}, transparent)`,
                    }}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="mb-1 font-semibold">{part.name}</h3>
                    <p className="text-sm text-gray-400">
                      {part.exercises} bài tập
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="mb-4 text-4xl font-bold">
            Hơn 12,000 người đang luyện tập mỗi tuần
          </h2>
          <p className="mb-12 text-gray-400">
            Kết quả thực sự từ cộng đồng Fitnexus
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 border border-gray-700 bg-gray-800/50 rounded-2xl"
              >
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-4 text-gray-300">
                  "App giúp mình theo dõi tiến độ, đề ra kế hoạch chi tiết, đạt
                  mục tiêu tốt."
                </p>
                <div className="font-semibold">Người dùng {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-5xl font-bold">
            Sẵn sàng khám phá cơ thể bạn từ bên trong?
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Bắt đầu hành trình fitness với công nghệ 3D interactive
          </p>
          <button className="px-12 py-5 text-xl font-semibold transition rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">
            Mở mô hình 3D →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="mx-auto text-center text-gray-400 max-w-7xl">
          <div className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Fitnexus
          </div>
          <p>© 2025 Fitnexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Fitnexus3DLanding;

import React, { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { api } from "../../lib/api";
import {
  Activity,
  Zap,
  Target,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { HumanModel } from "../../components/3d/HumanModel";
import { Bounds, OrbitControls } from "@react-three/drei";

const Fitnexus3DLanding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hoveredPart, setHoveredPart] = useState(null);

  const handleStartOnboarding = async () => {
    // Require authentication for onboarding. If not authenticated, redirect to login
    if (!isAuthenticated()) {
      // pass the original destination so Login can redirect back after success
      navigate("/login", { state: { from: "/onboarding/age" } });
      return;
    }

    try {
      // Check current onboarding session and navigate accordingly
      const response = await api.get("/api/onboarding/session", {
        params: { t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        withCredentials: true,
      });

      const data = response?.data?.data || {};
      if (data.required && !data.completed) {
        const nextStep = String(data.nextStepKey || data.currentStepKey || "age").toLowerCase();
        navigate(`/onboarding/${nextStep}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error starting onboarding:", error);
      navigate("/onboarding/age");
    }
  };

  const bodyParts = [
    {
      id: "chest",
      name: "Ngực (Chest)",
      color: "#ef4444",
      exercises: 3,
    },
    {
      id: "shoulders",
      name: "Vai (Shoulders)",
      color: "#f59e0b",
      exercises: 5,
    },
    {
      id: "arms",
      name: "Tay (Arms)",
      color: "#10b981",
      exercises: 4,
    },
    {
      id: "core",
      name: "Core",
      color: "#3b82f6",
      exercises: 6,
    },
    {
      id: "legs",
      name: "Chân (Legs)",
      color: "#8b5cf6",
      exercises: 5,
    },
  ];

  const features = [
    "Kế hoạch luyện tập cá nhân hóa",
    "Hơn 1000+ bài tập chất lượng cao",
    "Theo dõi tiến độ chi tiết",
    "Mô hình 3D cho phép chọn chi tiết nhóm cơ cần phát triển",
  ];

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Fitnexus
          </div>
          <nav className="hidden gap-8 md:flex">
            <a href="#features" className="transition hover:text-blue-400">
              Mô hình hoá
            </a>
            <a href="#library" className="transition hover:text-blue-400">
              Thư viện tập
            </a>
            <a href="#testimonials" className="transition hover:text-blue-400">
              Dinh dưỡng
            </a>
            <a href="#blog" className="transition hover:text-blue-400">
              Cộng đồng
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              className="transition hover:text-blue-400"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
            <button className="px-6 py-3 font-semibold text-black transition bg-white rounded-full hover:bg-gray-200">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Freeletics Style */}
      <section className="relative flex items-center min-h-screen px-6 pt-32 pb-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/vidbgr.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-8 text-6xl font-normal leading-tight md:text-7xl lg:text-6xl">
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Luyện tập thông minh.
                <br />
                Duy trì đều đặn.
                <br />
                Thành công rực rỡ.
              </span>
             
            </h1>
            <p className="max-w-3xl mx-auto mb-12 text-xl text-gray-300 md:text-2xl">
              Fitnexus kết hợp sức mạnh của AI và chuyên môn của các nhà khoa học thể thao để tạo ra kế hoạch luyện tập tốt nhất cho bạn.
            </p>
            <button 
              onClick={handleStartOnboarding}
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-black transition bg-white rounded-full hover:bg-gray-200 group"
            >
              Nhận kế hoạch luyện tập cá nhân hóa
              <ChevronRight className="transition-transform group-hover:translate-x-1" size={24} />
            </button>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="px-6 py-3 text-sm font-medium border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Laptop Mockup Section */}
      <section className="relative px-6 py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-5xl font-bold md:text-6xl">
              Trải nghiệm luyện tập
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                tương tác 3D
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              Khám phá từng nhóm cơ với mô hình 3D chi tiết và nhận hướng dẫn bài tập phù hợp
            </p>
          </div>

          {/* Laptop Mockup */}
          <div className="relative max-w-6xl mx-auto">
            {/* Laptop Frame */}
            <div className="relative">
              {/* Screen */}
              <div className="p-4 bg-gray-800 border-4 border-gray-700 rounded-t-2xl">
                <div className="overflow-hidden bg-black rounded-lg aspect-video">
                  {/* 3D Model Content */}
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-900 to-black">
                    <div className="w-full h-full">
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
                        <directionalLight position={[-10, -5, -5]} intensity={0.3} />
                        <Suspense fallback={null}>
                          <Bounds fit observe margin={1.2}>
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
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-2xl"></div>
              <div className="w-3/4 h-2 mx-auto bg-gray-900 rounded-b-3xl"></div>
            </div>

            {/* Floating Feature Cards */}
            <div className="absolute hidden -left-8 top-1/4 lg:block">
              <div className="max-w-xs p-6 border bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Click & Khám phá</h3>
                    <p className="text-sm text-gray-400">
                      Chọn nhóm cơ để xem bài tập chi tiết
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute hidden -right-8 top-2/3 lg:block">
              <div className="max-w-xs p-6 border bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Play size={24} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Video 3D</h3>
                    <p className="text-sm text-gray-400">
                      Hướng dẫn chi tiết từng động tác
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Below Laptop */}
          <div className="mt-16 text-center">
            <button onClick={() => navigate("/login")} className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold transition rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">
              Khám phá ngay
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works - Grid Style */}
      <section className="px-6 py-32 bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold md:text-6xl">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-400">
              3 bước đơn giản để bắt đầu hành trình của bạn
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                step: "01",
                title: "Chọn mục tiêu",
                desc: "Xác định mục tiêu và cấp độ hiện tại của bạn",
              },
              {
                icon: Zap,
                step: "02",
                title: "AI tạo kế hoạch",
                desc: "Thuật toán thông minh tạo lộ trình riêng cho bạn",
              },
              {
                icon: Activity,
                step: "03",
                title: "Bắt đầu tập luyện",
                desc: "Theo dõi tiến độ và đạt được kết quả",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-8 transition border border-gray-700 bg-gray-800/50 rounded-3xl hover:border-blue-500 group"
              >
                <div className="mb-4 text-6xl font-bold text-gray-800">
                  {item.step}
                </div>
                <div className="flex items-center justify-center w-16 h-16 mb-6 transition-transform bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110">
                  <item.icon size={32} />
                </div>
                <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                <p className="text-lg text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Muscle Groups Library */}
      <section id="library" className="px-6 py-32 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-bold md:text-6xl">
              Thư viện bài tập
            </h2>
            <p className="text-xl text-gray-400">
              200+ bài tập được phân loại theo nhóm cơ và mục tiêu
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {bodyParts.map((part) => (
              <div
                key={part.id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <div className="relative overflow-hidden transition bg-gray-900 border-2 border-gray-800 aspect-square rounded-3xl hover:border-blue-500 hover:scale-105">
                  <div
                    className="absolute inset-0 transition bg-gradient-to-br opacity-30 group-hover:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${part.color}, transparent)`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 text-6xl transition opacity-50 group-hover:opacity-100">
                        💪
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="mb-2 text-xl font-bold">{part.name}</h3>
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

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-32 bg-gray-900">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="mb-6 text-5xl font-bold md:text-6xl">
            12,000+ người đang luyện tập mỗi tuần
          </h2>
          <p className="mb-20 text-xl text-gray-400">
            Kết quả thực sự từ cộng đồng Fitnexus
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Minh Tuấn",
                result: "Giảm 12kg trong 3 tháng",
                quote: "App đã thay đổi hoàn toàn thói quen tập luyện của tôi. Kế hoạch chi tiết và dễ theo dõi!",
              },
              {
                name: "Thu Hà",
                result: "Tăng 5kg cơ bắp",
                quote: "Mô hình 3D giúp tôi hiểu rõ từng động tác. Không còn lo sai tư thế nữa.",
              },
              {
                name: "Đức Anh",
                result: "Chạy được 10km liên tục",
                quote: "Từ người không thể chạy 1km đến chạy được 10km. Cảm ơn Fitnexus!",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 transition border-2 border-gray-700 bg-gray-800/50 rounded-3xl hover:border-blue-500"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={24}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-lg italic text-gray-300">
                  "{item.quote}"
                </p>
                <div className="pt-6 border-t border-gray-700">
                  <div className="mb-1 text-xl font-bold">{item.name}</div>
                  <div className="font-medium text-blue-400">{item.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="mb-8 text-6xl font-bold leading-tight md:text-7xl">
            Sẵn sàng bắt đầu
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              hành trình của bạn?
            </span>
          </h2>
          <p className="mb-12 text-2xl text-gray-400">
            Tham gia cùng hàng nghìn người đang thay đổi cuộc sống
          </p>
          <button 
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-3 px-12 py-6 text-xl font-semibold text-black transition bg-white rounded-full hover:bg-gray-200"
          >
            Nhận kế hoạch miễn phí
            <ChevronRight size={28} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-black border-t border-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 mb-12 md:grid-cols-4">
            <div>
              <div className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                Fitnexus
              </div>
              <p className="text-gray-400">
                Nền tảng luyện tập thông minh với AI
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Sản phẩm</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Tính năng</a></li>
                <li><a href="#" className="hover:text-white">Giá cả</a></li>
                <li><a href="#" className="hover:text-white">Thư viện</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Công ty</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trợ giúp</a></li>
                <li><a href="#" className="hover:text-white">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white">Bảo mật</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-gray-400 border-t border-gray-800">
            <p>© 2025 Fitnexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Fitnexus3DLanding;
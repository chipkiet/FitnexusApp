import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    const n = user?.fullName || user?.username || "Athlete";
    return String(n).replaceAll("_", " ");
  }, [user]);

  const goExercise = () => navigate(user ? "/exercise/library" : "/exercise/demo");
  const goNutrition = () => navigate(user ? "/nutrition/calories" : "/nutrition/demo");

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header (landing-like) */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-black/70 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
            Fitnexus
          </div>
          <nav className="hidden gap-8 md:flex">
            <button onClick={goExercise} className="transition hover:text-blue-400">Thư viện tập</button>
            <button onClick={goNutrition} className="transition hover:text-blue-400">Dinh dưỡng</button>
            <button onClick={() => navigate('/plan-preview')} className="transition hover:text-blue-400">Kế hoạch</button>
            <button onClick={() => navigate('/model3d')} className="transition hover:text-blue-400">3D Explorer</button>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
              <div className="w-8 h-8 rounded-full bg-indigo-600 grid place-items-center text-sm font-semibold">
                {displayName[0]?.toUpperCase()}
              </div>
              <span className="text-sm">{displayName}</span>
            </div>
            <span className="px-3 py-2 text-xs rounded-full bg-white/10">Plan: {user?.plan || 'FREE'}</span>
          </div>
        </div>
      </header>

      {/* Hero video like landing */}
      <section className="relative flex items-center min-h-[88vh] px-6 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video autoPlay muted loop playsInline className="object-cover w-full h-full">
            <source src="/vidbgr.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85"></div>
        </div>
        <div className="relative z-10 w-full mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Chào {displayName},</span>
              <br />
              sẵn sàng cho buổi tập hôm nay?
            </h1>
            <p className="max-w-2xl mb-8 text-lg text-gray-300">
              Truy cập nhanh đến thư viện bài tập, xem lại kế hoạch cá nhân hoá,
              hoặc ước tính calo và macro phù hợp mục tiêu của bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={goExercise} className="px-6 py-3 font-semibold text-black transition bg-white rounded-full hover:bg-gray-200">Thư viện tập</button>
              <button onClick={() => navigate('/plan-preview')} className="px-6 py-3 font-semibold transition rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105">Kế hoạch của tôi</button>
              <button onClick={goNutrition} className="px-6 py-3 font-semibold transition rounded-full bg-white/10 hover:bg-white/20">Dinh dưỡng</button>
              <button onClick={() => navigate('/onboarding/entry')} className="px-6 py-3 font-semibold transition rounded-full bg-white/10 hover:bg-white/20">Cá nhân hoá lại</button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick grid */}
      <section className="px-6 py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[{
              title:'Thư viện bài tập', desc:'200+ bài tập theo nhóm cơ', action:goExercise
            },{
              title:'Dinh dưỡng & Calories', desc:'Ước tính BMR/TDEE & macro', action:goNutrition
            },{
              title:'3D Explorer', desc:'Khám phá mô hình 3D cơ thể', action:()=>navigate('/model3d')
            }].map((c,i)=> (
              <button key={i} onClick={c.action} className="text-left p-6 transition border border-gray-700 bg-gray-800/40 rounded-3xl hover:border-blue-500">
                <div className="text-sm uppercase tracking-wider text-gray-400">Shortcut</div>
                <div className="mt-2 text-2xl font-bold">{c.title}</div>
                <div className="mt-2 text-gray-400">{c.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Progress + Tips */}
      <section className="px-6 py-16 bg-gray-900">
        <div className="mx-auto grid items-stretch gap-6 max-w-7xl md:grid-cols-2">
          <div className="p-6 border border-gray-800 rounded-3xl bg-gray-800/40">
            <div className="mb-2 text-sm text-gray-400">Tiến độ</div>
            <div className="text-3xl font-bold">Tuần này</div>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <div className="text-3xl font-extrabold">3</div>
                <div className="text-sm text-gray-400">Buổi</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold">42</div>
                <div className="text-sm text-gray-400">Bài tập</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold">1.2k</div>
                <div className="text-sm text-gray-400">kcal</div>
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-800 rounded-3xl bg-gray-800/40">
            <div className="mb-2 text-sm text-gray-400">Mẹo nhanh</div>
            <ul className="space-y-2 text-gray-300 list-disc pl-5">
              <li>Khởi động 5–10 phút trước khi tập.</li>
              <li>Tập trung kỹ thuật trước khi tăng tạ.</li>
              <li>Ngủ 7–8 giờ để phục hồi tối ưu.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-black border-t border-gray-800">
        <div className="mx-auto text-center max-w-7xl text-gray-500">
          © 2025 Fitnexus. Keep pushing forward.
        </div>
      </footer>
    </div>
  );
}

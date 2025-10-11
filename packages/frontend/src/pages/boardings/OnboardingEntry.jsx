// packages/frontend/src/pages/boardings/OnboardingEntry.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import api from "../../lib/api";

export default function OnboardingEntry() {
  const navigate = useNavigate();
  const { guestSession, initGuestOnboarding } = useAuth();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Gọi API session để biết trạng thái onboarding
        const r = await api.get("/api/onboarding/session", {
          params: { t: Date.now() },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          withCredentials: true,
        });

        if (!mounted) return;

        const d = r?.data?.data || {};
        const completed = !d?.required || d?.completed || d?.complete;
        const step = String(d?.nextStepKey || d?.currentStepKey || "age").toLowerCase();

        if (completed) {
          // ✅ Đã hoàn tất tất cả onboarding → về trang chủ
          navigate("/", { replace: true });
        } else {
          // 🚀 Còn bước dở → chuyển sang đúng bước đang dở
          navigate(`/onboarding/${step}`, { replace: true });
        }
      // } catch (err) {
      //   console.error("onboarding entry error:", err);
      //   // ❗ Nếu lỗi (chưa login / mất token) → chuyển về login
      //   navigate("/login", { replace: true });
      // }

      } catch (err) {
  console.error("onboarding entry error:", err);

  if (guestSession) {
    // guest đã có session → cho bắt đầu từ age
    navigate("/onboarding/age", { replace: true });
  } else {
    // chưa có guestSession → tạo mới
    const d = await initGuestOnboarding();
    if (d?.session_id) {
      const step = String(d?.nextStepKey || d?.currentStepKey || "age").toLowerCase();
      navigate(`/onboarding/${step}`, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }
}
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-600">
      <p>Đang kiểm tra tiến trình onboarding...</p>
    </div>
  );
}

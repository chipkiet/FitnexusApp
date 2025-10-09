// packages/frontend/src/pages/boardings/OnboardingEntry.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function OnboardingEntry() {
  const navigate = useNavigate();

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
          navigate("/plan-preview", { replace: true });
        } else {
          navigate(`/onboarding/${step}`, { replace: true });
        }
      } catch (err) {
        console.error("onboarding entry error:", err);
      // Nếu lỗi (chưa login / mất token) → chuyển về login
        navigate("/login", { replace: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      <p>Đang kiểm tra tiến trình onboarding...</p>
    </div>
  );
}

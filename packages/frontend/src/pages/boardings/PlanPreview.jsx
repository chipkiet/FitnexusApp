import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function PlanPreview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await api.get("/api/onboarding/answers", {
          params: { t: Date.now() },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          withCredentials: true,
        });
        if (!mounted) return;
        const data = r?.data?.data;
        if (!data) throw new Error("No data");

        const map = new Map((data.answers || []).map((a) => [a.step_key, a.answers || {}]));
        // derive simple preview
        const age = map.get("age") || {};
        const body = map.get("body_type") || {};
        const goal = map.get("goal") || {};
        const exp = map.get("experience_level") || {};
        const freq = map.get("workout_frequency") || {};

        const days = Number(freq.workout_days_per_week || 3);
        const level = String(exp.experience_level || "BEGINNER");
        const bt = String(body.body_type || "NORMAL");

        const weeklySessions = days;
        const split = days >= 5 ? "Upper/Lower + Push/Pull/Legs" : days >= 4 ? "Upper/Lower" : days >= 3 ? "Full Body" : "Light Full Body";

        setSummary({
          isCompleted: !!data.isCompleted,
          selections: { age, body, goal, exp, freq },
          recommendation: {
            weeklySessions,
            split,
            note:
              level === "BEGINNER"
                ? "Tập kỹ kỹ thuật, tăng dần khối lượng."
                : level === "ADVANCED"
                ? "Tối ưu hoá volume/intensity theo chu kỳ."
                : "Duy trì tiến bộ đều với progressive overload.",
            nutrition:
              bt === "SKINNY"
                ? "Tăng calo nhẹ (+200-300kcal) và đủ protein."
                : bt === "OVERWEIGHT"
                ? "Giảm calo nhẹ (-300-500kcal), ưu tiên thực phẩm toàn phần."
                : "Cân bằng macro và theo dõi số đo.",
          },
        });
      } catch (e) {
        if (!mounted) return;
        setError("Không tìm thấy dữ liệu onboarding. Vui lòng thực hiện lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải bản xem trước kế hoạch...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white border border-red-200 text-red-700 rounded-xl px-6 py-4">
          {error}
          <div className="mt-3 text-center">
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={() => navigate('/onboarding/entry')}>Thực hiện Onboarding</button>
          </div>
        </div>
      </div>
    );
  }

  const { selections, recommendation } = summary || {};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Bản xem trước kế hoạch luyện tập</h1>
          <p className="text-gray-600 mt-2">Dựa trên thông tin bạn đã cung cấp trong Onboarding.</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">Tóm tắt lựa chọn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div><span className="text-gray-500">Thể trạng:</span> {selections?.body?.body_type || "-"}</div>
              <div><span className="text-gray-500">Mục tiêu:</span> {selections?.goal?.goal_key || selections?.goal?.goal || "-"}</div>
              <div><span className="text-gray-500">Kinh nghiệm:</span> {selections?.exp?.experience_level || "-"}</div>
              <div><span className="text-gray-500">Số buổi/tuần:</span> {selections?.freq?.workout_days_per_week || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">Khuyến nghị tổng quan</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-800">
              <li>{recommendation.weeklySessions} buổi/tuần</li>
              <li>Phân bổ buổi tập: {recommendation.split}</li>
              <li>Ghi chú: {recommendation.note}</li>
              <li>Dinh dưỡng: {recommendation.nutrition}</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg mb-3">Lưu kế hoạch của bạn</h2>
            <p className="text-gray-600 mb-4">Đăng ký tài khoản để lưu và theo dõi tiến độ.</p>
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-lg bg-blue-600 text-white" onClick={() => navigate('/register')}>Đăng ký</button>
              <button className="px-5 py-2 rounded-lg border border-gray-300" onClick={() => navigate('/')}>Về trang chủ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


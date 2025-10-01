import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/auth.context";

export default function Onboarding() {
  const [dongYDieuKhoan, setDongYDieuKhoan] = useState(false);
  const [nhanMarketing, setNhanMarketing] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, markOnboarded } = useAuth();

  // Trang gốc trước khi bị chặn (nếu PrivateRoute đã truyền state.from)
  const returnTo = location.state?.from?.pathname || "/";

  // ⬇️ value phải TRÙNG key trong DB
  const OPTIONS = [
    { label: "Tuổi: 16–29", value: "AGE_16_29", img: "/images/age-18-29.png" },
    { label: "Tuổi: 30–39", value: "AGE_30_39", img: "/images/age-30-39.png" },
    { label: "Tuổi: 40–49", value: "AGE_40_49", img: "/images/age-40-49.png" },
    { label: "Tuổi: 50+",   value: "AGE_50_PLUS", img: "/images/age-50.png" },
  ];

  const chonDoTuoi = async (ageGroup) => {
    if (!dongYDieuKhoan) {
      setLoi("Bạn cần đồng ý với Điều khoản để tiếp tục.");
      return;
    }
    if (dangLuu) return; // chặn double click

    setLoi(null);
    setDangLuu(true);
    try {
      const res = await api.post("/api/onboarding/steps/age/answer", {
        answers: { age_group: ageGroup, marketing: nhanMarketing },
      });

      // Age là bước cuối cùng: đánh dấu đã onboard và chuyển về trang chủ (post-login home)
      // Refresh trước rồi đánh dấu local để không bị ghi đè trạng thái onboarded
      await refreshUser();
      try { markOnboarded(); } catch {}
      navigate("/", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 404
          ? "Chưa cấu hình bước onboarding (age)."
          : status === 422
          ? "Giá trị độ tuổi không hợp lệ. Hãy chọn lại."
          : "Không thể lưu lựa chọn, vui lòng thử lại.");
      setLoi(msg);
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-center">
          BUILD YOUR PERFECT BODY
        </h1>
        <p className="mt-2 text-sm md:text-base text-center text-neutral-300">
          THEO ĐỘ TUỔI VÀ BMI CỦA BẠN
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={dangLuu}
              onClick={() => chonDoTuoi(opt.value)}
              className="group rounded-xl overflow-hidden bg-neutral-900/80 border border-neutral-800 hover:border-orange-500 transition transform hover:scale-[1.02] disabled:opacity-60"
            >
              <div className="aspect-[4/3] w-full bg-neutral-800">
                <img
                  src={opt.img}
                  alt={opt.label}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="bg-orange-600 text-center py-2 font-semibold">
                {opt.label}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 w-full max-w-3xl space-y-4 text-sm md:text-[15px]">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={dongYDieuKhoan}
              onChange={(e) => setDongYDieuKhoan(e.target.checked)}
            />
            <span className="text-neutral-300">
              Tiếp tục đồng nghĩa với việc bạn chấp nhận{" "}
              <a href="#" onClick={(e)=>e.preventDefault()} className="underline text-blue-400">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" onClick={(e)=>e.preventDefault()} className="underline text-blue-400">
                Chính sách quyền riêng tư
              </a>, cũng như{" "}
              <a href="#" onClick={(e)=>e.preventDefault()} className="underline text-blue-400">
                Chính sách cookie
              </a>.
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={nhanMarketing}
              onChange={(e) => setNhanMarketing(e.target.checked)}
            />
            <span className="text-neutral-300">
              Tôi muốn nhận thông tin cập nhật về sản phẩm, dịch vụ và ưu đãi qua email.
            </span>
          </label>

          <p className="text-xs text-neutral-500">
            Chúng tôi khuyến nghị bạn tham vấn bác sĩ trước khi bắt đầu bất kỳ chương trình tập luyện nào.
          </p>
        </div>

        {loi && <div className="mt-4 text-red-400 text-sm">{loi}</div>}

        {dangLuu && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700">
              Đang lưu lựa chọn...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

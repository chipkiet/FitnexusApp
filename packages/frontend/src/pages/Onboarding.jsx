import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/auth.context";

export default function Onboarding() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  // Bảo vệ route: phải đang đăng nhập (session), nếu không thì đẩy về /login
  useEffect(() => {
    (async () => {
      try {
        await oauthLogin();
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!acceptTerms) {
      setErr("Bạn cần đồng ý với Điều khoản để tiếp tục.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/auth/consent", { acceptTerms, marketing });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "Không thể lưu lựa chọn");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4">Bước 2: Điều khoản & Điều kiện</h1>

        <label className="flex gap-3 items-start p-3 border rounded-lg mb-3">
          <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} />
          <span>
            Tôi đã đọc và đồng ý với{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} className="text-blue-600 underline">Điều khoản</a>{" "}
            và{" "}
            <a href="#" onClick={(e)=>e.preventDefault()} className="text-blue-600 underline">Chính sách riêng tư</a>.
          </span>
        </label>

        <label className="flex gap-3 items-start p-3 border rounded-lg mb-4">
          <input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)} />
          <span>Cho phép gửi thông tin khuyến mãi/tiếp thị qua email.</span>
        </label>

        {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

        <button
          disabled={!acceptTerms || saving}
          className="w-full py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}

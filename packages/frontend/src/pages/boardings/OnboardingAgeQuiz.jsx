import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OnboardingProgress from '../../components/OnboardingProgress.jsx';
import { submitOnboardingAnswer } from '../../lib/onboarding';
import { useOnboardingGuard } from '../../hooks/useOnboardingGuard';
import { useAuth } from '../../context/auth.context.jsx';

export default function OnboardingAgeQuiz() {
  const [agreeTos, setAgreeTos] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, markOnboarded } = useAuth();
  const returnTo = location.state?.from?.pathname || '/';

  useOnboardingGuard('age');

  const OPTIONS = [
    { label: 'Tuổi: 16–29', value: 'AGE_16_29', img: '/images/age-18-29.png' },
    { label: 'Tuổi: 30–39', value: 'AGE_30_39', img: '/images/age-30-39.png' },
    { label: 'Tuổi: 40–49', value: 'AGE_40_49', img: '/images/age-40-49.png' },
    { label: 'Tuổi: 50+', value: 'AGE_50_PLUS', img: '/images/age-50.png' },
  ];

  const choose = async (ageGroup) => {
    if (!agreeTos || !marketing) {
      setError('Vui lòng tích đồng ý điều khoản và nhận thông tin trước khi tiếp tục.');
      return;
    }
    if (saving) return;
    setError(null);
    setSaving(true);
    try {
      await submitOnboardingAnswer({
        stepKey: 'age',
        answers: { age_group: ageGroup, marketing },
        navigate,
        refreshUser,
        markOnboarded,
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ||
        (status === 404 ? 'Chưa cấu hình bước onboarding (age).' :
         status === 422 ? 'Giá trị độ tuổi không hợp lệ. Hãy chọn lại.' :
         'Không thể lưu lựa chọn, vui lòng thử lại.');
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (saving) return;
      const idx = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key];
      if (idx != null && OPTIONS[idx]) choose(OPTIONS[idx].value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [saving]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 bg-white/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-gray-200 p-6 md:p-10">
          <div>
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500">FitNexus</div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Chọn nhóm độ tuổi</h1>
              <p className="mt-2 text-gray-500">Hệ thống sẽ cá nhân hóa kế hoạch tập luyện theo độ tuổi &amp; BMI của bạn.</p>
              <OnboardingProgress currentKey="age" />
            </div>

            <div className="space-y-4">
              {OPTIONS.map((opt, idx) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={saving}
                  onClick={() => choose(opt.value)}
                  className="w-full group flex items-center justify-between rounded-2xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="p-5 text-left">
                    <div className="text-base font-semibold text-gray-800 group-hover:text-blue-700">
                      <span className="mr-2 text-gray-400">{idx + 1}.</span>{opt.label}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Gợi ý bài tập &amp; dinh dưỡng tương ứng</div>
                  </div>
                  <div className="w-36 h-28 bg-gray-100 rounded-r-2xl overflow-hidden">
                    <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.style.display='none';}} />
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
            )}

            <div className="mt-6 space-y-4 text-sm">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={agreeTos} onChange={(e)=>setAgreeTos(e.target.checked)} />
                <span className="text-gray-600">
                  Tiếp tục đồng nghĩa với việc bạn chấp nhận{' '}
                  <a href="#" onClick={(e)=>e.preventDefault()} className="font-medium text-blue-600 hover:underline">Điều khoản dịch vụ</a>{' '}và{' '}
                  <a href="#" onClick={(e)=>e.preventDefault()} className="font-medium text-blue-600 hover:underline">Chính sách quyền riêng tư</a>, cùng với{' '}
                  <a href="#" onClick={(e)=>e.preventDefault()} className="font-medium text-blue-600 hover:underline">Chính sách cookie</a>.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={marketing} onChange={(e)=>setMarketing(e.target.checked)} />
                <span className="text-gray-600">Tôi muốn nhận thông tin cập nhật về sản phẩm, dịch vụ và ưu đãi qua email.</span>
              </label>

              <p className="text-xs text-gray-500">Khuyến nghị tham vấn bác sĩ trước khi bắt đầu bất kỳ chương trình tập luyện nào.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl ring-1 ring-gray-200 flex items-center justify-center">
              <img src="/images/onboarding-illustration.png" alt="Onboarding Illustration" className="max-w-[70%] h-auto" onError={(e)=>{e.currentTarget.style.display='none';}} />
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
          <div className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 shadow">Đang lưu lựa chọn...</div>
        </div>
      )}
    </div>
  );
}


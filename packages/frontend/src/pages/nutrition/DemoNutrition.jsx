import { useState } from "react";

export default function DemoNutrition() {
  const [goal, setGoal] = useState('FAT_LOSS');
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#101014,#0b0a12)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold">Calories & Macros (Demo)</h1>
        <p className="mt-2 text-white/70">Bản demo minh họa cách ước tính calo và macro. Đăng nhập để sử dụng đầy đủ và lưu kết quả.</p>

        <div className="mt-6 p-5 rounded-2xl bg-white/5 ring-1 ring-white/10">
          <label className="text-sm text-white/70">Mục tiêu
            <select className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10" value={goal} onChange={(e)=>setGoal(e.target.value)}>
              <option value="FAT_LOSS">Giảm mỡ</option>
              <option value="MAINTAIN">Duy trì</option>
              <option value="MUSCLE_GAIN">Tăng cơ</option>
            </select>
          </label>
          <div className="mt-4 text-sm text-white/70">
            Gợi ý nhanh: {goal==='FAT_LOSS'?'-300~500 kcal':'+' + (goal==='MUSCLE_GAIN'?'200~300':'0')} so với TDEE, protein 1.6–2.2g/kg.
          </div>
        </div>

        <div className="mt-8">
          <a href="/login" className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">Đăng nhập để dùng đầy đủ</a>
        </div>
      </div>
    </div>
  );
}


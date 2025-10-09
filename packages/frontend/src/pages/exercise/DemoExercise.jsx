export default function DemoExercise() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#101014,#0b0a12)] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold">Exercise Library (Demo)</h1>
        <p className="mt-2 text-white/70 max-w-2xl">
          Đây là bản xem trước thư viện bài tập. Đăng nhập để truy cập đầy đủ danh sách, tìm kiếm,
          và gợi ý theo nhóm cơ của bạn.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {["Chest","Back","Shoulders","Arms","Core","Legs"].map((g) => (
            <div key={g} className="p-5 rounded-2xl bg-white/5 ring-1 ring-white/10">
              <div className="text-sm text-white/60">Muscle Group</div>
              <div className="text-lg font-semibold">{g}</div>
              <ul className="mt-2 text-sm text-white/70 space-y-1">
                <li>• Sample Exercise A</li>
                <li>• Sample Exercise B</li>
                <li>• Sample Exercise C</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a href="/login" className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">Đăng nhập để mở khoá</a>
        </div>
      </div>
    </div>
  );
}


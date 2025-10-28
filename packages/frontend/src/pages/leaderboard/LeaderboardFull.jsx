import React, { useEffect, useState } from "react";
import HeaderLogin from "../../components/header/HeaderLogin.jsx";
import { api, endpoints } from "../../lib/api.js";

export default function LeaderboardFull() {
  const [tab, setTab] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [me, setMe] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoints.leaderboards.week);
      const ok = res?.data?.success;
      const data = res?.data?.data;
      if (ok && data) {
        setItems(Array.isArray(data.items) ? data.items : []);
        setMe(data.me || null);
      } else {
        setError(res?.data?.message || "Không tải được bảng xếp hạng");
      }
    } catch (_err) {
      setError("Có lỗi xảy ra khi tải bảng xếp hạng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const Medal = ({ rank }) => {
    const color = rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-amber-700";
    return (
      <svg className={`w-5 h-5 ${color}`} viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.39 4.84L18 7.27l-3.9 3.8.92 5.36L10 14.77l-5.02 2.66.92-5.36L2 7.27l5.61-.43L10 2z"/></svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <HeaderLogin />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Bảng xếp hạng</h1>
            <p className="text-sm text-gray-500">Cập nhật theo hoạt động gần đây</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-full p-1 border border-gray-200">
            <button onClick={() => setTab("week")} className={`px-4 py-2 text-sm rounded-full ${tab==='week'?'bg-blue-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>Tuần</button>
            <button disabled className={`px-4 py-2 text-sm rounded-full ${tab==='month'?'bg-blue-600 text-white':'text-gray-400'}`}>Tháng</button>
          </div>
        </div>

        {me && (
          <div className="mb-6 bg-blue-600 text-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-white/90">Hạng của bạn</span>
                <span className="text-xl font-bold">#{me.rank}</span>
              </div>
              <div className="text-white/90">Điểm: <span className="font-semibold">{me.score}</span></div>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading && <div className="p-6 text-gray-600">Đang tải...</div>}
          {error && !loading && (
            <div className="m-5 px-4 py-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          {!loading && !error && (
            <ul className="divide-y divide-gray-100">
              {items.map((row) => (
                <li key={row.rank} className={`px-5 py-3 flex items-center justify-between ${row.rank<=3?'bg-gradient-to-r from-amber-50 to-transparent':''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-semibold text-gray-800 flex items-center justify-center gap-1">
                      {row.rank<=3 ? <Medal rank={row.rank}/> : null}
                      <span>#{row.rank}</span>
                    </div>
                    {row.avatarUrl ? (
                      <img src={row.avatarUrl} alt={row.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                        {(row.username||'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{row.username}</div>
                      <div className="text-xs text-gray-500">Điểm: {row.score}</div>
                    </div>
                  </div>
                  {row.rank<=3 && (
                    <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Top {row.rank}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}


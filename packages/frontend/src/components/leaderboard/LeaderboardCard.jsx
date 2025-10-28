import React, { useEffect, useState } from "react";
import { api, endpoints } from "../../lib/api.js";
import { useAuth } from "../../context/auth.context.jsx";

export default function LeaderboardCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [me, setMe] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(endpoints.leaderboards.week);
        if (!mounted) return;
        const ok = res?.data?.success;
        const data = res?.data?.data;
        if (ok && data) {
          setItems(Array.isArray(data.items) ? data.items : []);
          setMe(data.me || null);
        } else {
          setError(res?.data?.message || "Không tải được bảng xếp hạng");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải bảng xếp hạng");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const Avatar = ({ src, name }) => (
    src ? (
      <img alt={name} src={src} className="w-8 h-8 rounded-full object-cover" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
        {(name || "U").trim()[0]?.toUpperCase() || "U"}
      </div>
    )
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Xếp hạng tuần</h3>
          <p className="text-xs text-gray-500">Cập nhật theo hoạt động gần đây</p>
        </div>
        {me && (
          <div className="text-right">
            <div className="text-sm">Hạng của bạn: <span className="font-semibold">#{me.rank}</span></div>
            <div className="text-xs text-gray-500">Điểm: {me.score}</div>
          </div>
        )}
      </div>

      {loading && <div className="p-5 text-sm text-gray-600">Đang tải...</div>}
      {error && !loading && (
        <div className="mx-5 my-4 px-4 py-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ul className="divide-y divide-gray-100">
          {items.slice(0, 10).map((row) => (
            <li key={row.rank} className={`px-5 py-3 flex items-center justify-between ${row.id === user?.user_id ? 'bg-blue-50/40' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-semibold text-gray-700">{row.rank}</div>
                <Avatar src={row.avatarUrl} name={row.username} />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{row.username}</div>
                  <div className="text-xs text-gray-500">Điểm: {row.score}</div>
                </div>
              </div>
              {row.id === user?.user_id && (
                <span className="text-xxs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Bạn</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


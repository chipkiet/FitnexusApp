// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { getAdminUsers } from "../lib/api.js";
const PLANS = ["ALL", "FREE", "PREMIUM"];
const ACTIVE_WINDOW_MIN = 5; // trong vòng 5 phút thì coi là ACTIVE
const AUTORELOAD_SEC = 30;   // auto reload danh sách mỗi 30s

export default function AdminUsers() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // đồng bộ query plan -> state
  useEffect(() => {
    const p = (searchParams.get("plan") || "ALL").toUpperCase();
    setPlanFilter(PLANS.includes(p) ? p : "ALL");
    setOffset(0);
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsers({
        limit,
        offset,
        search: search.trim(),
        plan: planFilter !== "ALL" ? planFilter : undefined,
      });
      setItems(res?.data?.items || []);
      setTotal(res?.data?.total || 0);
    } catch (e) {
      setError(e?.response?.data || { message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset, planFilter]);

  // Tự động làm mới danh sách
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => load(), AUTORELOAD_SEC * 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset, planFilter, search]);

  const onSearch = async (e) => {
    e.preventDefault();
    setOffset(0);
    await load();
  };

  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  // ===== Helpers hiển thị =====
  const PlanBadge = ({ plan }) => (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      {plan}
    </span>
  );

  function getActivityStatus(u) {
    // nếu DB đang gắn BANNED thì hiển thị đỏ, ưu tiên hơn
    if (String(u.status || "").toUpperCase() === "BANNED") return "BANNED";
    if (!u.lastLoginAt) return "INACTIVE";
    const last = new Date(u.lastLoginAt);
    if (isNaN(+last)) return "INACTIVE";
    const diffMin = (Date.now() - last.getTime()) / (1000 * 60);
    return diffMin <= ACTIVE_WINDOW_MIN ? "ACTIVE" : "INACTIVE";
  }

  const StatusBadge = ({ user }) => {
    const s = getActivityStatus(user);
    const cls =
      s === "ACTIVE"
        ? "bg-green-100 text-green-800"
        : s === "BANNED"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800";
    const lastSeen =
      user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleString()
        : "Never";

    return (
      <span
        title={`Last seen: ${lastSeen}`}
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls}`}
      >
        {s}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Logged in as:{" "}
                <span className="font-medium text-indigo-600">{user?.username}</span>{" "}
                ({user?.role})
              </p>
            </div>
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
              Total Users: <span className="font-semibold text-indigo-600">{total}</span>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <form className="flex flex-col md:flex-row gap-4" onSubmit={onSearch}>
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by username or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Plan:</label>
              <select
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setOffset(0);
                }}
              >
                {PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
              {search || planFilter !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPlanFilter("ALL");
                    setOffset(0);
                    load();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Reset
                </button>
              ) : null}
            </div>
          </form>
          <div className="mt-2 text-xs text-gray-400">
            Auto refresh every {AUTORELOAD_SEC}s • Active window: {ACTIVE_WINDOW_MIN} minutes
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  items.map((u) => (
                    <tr key={u.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <PlanBadge plan={u.plan} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge user={u} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 border rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
            </span>
            <button
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
            >
              Next
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Show:</span>
            <select
              className="border border-gray-300 rounded-md shadow-sm py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setOffset(0);
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

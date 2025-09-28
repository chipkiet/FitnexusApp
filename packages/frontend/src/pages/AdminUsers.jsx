import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { getAdminUsers, patchUserRole } from "../lib/api.js";

const PLANS = ["ALL", "FREE", "PREMIUM"];
const ROLES = ["USER", "TRAINER", "ADMIN"];

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
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  // Sync plan từ URL vào state
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
        search,
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

  const onSearch = (e) => {
    e.preventDefault();
    setOffset(0);
    load();
  };

  const onChangeRole = async (id, role) => {
    try {
      setSavingId(id);
      await patchUserRole(id, role);
      setItems((prev) => prev.map((u) => (u.user_id === id ? { ...u, role } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || "Update role failed");
    } finally {
      setSavingId(null);
    }
  };

  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin - Users</h1>
      <div className="text-sm text-gray-600 mb-4">
        Logged in as: {user?.username} ({user?.role})
      </div>

      {/* Search */}
      <form className="flex gap-2 mb-4" onSubmit={onSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username or email"
          className="border rounded px-3 py-2 w-80"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>

      {error && (
        <div className="mb-3 text-red-600 text-sm">{error.message || "Error"}</div>
      )}

      <div className="mb-3 text-sm text-gray-600">Total: {total}</div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Plan</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={7}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={7}>No users</td></tr>
            ) : (
              items.map((u) => (
                <tr key={u.user_id} className="border-t">
                  <td className="p-2">{u.user_id}</td>
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      disabled={savingId === u.user_id}
                      onChange={(e) => onChangeRole(u.user_id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">{u.plan}</td>
                  <td className="p-2">{u.status}</td>
                  <td className="p-2">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 mt-3">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {pages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setOffset(offset + limit)}
          disabled={offset + limit >= total}
        >
          Next
        </button>
        <select
          className="ml-2 border rounded px-2 py-1"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setOffset(0);
          }}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

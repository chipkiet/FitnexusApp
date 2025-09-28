import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context.jsx";
import { getAdminUsers, patchUserRole } from "../../lib/api.js";
import { Pencil } from "lucide-react";

const ROLE_FILTERS = ["ALL", "USER", "TRAINER", "ADMIN"];

export default function Role() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentRole = (searchParams.get("role") || "ALL").toUpperCase();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // trạng thái edit/save cho từng hàng
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminUsers({
        limit,
        offset,
        search,
        role: currentRole !== "ALL" ? currentRole : undefined,
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
  }, [limit, offset, currentRole]);

  const onSearch = (e) => {
    e.preventDefault();
    setOffset(0);
    load();
  };

  // Chỉ cho phép USER <-> TRAINER. ADMIN không đổi.
  const allowedTargets = (current) => {
    if (current === "ADMIN") return ["ADMIN"]; // không đổi
    return ["USER", "TRAINER"]; // qua lại hai role này
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      setSavingId(id);
      await patchUserRole(id, newRole);
      setEditingId(null);
      await load();
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
      <h1 className="text-2xl font-semibold mb-4">Role</h1>
      <div className="text-sm text-gray-600 mb-4">
        Logged in as: {user?.username} ({user?.role})
      </div>

      {/* Search box */}
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

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={6}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={6}>No users</td></tr>
            ) : (
              items.map((u) => {
                const options = allowedTargets(u.role);
                const canEdit = options.length > 1; // ADMIN => chỉ 1 option, không cho sửa
                return (
                  <tr key={u.user_id} className="border-t">
                    <td className="p-2">{u.user_id}</td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>

                    {/* Role cell */}
                    <td className="p-2">
                      {editingId === u.user_id && canEdit ? (
                        <div className="flex items-center gap-2">
                          {options.map((r) => (
                            <button
                              key={r}
                              disabled={savingId === u.user_id}
                              onClick={() => handleUpdateRole(u.user_id, r)}
                              className={`px-2 py-1 rounded border ${
                                u.role === r
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-gray-500 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{u.role}</span>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => setEditingId(u.user_id)}
                              className="text-gray-500 hover:text-blue-600"
                              title="Edit role"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-2">{u.status}</td>
                    <td className="p-2">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                );
              })
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
        <span className="text-sm">Page {page} / {pages}</span>
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
            <option key={n} value={n}>{n}/page</option>
          ))}
        </select>
      </div>
    </div>
  );
}

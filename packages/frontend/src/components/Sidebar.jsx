import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [openUserManage, setOpenUserManage] = useState(true);

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">PAGES</h2>

      {/* User Manage */}
      <div>
        <button
          onClick={() => setOpenUserManage(!openUserManage)}
          className="flex justify-between items-center w-full px-2 py-2 hover:bg-gray-200 rounded"
        >
          <span>User Manage</span>
          <span>{openUserManage ? "▾" : "▸"}</span>
        </button>

        {openUserManage && (
          <div className="ml-4 mt-2 space-y-1">
            <Link to="/admin/users" className="block px-2 py-1 hover:bg-gray-200 rounded">
              All Users
            </Link>
            {/* Thêm FREE & PREMIUM filter luôn ở sidebar */}
            <Link to="/admin/users?plan=FREE" className="block px-2 py-1 hover:bg-gray-200 rounded">
              FREE Users
            </Link>
            <Link to="/admin/users?plan=PREMIUM" className="block px-2 py-1 hover:bg-gray-200 rounded">
              PREMIUM Users
            </Link>
            <Link to="/admin/user-detail" className="block px-2 py-1 hover:bg-gray-200 rounded">
              User Detail
            </Link>
            <Link to="/admin/role-plan" className="block px-2 py-1 hover:bg-gray-200 rounded">
              Role & Plan
            </Link>
          </div>
        )}
      </div>

      {/* Các menu khác */}
      <div className="mt-4">
        <Link to="/admin/content" className="block px-2 py-2 hover:bg-gray-200 rounded">
          Content Manage
        </Link>
        <Link to="/admin/trainer" className="block px-2 py-2 hover:bg-gray-200 rounded">
          Trainer Manage
        </Link>
        <Link to="/admin/finance" className="block px-2 py-2 hover:bg-gray-200 rounded">
          Financial Manage
        </Link>
      </div>
    </div>
  );
}

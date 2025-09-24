import React, { useMemo, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {useAuth} from '../context/auth.context';
import {
  ChevronRight,
  Home,
  LayoutDashboard,
  Users,
  UserRound,
  IdCard,
  Unlock,
  KeyRound,
  FolderKanban,
  Dumbbell,
  Wallet,
  MessageSquare,
  Bell,
  Search,
  Sun,
} from "lucide-react";


// Tailwind notes
// - Sidebar and notifications use sticky positioning to match the reference screenshot
// - Varied font sizes, soft borders and rounded corners for a clean admin look
// - Active nav items are highlighted with bg-gray-100 and a subtle font weight
// - Collapsible groups show an arrow that rotates when open

export default function AdminLayout() {

  const location = useLocation();

  const [open, setOpen] = useState({
    user: true,
    content: false,
    trainer: false,
    financial: false,
    social: false,
  });

  const {user, logout} = useAuth();
  const isActivePath = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
      isActive ? "bg-gray-100 font-medium" : ""
    }`;

  const sections = useMemo(
    () => [
      {
        key: "user",
        icon: Users,
        label: "User Manage",
        children: [
          { icon: UserRound, label: "All Users", to: "/admin/users" },
          { icon: IdCard, label: "User Detail", to: "/admin/user-detail" },
          { icon: IdCard, label: "Role & Plan", to: "/admin/role-plan" },
          { icon: Unlock, label: "Lock & Unlock", to: "/admin/lock-unlock" },
          { icon: KeyRound, label: "Reset password", to: "/admin/reset-password" },
        ],
      },
      {
        key: "content",
        icon: FolderKanban,
        label: "Content Manage",
        children: [{ label: "Overview", to: "/admin/content" }],
      },
      {
        key: "trainer",
        icon: Dumbbell,
        label: "Trainer Manage",
        children: [{ label: "Overview", to: "/admin/trainers" }],
      },
      {
        key: "financial",
        icon: Wallet,
        label: "Financial Manage",
        children: [{ label: "Overview", to: "/admin/finance" }],
      },
      {
        key: "social",
        icon: MessageSquare,
        label: "Social",
        children: [{ label: "Overview", to: "/admin/social" }],
      },
    ],
    []
  );

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      {/* Top header bar (full width) */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center w-8 h-8 border rounded-md hover:bg-gray-50 lg:hidden">
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <div className="relative items-center hidden gap-2 sm:flex">
              <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                className="w-72 rounded-md border px-9 py-1.5 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Sun className="w-4 h-4" />
            <Bell className="w-4 h-4" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-64 shrink-0 border-r bg-white p-4 lg:block">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-black rounded" />
            <div className="font-semibold">FITNEXUS</div>
          </div>

          {/* Dashboards */}
          <div className="mb-2 text-xs text-gray-500 uppercase">Dashboards</div>
          <nav className="mb-4 space-y-1 text-sm">
            <NavLink to="/admin" end className={linkClass}>
              <Home className="w-4 h-4" /> Overview
            </NavLink>
            <NavLink to="/admin/projects" className={linkClass}>
              <LayoutDashboard className="w-4 h-4" /> Projects
            </NavLink>
          </nav>

          {/* Pages */}
          <div className="mt-6 mb-2 text-xs text-gray-500 uppercase">Pages</div>
          <nav className="space-y-1 text-sm">
            {sections.map((sec) => {
              const SecIcon = sec.icon;
              const active = sec.children.some((c) => isActivePath(c.to));
              return (
                <div key={sec.key}>
                  <button
                    onClick={() => toggle(sec.key)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100 ${
                      active ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {SecIcon && <SecIcon className="w-4 h-4" />}
                      {sec.label}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${open[sec.key] ? "rotate-90" : ""}`}
                    />
                  </button>
                  {open[sec.key] && (
                    <div className="pl-2 mt-1 ml-2 border-l">
                      {sec.children.map((item) => (
                        <NavLink key={item.to} to={item.to} className={linkClass}>
                          {item.icon && <item.icon className="w-4 h-4" />} {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb + user */}
          <div className="flex items-center justify-between px-4 bg-white border-b h-14">
            <div className="text-sm text-gray-500">
              <Link to="/admin" className="hover:underline">
                Dashboards
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Default</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span>ADMIN</span>
              <button onClick={logout} className="px-3 py-1 border rounded hover:bg-gray-50">Logout</button>
            </div>
          </div>

          {/* Routed content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Right notifications rail */}
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-80 shrink-0 border-l bg-white p-4 xl:block">
          <div className="mb-3 font-medium">Notifications</div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border"><Bell className="h-3.5 w-3.5"/></span>
              <div>
                You fixed a bug. <span className="text-gray-400">Just now</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border"><Users className="h-3.5 w-3.5"/></span>
              <div>
                New user registered. <span className="text-gray-400">59 minutes ago</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border"><Bell className="h-3.5 w-3.5"/></span>
              <div>
                You fixed a bug. <span className="text-gray-400">12 hours ago</span>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

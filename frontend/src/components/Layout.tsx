import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames";
import {
  LayoutDashboard,
  Sprout,
  ScrollText,
  Trophy,
  Award,
  Gift,
  ClipboardCheck,
  LogOut,
  Leaf,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import FloatingOrbs from "./FloatingOrbs";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/activities", label: "Activities", icon: Sprout },
  { to: "/history", label: "My History", icon: ScrollText },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/badges", label: "Badges", icon: Award },
  { to: "/rewards", label: "Rewards", icon: Gift },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/activities": "CSR Activities",
  "/history": "My History",
  "/leaderboard": "Leaderboard",
  "/badges": "Badges",
  "/rewards": "Rewards",
  "/approvals": "Pending Approvals",
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems =
    user?.role === "MANAGER" || user?.role === "ADMIN"
      ? [...links, { to: "/approvals", label: "Approvals", icon: ClipboardCheck }]
      : links;

  return (
    <div className="min-h-screen bg-paper-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-moss-gradient relative flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        <FloatingOrbs variant="dark" />

        <div className="px-6 py-6 flex items-center gap-2.5 relative">
          <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-glow">
            <Leaf size={18} strokeWidth={2.5} className="text-moss-900" />
          </div>
          <h1 className="font-display text-xl font-semibold text-white tracking-tight">
            EcoSphere
          </h1>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-white/10 text-white shadow-soft"
                      : "text-white/55 hover:text-white/90 hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-lime-400 shadow-glow" />
                    )}
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className={classNames("transition-transform group-hover:scale-110", isActive ? "text-lime-400" : "")}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 mx-3 mb-4 rounded-xl bg-white/5 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-lime-400/90 text-moss-900 font-semibold text-xs flex items-center justify-center shrink-0 font-mono-tab">
              {initials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 text-xs text-white/50 hover:text-lime-300 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-ink-900/[0.06] flex items-center px-8 bg-paper-50/70 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="font-display text-lg font-medium text-ink-900">
            {pageTitles[location.pathname] ?? ""}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <span
              className={classNames(
                "text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full",
                user?.role === "ADMIN"
                  ? "bg-amber-400/20 text-amber-500"
                  : user?.role === "MANAGER"
                  ? "bg-sky-400/20 text-sky-500"
                  : "bg-canopy-500/15 text-canopy-500"
              )}
            >
              {user?.role}
            </span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-dot-grid">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

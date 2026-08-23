import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Rss, Users, User, Briefcase,
  Code2, BookOpen, Bell, Settings, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import GrowthRing from "./GrowthRing";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/network", label: "Network", icon: Users },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/development", label: "Development", icon: Code2 },
  { to: "/resources", label: "Resources", icon: BookOpen },
];

// Show these in mobile bottom nav (most used)
const mobileNavItems = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/feed", label: "Feed", icon: Rss },
  { to: "/network", label: "Network", icon: Users },
  { to: "/opportunities", label: "Opps", icon: Briefcase },
  { to: "/development", label: "Growth", icon: Code2 },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 border-r border-line px-4 py-8">
        <Logo />
        <nav className="mt-8 flex flex-col gap-0.5" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Notification & Settings */}
        <div className="mt-4 flex flex-col gap-0.5">
          <NavItem to="/notifications" label="Notifications" icon={Bell} badge={unreadCount} />
          <NavItem to="/settings" label="Settings" icon={Settings} />
        </div>

        {/* User info + signout */}
        <div className="mt-auto pt-4 border-t border-line">
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 mb-3 w-full hover:opacity-80 transition-opacity"
              aria-label="View your profile"
            >
              <GrowthRing user={user} size={40} />
              <div className="min-w-0 text-left">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-ink-soft truncate">
                  {user.headline || "No headline yet"}
                </p>
              </div>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors w-full px-3 py-2 rounded-lg hover:bg-black/[0.03]"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-line bg-parchment/95 backdrop-blur sticky top-0 z-20">
        <Logo compact />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/notifications")}
            className="relative p-1.5"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell size={20} className="text-ink-soft" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {user && (
            <button onClick={() => navigate("/profile")} aria-label="Your profile">
              <GrowthRing user={user} size={34} />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 border-t border-line bg-surface flex justify-around py-2 z-20"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium ${
                isActive ? "text-forest" : "text-ink-soft"
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? "bg-forest/10 text-forest-dark"
            : "text-ink-soft hover:bg-black/[0.03] hover:text-ink"
        }`
      }
    >
      <span className="relative">
        <Icon size={17} />
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] text-white font-bold">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      {label}
    </NavLink>
  );
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2 px-3">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="12" fill="none" stroke="#E4DFD1" strokeWidth="1.5" />
        <circle cx="13" cy="13" r="8.5" fill="none" stroke="#2F5233" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="13" cy="13" r="3.2" fill="#C9A227" />
      </svg>
      {!compact && (
        <span className="font-display text-xl tracking-tight">Cohort</span>
      )}
    </div>
  );
}

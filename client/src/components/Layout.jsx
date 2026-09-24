import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Mic,
  Code2,
  BarChart2,
  Target,
  Map,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Users,
  Activity,
} from "lucide-react";

const getNavItems = (role) => {
  // Admins only see administrative governance tools
  if (role === "admin") {
    return [
      { label: "Console Overview",    icon: ShieldCheck, path: "/admin" },
      { label: "Candidates",          icon: Users,       path: "/admin?tab=candidates" },
      { label: "Interview Sessions",  icon: Activity,    path: "/admin?tab=interviews" },
    ];
  }

  // Students see preparation and interview practice tools
  return [
    { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
    { label: "Mock Interview",   icon: Mic,             path: "/mock-interview" },
    { label: "Coding Interview", icon: Code2,           path: "/coding-interview" },
    { label: "Performance",      icon: BarChart2,       path: "/coding-performance" },
    { label: "Skill Gap",        icon: Target,          path: "/skill-gap" },
    { label: "Learning Roadmap", icon: Map,             path: "/learning-roadmap" },
  ];
};

const Layout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname + window.location.search;
  const currentBasePath = window.location.pathname;

  const isAdmin = user?.role === "admin";
  const userRoleLabel = isAdmin ? "Administrator" : (user?.targetRole || "Student");
  const navItems = getNavItems(user?.role);

  const navigateTo = (path) => {
    setMobileMenuOpen(false);
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-neutral-800 font-sans">

      {/* ── MOBILE BACKDROP & DRAWER ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Wordmark & Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-tight text-neutral-900">InterviewPrep</span>
              {isAdmin && (
                <span className="rounded bg-neutral-900 text-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isAdmin ? "Governance Console" : "AI Placement Platform"}
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Section Tag */}
        <div className="px-5 pt-4 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {isAdmin ? "Administration" : "Candidate Modules"}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active =
              currentPath === path ||
              (path === "/admin" && currentBasePath === "/admin" && !window.location.search);

            return (
              <button
                key={path}
                onClick={() => navigateTo(path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-neutral-900 text-white font-medium shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="px-3 pb-4 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13px] font-medium text-neutral-800">{user?.name || "User"}</p>
                {isAdmin && (
                  <span className="rounded bg-neutral-200 text-neutral-800 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0">
                    Admin
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-neutral-400">{userRoleLabel}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <LogOut size={13} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="lg:ml-64">
        {/* Sticky Header with Hamburger */}
        <header className="sticky top-0 z-30 bg-[#f5f5f0]/90 backdrop-blur-md border-b border-neutral-200 px-4 py-3.5 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 lg:hidden shadow-2xs transition-colors shrink-0"
                aria-label="Open navigation menu"
              >
                <Menu size={18} strokeWidth={2} />
              </button>

              <div>
                <h1 className="text-[15px] font-semibold text-neutral-900">{title}</h1>
                {subtitle && <p className="text-[12px] text-neutral-400 mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <p className="text-[13px] font-medium text-neutral-800">{user?.name}</p>
                  {isAdmin && (
                    <span className="rounded bg-neutral-900 text-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400">{userRoleLabel}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold shadow-xs">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

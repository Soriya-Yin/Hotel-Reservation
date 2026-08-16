import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/inbox", label: "Inbox Messages" },
  { to: "/admin/rooms", label: "Room Manager" },
  { to: "/admin/reservations", label: "Reservation" },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream/30">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="LorkKei Logo"
            className="w-7 h-7 object-contain rounded bg-white p-0.5"
          />
          <span className="font-bold text-sm">Admin Portal</span>
        </Link>

        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-cream/10 transition-colors"
          aria-label="Toggle admin menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar (Desktop sticky, Mobile slide-out drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 w-64 bg-navy text-white flex flex-col shrink-0 h-screen transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="px-6 py-5 border-b border-cream/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="LorkKei Logo"
              className="w-8 h-8 object-contain rounded bg-white p-0.5"
            />
            <span className="text-lg font-bold">Admin LOKKEI</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/70 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-chestnut text-white shadow-sm"
                  : "text-sage hover:bg-cream/10 hover:text-white"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10 space-y-2">
          <Link
            to="/"
            className="block text-center text-xs text-sage hover:text-white py-1.5 transition-colors"
          >
            View Main Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-sage/50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <span className="text-xs sm:text-sm text-navy/70 truncate max-w-[200px] sm:max-w-md">
            Logged in as:{" "}
            <span className="font-semibold text-navy">
              {currentUser?.email}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

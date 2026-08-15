import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-cream/30">
      {/* Sidebar */}
      <aside className="w-64 sticky bg-navy text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-cream/10 flex items-center gap-3">
          <img
            src={logo}
            alt="LorkKei Logo"
            className="w-8 h-8 object-contain rounded bg-white p-0.5"
          />
          <h1 className="text-lg font-bold">Admin LOKKEI</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-chestnut text-white"
                    : "text-sage hover:bg-cream/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-sage px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-navy/60">
            Welcome: {" "}
            <span className="font-semibold text-navy">
              {currentUser?.email}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-chestnut hover:bg-chestnut/90 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { currentUser, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navStyle = ({ isActive }) =>
    `transition-colors ${isActive
      ? "text-chestnut underline underline-offset-4"
      : "text-white hover:text-chestnut"
    }`;

  return (
    <header className="bg-navy text-white sticky top-2 z-50 shadow-md rounded-2xl mx-16 mb-4">
      <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-xl font-bold tracking-wide text-white flex items-center gap-2.5"
        >
          <img
            src={logo}
            alt="LorkKei Logo"
            className="w-8 h-8 object-contain rounded-md bg-white p-0.5 shadow-sm"
          />
          <span>LorkKei</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={navStyle}>
            Home
          </NavLink>

          <NavLink to="/contact" className={navStyle}>
            Contact
          </NavLink>



          {/* Shown for regular logged-in users */}
          {currentUser && !isAdmin && (
            <>
              <NavLink to="/my-bookings" className={navStyle}>
                My Booking
              </NavLink>
              <NavLink to="/my-inquiries" className={navStyle}>
                Message
              </NavLink>
            </>
          )}
          <NavLink to="/about" className={navStyle}>
            About Us
          </NavLink>

          {/* Shown only for admins */}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={navStyle}>
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="hidden sm:inline text-xs text-sage">
                Hello, {profile?.firstName || currentUser.email.split("@")[0]}
              </span>

              <button
                onClick={handleLogout}
                className="bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { currentUser, profile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  const navStyle = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-chestnut font-semibold underline underline-offset-4"
        : "text-white/90 hover:text-chestnut"
    }`;

  const mobileNavStyle = ({ isActive }) =>
    `block px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-chestnut text-white font-semibold"
        : "text-white/90 hover:bg-cream/10 hover:text-chestnut"
    }`;

  return (
    <header className="sticky top-2 z-50 mx-3 sm:mx-6 md:mx-10 lg:mx-16 mb-4">
      <div className="bg-navy text-white shadow-lg rounded-2xl border border-sage/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white flex items-center gap-2.5 shrink-0"
          >
            <img
              src={logo}
              alt="LorkKei Logo"
              className="w-8 h-8 object-contain rounded-md bg-white p-0.5 shadow-sm"
            />
            <span>LorkKei</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink to="/" className={navStyle}>
              Home
            </NavLink>

            <NavLink to="/contact" className={navStyle}>
              Contact
            </NavLink>

            {/* Regular logged-in users */}
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

            {/* Admin only */}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navStyle}>
                Admin Portal
              </NavLink>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-xs text-sage truncate max-w-[140px]">
                  Hello, {profile?.firstName || currentUser.email.split("@")[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <span className="text-xs text-sage font-medium truncate max-w-[90px] xs:max-w-[120px]">
                {profile?.firstName || currentUser.email.split("@")[0]}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="p-1.5 text-white/90 hover:text-white rounded-lg hover:bg-cream/10 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-sage/20 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavStyle}
            >
              Home
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavStyle}
            >
              Contact
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavStyle}
            >
              About Us
            </NavLink>

            {currentUser && !isAdmin && (
              <>
                <NavLink
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavStyle}
                >
                  My Booking
                </NavLink>
                <NavLink
                  to="/my-inquiries"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavStyle}
                >
                  Message
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavStyle}
              >
                Admin Portal
              </NavLink>
            )}

            <div className="pt-3 mt-2 border-t border-sage/20">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold py-2 rounded-lg transition-colors text-center"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold py-2 rounded-lg transition-colors text-center"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-navy text-sage mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 grid gap-6 md:grid-cols-3">
        {/* Hotel */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={logo}
              alt="LorkKei Logo"
              className="w-12 h-12 object-contain rounded bg-white p-0.5"
            />
            <h3 className="font-serif text-lg font-bold text-white">
              LorkKei Hotel
            </h3>
          </div>

          <p className="text-xs text-sage/70 leading-5 max-w-xs">
            Warm hospitality, comfortable stays, and memorable experiences in
            Cambodia.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Quick Links</h4>

          <div className="flex flex-col gap-1 text-xs">
            <Link to="/" className="hover:text-chestnut transition-colors">
              Home
            </Link>

            <Link to="/about" className="hover:text-chestnut transition-colors">
              About Us
            </Link>

            <Link
              to="/contact"
              className="hover:text-chestnut transition-colors"
            >
              Contact Us
            </Link>

            <Link to="/login" className="hover:text-chestnut transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Location</h4>

          <a
            href="https://maps.google.com/?q=123+Riverside+Road,+Siem+Reap,+Cambodia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sage/70 leading-5 hover:text-white transition-colors block group"
            title="Open in Google Maps"
          >
            <p className="group-hover:underline">
              123 Riverside Road
              <br />
              Siem Reap, Cambodia
            </p>

          </a>

          <p className="text-xs text-sage/70 mt-2">
            <a
              href="mailto:reservations@lorkkei.com"
              className="hover:text-chestnut transition-colors"
            >
              reservations@lorkkei.com
            </a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-sage/20 py-3 text-center text-[11px] text-sage/50">
        © {new Date().getFullYear()} LorkKei Hotel. All rights reserved.
      </div>
    </footer>
  );
}

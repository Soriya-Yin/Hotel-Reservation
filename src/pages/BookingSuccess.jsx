import { useLocation, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-navy text-white rounded-xl p-6 sm:p-8 text-center mb-6 sm:mb-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 font-serif">
            Thank you for choosing LorkKei Hotel!
          </h1>
          <p className="text-sage text-sm sm:text-base">We are delighted to guest you.</p>
        </div>

        <div className="bg-white border border-sage rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-sage pb-4 mb-4">
            <span className="text-sm text-navy/60">Booking Reference</span>
            <span className=" text-xl font-bold text-chestnut">
              {booking.refCode}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-navy/60">Guest Name</dt>
            <dd className="text-navy font-medium text-right">
              {booking.firstName} {booking.lastName}
            </dd>

            <dt className="text-navy/60">Phone</dt>
            <dd className="text-navy font-medium text-right">
              {booking.phone}
            </dd>

            <dt className="text-navy/60">Email</dt>
            <dd className="text-navy font-medium text-right">
              {booking.email}
            </dd>

            <dt className="text-navy/60">ID / Passport</dt>
            <dd className="text-navy font-medium text-right">
              {booking.identityNumber}
            </dd>

            <dt className="text-navy/60">Room Type</dt>
            <dd className="text-navy font-medium text-right">
              {booking.roomType}
            </dd>

            <dt className="text-navy/60">Check-in</dt>
            <dd className="text-navy font-medium text-right">
              {booking.checkIn}
            </dd>

            <dt className="text-navy/60">Check-out</dt>
            <dd className="text-navy font-medium text-right">
              {booking.checkOut}
            </dd>

            <dt className="text-navy/60">Duration</dt>
            <dd className="text-navy font-medium text-right">
              {booking.nights} night{booking.nights > 1 ? "s" : ""}
            </dd>

            <dt className="text-navy/60 font-semibold">Total Cost</dt>
            <dd className="text-chestnut font-bold text-right text-lg">
              ${booking.totalCost}
            </dd>
          </dl>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/my-bookings"
            className="w-full sm:w-auto bg-chestnut hover:bg-chestnut/90 text-white font-semibold px-6 py-2.5 rounded-lg transition text-center text-sm shadow-sm"
          >
            View in My Bookings
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto border border-sage hover:bg-cream/40 text-navy font-semibold px-6 py-2.5 rounded-lg transition text-center text-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

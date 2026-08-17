import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const userEmail = (currentUser.email || "").trim().toLowerCase();
    const userId = currentUser.uid;

    let q;
    try {
      if (userEmail && userId) {
        q = query(
          collection(db, "reservations"),
          or(where("userId", "==", userId), where("email", "==", userEmail))
        );
      } else if (userId) {
        q = query(collection(db, "reservations"), where("userId", "==", userId));
      } else {
        q = query(collection(db, "reservations"), where("email", "==", userEmail));
      }
    } catch {
      q = query(collection(db, "reservations"), where("email", "==", userEmail));
    }

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          // Sort by creation time or checkIn date descending
          .sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.checkIn || 0).getTime();
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.checkIn || 0).getTime();
            return timeB - timeA;
          });

        setBookings(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Bookings Listener Error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return b.status === "booked" || b.status === "checked-in";
    if (filter === "completed") return b.status === "checked-out";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "booked":
        return {
          label: "Confirmed (Pending Check-in)",
          className: "bg-amber-100 text-amber-800 border-amber-300",
        };
      case "checked-in":
        return {
          label: "Checked In (Active Stay)",
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "checked-out":
        return {
          label: "Completed",
          className: "bg-gray-100 text-gray-700 border-gray-300",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          label: status || "Booked",
          className: "bg-cream text-navy border-sage",
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy">My Booking History</h1>
            <p className="text-navy/60 text-xs sm:text-sm mt-1">
              View your reservations, reference codes, and check-in details.
            </p>
          </div>

          <Link
            to="/"
            className="self-start md:self-auto bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            Book Another Room
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {[
            { key: "all", label: `All (${bookings.length})` },
            {
              key: "upcoming",
              label: `Active & Upcoming (${bookings.filter((b) => b.status === "booked" || b.status === "checked-in").length
                })`,
            },
            {
              key: "completed",
              label: `Completed (${bookings.filter((b) => b.status === "checked-out").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${filter === tab.key
                ? "bg-navy text-white shadow-sm"
                : "bg-white border border-sage/40 text-navy hover:bg-cream/40"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6">
            Error loading your bookings: {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16 text-navy/50">
            <p className="text-sm">Loading your booking history...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-sage/40 rounded-2xl p-16 text-center shadow-sm max-w-5xl mx-auto">

            <h3 className="text-lg font-bold text-navy mb-1">No reservations found</h3>
            <p className="text-navy/60 text-sm mb-6">
              {filter === "all"
                ? "You haven't made any room reservations with us yet."
                : `You don't have any ${filter} bookings at the moment.`}
            </p>
            <Link
              to="/"
              className="inline-block bg-chestnut hover:bg-chestnut/90 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Browse Available Rooms
            </Link>
          </div>
        ) : (
          /* Booking Cards List */
          <div className="space-y-6">
            {filteredBookings.map((b) => {
              const statusInfo = getStatusBadge(b.status);

              return (
                <div
                  key={b.id}
                  className="bg-white border border-sage/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Top Bar: Room Type, Status, Ref Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sage/20 pb-4 mb-4 gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-bold text-navy">
                          {b.roomType || "Hotel Room"}
                        </h2>
                        {b.roomNumber && (
                          <span className="text-xs bg-navy/10 text-navy font-semibold px-2 py-0.5 rounded">
                            Room {b.roomNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-navy/50 block mt-0.5">
                        Booking Ref:{" "}
                        <span className="font-mono font-bold text-chestnut">
                          {b.refCode || b.id}
                        </span>
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Grid Information */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-cream/20 p-4 rounded-xl mb-4 text-navy">
                    <div>
                      <span className="text-navy/50 block font-medium">Check-In</span>
                      <span className="font-bold text-sm text-navy">{b.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-navy/50 block font-medium">Check-Out</span>
                      <span className="font-bold text-sm text-navy">{b.checkOut}</span>
                    </div>
                    <div>
                      <span className="text-navy/50 block font-medium">Duration</span>
                      <span className="font-semibold text-sm">
                        {b.nights} night{b.nights > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-navy/50 block font-medium">Total Paid / Due</span>
                      <span className="font-bold text-base text-chestnut">
                        ${b.totalCost}
                      </span>
                    </div>
                  </div>

                  {/* Guest & Contact Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-navy/70 border-t border-sage/20 pt-3 gap-2">
                    <div>
                      <span className="font-medium text-navy">Guest:</span> {b.firstName} {b.lastName} &bull;{" "}
                      <span className="font-medium text-navy">Phone:</span> {b.phone}
                    </div>

                    <div className="text-[11px] text-navy/50 italic">
                      {b.status === "booked" && "Present your Ref Code at front desk upon check-in"}
                      {b.status === "checked-in" && "Enjoy your stay at LorkKei Hotel!"}
                      {b.status === "checked-out" && "Thank you for staying with us."}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

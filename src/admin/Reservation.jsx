import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRes, setSelectedRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "reservations"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = reservations.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.refCode?.toLowerCase().includes(term) ||
      r.firstName?.toLowerCase().includes(term) ||
      r.lastName?.toLowerCase().includes(term) ||
      r.phone?.includes(term) ||
      r.identityNumber?.toLowerCase().includes(term) ||
      String(r.roomNumber)?.includes(term);

    const matchesStatus =
      statusFilter === "all" ||
      r.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Updates both the Reservation AND the Physical Room document simultaneously
  const handleUpdateStatus = async (reservation, newStatus) => {
    setActionLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. Update the reservation status
      const resRef = doc(db, "reservations", reservation.id);
      const updateData = { status: newStatus };

      if (newStatus === "checked-in") {
        updateData.actualCheckInAt = serverTimestamp();
      } else if (newStatus === "checked-out") {
        updateData.actualCheckOutAt = serverTimestamp();
      }

      batch.update(resRef, updateData);

      // 2. Update the corresponding physical room inventory status
      if (reservation.roomId) {
        const roomRef = doc(db, "rooms", reservation.roomId);
        let roomStatus = "Available";

        if (newStatus === "booked") roomStatus = "Reserved";
        if (newStatus === "checked-in") roomStatus = "Occupied";
        if (newStatus === "checked-out") roomStatus = "Available";

        batch.update(roomRef, { status: roomStatus });
      }

      await batch.commit();

      if (selectedRes && selectedRes.id === reservation.id) {
        setSelectedRes({ ...selectedRes, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "booked":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "checked-in":
        return "bg-green-100 text-green-800 border-green-300";
      case "checked-out":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-cream text-navy border-sage";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Guest Reservations</h1>
        <p className="text-navy/60 text-xs sm:text-sm mt-1">
          Look up arrivals, verify guest ID/Passport, and confirm check-ins &
          check-outs.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-sage/30 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by Ref Code, Name, Phone, or Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-sage rounded-lg px-3.5 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-sage rounded-lg px-3.5 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-chestnut cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked (Pending Check-In)</option>
            <option value="checked-in">Checked In (Active)</option>
            <option value="checked-out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl border border-sage/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/40 border-b border-sage/30 text-xs font-semibold text-navy uppercase tracking-wider">
                <th className="py-3.5 px-4">Ref Code</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/20 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-navy/50">
                    Loading reservations...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-navy/50">
                    No reservations found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-cream/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-chestnut">
                      {res.refCode || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-navy">
                        {res.firstName} {res.lastName}
                      </div>
                      <div className="text-xs text-navy/50">{res.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-navy">
                      {res.roomNumber ? `Room ${res.roomNumber}` : "Unassigned"}
                      <span className="block text-xs text-navy/50">
                        {res.roomType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-navy">
                      <div>In: {res.checkIn}</div>
                      <div>
                        Out: {res.checkOut} ({res.nights}n)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy">
                      ${res.totalCost}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusBadge(
                          res.status,
                        )}`}
                      >
                        {res.status === "booked"
                          ? "Booked"
                          : res.status?.replace("-", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRes(res)}
                        className="bg-navy hover:bg-navy/90 text-white text-xs px-3 py-1.5 rounded transition cursor-pointer font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Verification & Check-in Modal */}
      {selectedRes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-sage animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-sage/30 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-chestnut uppercase tracking-wide">
                  {selectedRes.refCode}
                </span>
                <h2 className="text-xl font-bold text-navy">
                  {selectedRes.firstName} {selectedRes.lastName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="text-navy/40 hover:text-navy text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-cream/30 p-4 rounded-xl">
              <div>
                <span className="text-xs text-navy/60 block">
                  Passport / ID
                </span>
                <span className="font-semibold text-navy">
                  {selectedRes.identityNumber || "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-xs text-navy/60 block">Phone</span>
                <span className="font-semibold text-navy">
                  {selectedRes.phone}
                </span>
              </div>
              <div>
                <span className="text-xs text-navy/60 block">Email</span>
                <span className="font-semibold text-navy">
                  {selectedRes.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-navy/60 block">Gender</span>
                <span className="font-semibold text-navy">
                  {selectedRes.gender}
                </span>
              </div>
              <div>
                <span className="text-xs text-navy/60 block">
                  Assigned Room
                </span>
                <span className="font-semibold text-chestnut text-base">
                  Room {selectedRes.roomNumber} ({selectedRes.roomType})
                </span>
              </div>
              <div>
                <span className="text-xs text-navy/60 block">Total Cost</span>
                <span className="font-bold text-navy text-base">
                  ${selectedRes.totalCost} ({selectedRes.nights} nights)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {/* Action 1: If Booked/Pending -> Confirm Check-in */}
              {selectedRes.status === "booked" && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedRes, "checked-in")}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Confirm Check-In & Hand Keys"}
                </button>
              )}

              {/* Action 2: If Checked In -> Check Out */}
              {selectedRes.status === "checked-in" && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedRes, "checked-out")}
                  className="w-full bg-chestnut hover:bg-chestnut/90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
                >
                  {actionLoading
                    ? "Updating..."
                    : "Check Out Guest & Release Room"}
                </button>
              )}

              {/* Action 3: Already Completed */}
              {selectedRes.status === "checked-out" && (
                <div className="text-center py-2 text-sm text-gray-500 font-medium bg-gray-100 rounded-lg">
                  Guest has checked out. Room is marked Available.
                </div>
              )}

              <button
                onClick={() => setSelectedRes(null)}
                className="w-full border border-sage text-navy font-semibold py-2 rounded-lg hover:bg-cream/40 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

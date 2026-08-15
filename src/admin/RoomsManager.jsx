import { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { ROOM_TYPES } from "../data/roomTypes";
import { generateRefCode, nightsBetween } from "../utils/helpers";

const STATUS_STYLES = {
  Available: "bg-green-100 text-green-700 border-green-300",
  Occupied: "bg-red-100 text-chestnut border-chestnut/40",
  Maintenance: "bg-yellow-100 text-navy border-sage",
};

export default function RoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walkInRoom, setWalkInRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);

  // Filter States
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "rooms"));
    setRooms(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber)),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRoomStatus = async (roomId, status) => {
    await updateDoc(doc(db, "rooms", roomId), { status });
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, status } : r)));
  };

  // Filter Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesType =
        selectedType === "ALL" ||
        room.roomTypeId === selectedType ||
        room.type === selectedType;

      const matchesStatus =
        selectedStatus === "ALL" || room.status === selectedStatus;

      return matchesType && matchesStatus;
    });
  }, [rooms, selectedType, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Room Manager</h1>
          <p className="text-xs text-navy/60 mt-1">
            Showing{" "}
            <span className="font-semibold text-navy">
              {filteredRooms.length}
            </span>{" "}
            of <span className="font-semibold text-navy">{rooms.length}</span>{" "}
            rooms
          </p>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3">
          {/* Room Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-sage rounded-lg px-3 py-2 text-xs text-navy bg-white focus:outline-none focus:ring-1 focus:ring-chestnut cursor-pointer shadow-sm"
          >
            <option value="ALL">All Room Types</option>
            {ROOM_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-sage rounded-lg px-3 py-2 text-xs text-navy bg-white focus:outline-none focus:ring-1 focus:ring-chestnut cursor-pointer shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          {/* Reset button if filtered */}
          {(selectedType !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSelectedType("ALL");
                setSelectedStatus("ALL");
              }}
              className="text-xs text-chestnut font-semibold hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-navy/50 text-sm mt-6 text-center py-10">
          Loading rooms...
        </p>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-sage/60 rounded-xl">
          <p className="text-navy/60 text-sm font-medium">
            No rooms found for this category.
          </p>
          <button
            onClick={() => {
              setSelectedType("ALL");
              setSelectedStatus("ALL");
            }}
            className="mt-2 text-xs text-chestnut font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-xl p-4 bg-white border-sage shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-bold text-navy">
                  Room {room.roomNumber}
                </p>
                <p className="text-xs text-navy/60 mb-2 truncate">
                  {room.type}
                </p>
                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${
                    STATUS_STYLES[room.status] || ""
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-1.5 text-xs">
                {room.status === "Available" && (
                  <button
                    onClick={() => setWalkInRoom(room)}
                    className="text-chestnut font-semibold hover:underline text-left cursor-pointer"
                  >
                    Walk-In Booking
                  </button>
                )}
                {room.status === "Occupied" && (
                  <button
                    onClick={() => setEditRoom(room)}
                    className="text-navy font-semibold hover:underline text-left cursor-pointer"
                  >
                    Edit Stay
                  </button>
                )}
                <select
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                  className="border border-sage rounded-md px-2 py-1 text-navy bg-white focus:outline-none focus:ring-1 focus:ring-chestnut cursor-pointer"
                >
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Walk-In Modal */}
      {walkInRoom && (
        <WalkInModal
          room={walkInRoom}
          onClose={() => setWalkInRoom(null)}
          onBooked={load}
        />
      )}

      {/* Edit Stay Modal */}
      {editRoom && (
        <EditStayModal
          room={editRoom}
          onClose={() => setEditRoom(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function WalkInModal({ room, onClose, onBooked }) {
  const roomType = ROOM_TYPES.find((rt) => rt.id === room.roomTypeId);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    identityNumber: "",
    checkIn: "",
    checkOut: "",
  });
  const [saving, setSaving] = useState(false);
  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const totalCost = nights * (roomType?.price || room.price || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const refCode = generateRefCode();
      await addDoc(collection(db, "reservations"), {
        refCode,
        userId: null,
        roomTypeId: room.roomTypeId,
        roomNumber: room.roomNumber,
        ...form,
        roomType: roomType?.name || room.type,
        pricePerNight: roomType?.price || room.price || 0,
        nights,
        totalCost,
        status: "checked-in",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "rooms", room.id), { status: "Occupied" });
      onBooked();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save walk-in booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy">
            Walk-In: Room {room.roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-navy/50 hover:text-navy cursor-pointer"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="First Name"
              value={form.firstName}
              onChange={update("firstName")}
              className="border border-sage rounded-md px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Last Name"
              value={form.lastName}
              onChange={update("lastName")}
              className="border border-sage rounded-md px-3 py-2 text-sm"
            />
            <select
              required
              value={form.gender}
              onChange={update("gender")}
              className="border border-sage rounded-md px-3 py-2 text-sm"
            >
              <option value="">Gender...</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              required
              placeholder="Phone"
              value={form.phone}
              onChange={update("phone")}
              className="border border-sage rounded-md px-3 py-2 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
              className="border border-sage rounded-md px-3 py-2 text-sm col-span-2"
            />
            <input
              required
              placeholder="ID / Passport Number"
              value={form.identityNumber}
              onChange={update("identityNumber")}
              className="border border-sage rounded-md px-3 py-2 text-sm col-span-2"
            />
            <div>
              <label className="text-xs text-navy/60">Check-in</label>
              <input
                required
                type="date"
                value={form.checkIn}
                onChange={update("checkIn")}
                className="w-full border border-sage rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-navy/60">Check-out</label>
              <input
                required
                type="date"
                value={form.checkOut}
                onChange={update("checkOut")}
                className="w-full border border-sage rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          {nights > 0 && (
            <p className="text-sm text-navy">
              {nights} nights ·{" "}
              <span className="font-bold text-chestnut">${totalCost}</span>
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-chestnut text-white font-semibold py-2.5 rounded-md disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Booking..." : "Confirm Walk-In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditStayModal({ room, onClose, onSaved }) {
  const [reservation, setReservation] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "reservations"),
        where("roomNumber", "==", room.roomNumber),
        where("status", "==", "checked-in"),
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const r = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setReservation(r);
        setCheckIn(r.checkIn);
        setCheckOut(r.checkOut);
      }
      setLoading(false);
    };
    load();
  }, [room]);

  const handleSave = async () => {
    if (!reservation) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "reservations", reservation.id), {
        checkIn,
        checkOut,
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update stay.");
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async () => {
    await updateDoc(doc(db, "rooms", room.id), { status: "Available" });
    if (reservation) {
      await updateDoc(doc(db, "reservations", reservation.id), {
        status: "checked-out",
      });
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-navy/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy">
            Edit Stay: Room {room.roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-navy/50 hover:text-navy cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-navy/60 text-sm">Loading reservation...</p>
        ) : reservation ? (
          <div className="space-y-3">
            <p className="text-sm text-navy">
              {reservation.firstName} {reservation.lastName}
            </p>
            <div>
              <label className="text-xs text-navy/60">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-sage rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-navy/60">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-sage rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-chestnut text-white font-semibold py-2.5 rounded-md text-sm disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-navy text-white font-semibold py-2.5 rounded-md text-sm cursor-pointer"
              >
                Check Out
              </button>
            </div>
          </div>
        ) : (
          <p className="text-navy/60 text-sm">
            No active reservation found for this room.
          </p>
        )}
      </div>
    </div>
  );
}

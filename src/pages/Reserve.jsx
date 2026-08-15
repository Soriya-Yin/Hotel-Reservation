import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { ROOM_TYPES } from "../data/roomTypes";
import { generateRefCode, nightsBetween } from "../utils/helpers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Reserve() {
  const { roomTypeId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();

  const roomType = ROOM_TYPES.find((rt) => rt.id === roomTypeId);

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
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill profile info if logged in
  useEffect(() => {
    if (currentUser) {
      setForm((f) => ({
        ...f,
        firstName: profile?.firstName || f.firstName,
        lastName: profile?.lastName || f.lastName,
        email: currentUser.email || f.email,
        phone: profile?.phone || f.phone,
      }));
    }
  }, [currentUser, profile]);

  if (!roomType) {
    return (
      <div className="min-h-screen flex flex-col bg-cream/30">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-navy font-semibold text-lg">
            Room type not found.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = nightsBetween(form.checkIn, form.checkOut) || 0;
  const totalCost = nights > 0 ? nights * roomType.price : 0;
  const today = new Date().toISOString().split("T")[0];

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.checkIn || !form.checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (nights <= 0) {
      setError("Please select a valid date range of at least 1 night.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Find an available physical room for this room type
      const roomsRef = collection(db, "rooms");
      const q = query(
        roomsRef,
        where("roomTypeId", "==", roomTypeId),
        where("status", "==", "Available"),
      );
      const roomSnap = await getDocs(q);

      if (roomSnap.empty) {
        setError(
          "Sorry, all rooms in this category are currently booked or unavailable.",
        );
        setSubmitting(false);
        return;
      }

      // Pick the first available room
      const assignedRoomDoc = roomSnap.docs[0];
      const assignedRoomId = assignedRoomDoc.id;
      const assignedRoomNumber = assignedRoomDoc.data().roomNumber;
      const refCode = generateRefCode();

      // Reservation payload marked as 'booked' (pending check-in)
      const reservationData = {
        refCode,
        userId: currentUser?.uid || null,
        roomId: assignedRoomId,
        roomTypeId,
        roomNumber: assignedRoomNumber,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        phone: form.phone.trim(),
        email: (form.email || "").trim().toLowerCase(),
        identityNumber: form.identityNumber.trim(),
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomType: roomType.name,
        pricePerNight: roomType.price,
        nights,
        totalCost,
        status: "booked", // Initial lifecycle state
      };

      // 2. Atomic Transaction: Claim room and create reservation record
      await runTransaction(db, async (transaction) => {
        const roomRef = doc(db, "rooms", assignedRoomId);
        const freshRoomDoc = await transaction.get(roomRef);

        if (
          !freshRoomDoc.exists() ||
          freshRoomDoc.data().status !== "Available"
        ) {
          throw new Error(
            "This room was just booked by someone else. Please try again.",
          );
        }

        // Save reservation record
        const newReservationRef = doc(collection(db, "reservations"));
        transaction.set(newReservationRef, {
          ...reservationData,
          createdAt: serverTimestamp(),
        });

        // Mark room as Reserved
        transaction.update(roomRef, {
          status: "Reserved",
        });
      });

      // 3. Navigate to confirmation screen
      navigate("/booking-success", {
        state: {
          ...reservationData,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Booking error details:", err);
      setError(
        err.message ||
          "Something went wrong while saving your reservation. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {/* Header summary */}
        <div className="bg-navy text-white rounded-xl p-6 mb-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">Reserve: {roomType.name}</h1>
          <p className="text-sage text-sm">
            ${roomType.price}/night · Up to {roomType.maxGuests} guests ·{" "}
            {roomType.condition}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Reservation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-sage rounded-xl p-6 space-y-4 shadow-sm"
        >
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                First Name
              </label>
              <input
                required
                type="text"
                value={form.firstName}
                onChange={update("firstName")}
                className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Last Name
              </label>
              <input
                required
                type="text"
                value={form.lastName}
                onChange={update("lastName")}
                className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
              />
            </div>
          </div>

          {/* Row 2: Gender */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Gender
            </label>
            <select
              required
              value={form.gender}
              onChange={update("gender")}
              className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Row 3: Phone */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
            />
          </div>

          {/* Row 4: Email */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
            />
          </div>

          {/* Row 5: Identification */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Passport / ID Number
            </label>
            <input
              required
              type="text"
              value={form.identityNumber}
              onChange={update("identityNumber")}
              className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
            />
          </div>

          {/* Row 6: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Check-in Date
              </label>
              <input
                required
                type="date"
                min={today}
                value={form.checkIn}
                onChange={update("checkIn")}
                className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Check-out Date
              </label>
              <input
                required
                type="date"
                min={form.checkIn || today}
                value={form.checkOut}
                onChange={update("checkOut")}
                className="w-full border border-sage rounded-md px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-chestnut"
              />
            </div>
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="bg-cream/60 border border-sage rounded-md px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-navy">
                {nights} night{nights > 1 ? "s" : ""} × ${roomType.price}
              </span>
              <span className="font-bold text-chestnut text-lg">
                ${totalCost}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-chestnut hover:bg-chestnut/90 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Processing Reservation..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

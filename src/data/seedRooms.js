import {
  collection,
  doc,
  writeBatch,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ROOM_TYPES } from "./roomTypes";

export const ROOM_DISTRIBUTION = [
  { typeId: "deluxe-single", count: 8, startNumber: 101 }, // Rooms 101-108
  { typeId: "executive-twin", count: 8, startNumber: 201 }, // Rooms 201-208
  { typeId: "family-suite", count: 6, startNumber: 301 }, // Rooms 301-306
  { typeId: "garden-double", count: 6, startNumber: 401 }, // Rooms 401-406
  { typeId: "honeymoon-suite", count: 6, startNumber: 501 }, // Rooms 501-506
  { typeId: "backpacker-single", count: 6, startNumber: 601 }, // Rooms 601-606
];

export async function seedRooms() {
  // 1. Delete all existing rooms in Firestore
  const existingSnapshot = await getDocs(collection(db, "rooms"));
  const deletePromises = existingSnapshot.docs.map((roomDoc) =>
    deleteDoc(roomDoc.ref),
  );
  await Promise.all(deletePromises);

  // 2. Batch insert the new rooms
  const batch = writeBatch(db);

  ROOM_DISTRIBUTION.forEach(({ typeId, count, startNumber }) => {
    const roomType = ROOM_TYPES.find((rt) => rt.id === typeId);
    if (!roomType) return;

    for (let i = 0; i < count; i++) {
      const roomNumber = startNumber + i;
      const ref = doc(collection(db, "rooms"));
      batch.set(ref, {
        roomNumber,
        roomTypeId: typeId,
        type: roomType.name,
        maxGuests: roomType.maxGuests,
        condition: roomType.condition,
        price: roomType.price,
        status: "Available",
      });
    }
  });

  await batch.commit();
  console.log("All rooms successfully cleared and re-seeded!");
}

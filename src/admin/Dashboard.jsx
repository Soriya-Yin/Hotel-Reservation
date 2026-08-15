import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { ROOM_TYPES } from "../data/roomTypes";
import { IoBed } from "react-icons/io5";
import {
  MdEventAvailable,
  MdSensorOccupied,
  MdCleaningServices,
} from "react-icons/md";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const roomsSnap = await getDocs(collection(db, "rooms"));

        setRooms(
          roomsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );
      } catch (e) {
        console.error("Error loading dashboard:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ========================= */
  /* Room Statistics           */
  /* ========================= */

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "Available").length;
  const occupiedRooms = rooms.filter((r) => r.status === "Occupied").length;
  const maintenanceRooms = rooms.filter(
    (r) => r.status === "Maintenance",
  ).length;

  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  /* ========================= */
  /* Room Type Breakdown       */
  /* ========================= */

  const breakdown = ROOM_TYPES.map((rt) => {
    const typeRooms = rooms.filter((r) => r.roomTypeId === rt.id);
    const occupied = typeRooms.filter((r) => r.status === "Occupied").length;

    return {
      ...rt,
      capacity: typeRooms.length,
      occupied,
      available: typeRooms.length - occupied,
    };
  });

  /* ========================= */
  /* Loading State             */
  /* ========================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-sm text-navy/60">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-chestnut font-semibold mb-1">
          Hotel Management
        </p>
        <h1 className="text-3xl font-bold text-navy">Dashboard Overview</h1>
        <p className="text-sm text-navy/50 mt-1">
          Monitor your rooms, occupancy, and hotel performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatusCard
          title="Total Rooms"
          value={totalRooms}
          description="Registered rooms"
          icon={<IoBed />}
        />

        <StatusCard
          title="Available"
          value={availableRooms}
          description="Ready for guests"
          icon={<MdEventAvailable />}
        />

        <StatusCard
          title="Occupied"
          value={occupiedRooms}
          description="Currently checked in"
          icon={<MdSensorOccupied />}
        />

        {/* 🔄 Changed to Preparation / Maintenance Card */}
        <StatusCard
          title="In Preparation"
          value={maintenanceRooms}
          description="Cleaning & maintenance"
          icon={<MdCleaningServices />}
        />
      </div>

      {/* Occupancy Overview */}
      <div className="bg-white border border-sage/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-navy">Occupancy Overview</h2>
            <p className="text-xs text-navy/50 mt-1">Current room occupancy</p>
          </div>

          <span className="text-sm font-semibold text-green-600">
            {occupancyRate}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-sage/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-500"
            style={{
              width: `${occupancyRate}%`,
            }}
          />
        </div>

        <div className="flex justify-between mt-4 text-xs">
          <span className="text-navy/50">{occupiedRooms} occupied</span>
          <span className="text-navy/50">{availableRooms} available</span>
        </div>
      </div>

      {/* Room Categories Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-navy">Room Categories</h2>
          <p className="text-xs text-navy/50 mt-1">
            Room availability by category
          </p>
        </div>

        <div className="bg-white border border-sage/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">
                    Room Type
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">Total</th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Occupied
                  </th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Available
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">
                    Occupancy
                  </th>
                </tr>
              </thead>

              <tbody>
                {breakdown.map((rt) => {
                  const rate =
                    rt.capacity > 0
                      ? Math.round((rt.occupied / rt.capacity) * 100)
                      : 0;

                  return (
                    <tr
                      key={rt.id}
                      className="border-t border-sage/30 hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy">{rt.name}</p>
                        {rt.description && (
                          <p className="text-xs text-navy/40 mt-1">
                            {rt.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center text-navy font-medium">
                        {rt.capacity}
                      </td>

                      <td className="px-5 py-4 text-center text-red-600 font-medium">
                        {rt.occupied}
                      </td>

                      <td className="px-5 py-4 text-center font-semibold text-green-600">
                        {rt.available}
                      </td>

                      <td className="px-5 py-4 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-sage/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-600 w-8 font-medium">
                            {rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-navy/50">No rooms found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Dashboard Status Card */
function StatusCard({ title, value, description, icon }) {
  return (
    <div className="bg-white border border-sage/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
            {title}
          </p>
          <p className="text-2xl font-semibold text-navy mt-3">{value}</p>
          <p className="text-xs text-navy/40 mt-1">{description}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-chestnut text-xl font-bold">
          {icon}
        </div>
      </div>
    </div>
  );
}

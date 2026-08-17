import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/AuthModal";

// Public & Customer Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reserve from "./pages/Reserve";
import BookingSuccess from "./pages/BookingSuccess";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MyInquiries from "./pages/MyInquiries";
import MyBookings from "./pages/MyBookings";

// Admin Pages & Layout
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Reservation from "./admin/Reservation";
import RoomsManager from "./admin/RoomsManager";
import Inbox from "./admin/Inbox";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModal />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Protected Customer Routes */}
          <Route
            path="/reserve/:roomTypeId"
            element={
              <ProtectedRoute>
                <Reserve />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-inquiries"
            element={
              <ProtectedRoute>
                <MyInquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservations" element={<Reservation />} />
            <Route path="rooms" element={<RoomsManager />} />
            <Route path="inbox" element={<Inbox />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

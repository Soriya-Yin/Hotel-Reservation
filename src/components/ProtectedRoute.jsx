import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin, loading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      openAuthModal("login", location.pathname);
    }
  }, [loading, currentUser, openAuthModal, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/20 text-navy font-medium">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}


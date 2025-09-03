import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. While we're checking for a user token, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // 2. If loading is done and there's no user, redirect to the login page
  if (!user) {
    // We can pass the original location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If a user exists, render the child component
  return <>{children}</>;
};

export default ProtectedRoute;
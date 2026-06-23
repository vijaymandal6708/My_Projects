import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRole }) => {
  // Access both the user data and the role from the auth slice
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If a specific role is required, check the role property
  if (allowedRole && role !== allowedRole) {
    // Redirect to home or a custom access-denied page
    return <Navigate to="/" replace />;
  }

  // 3. Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;
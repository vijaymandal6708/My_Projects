import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [roleMatch, setRoleMatch] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        // CALL YOUR BACKEND TO VERIFY TOKEN
        const res = await axios.get("http://localhost:8000/user/fetch-user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAuthorized(true);
        if (!allowedRole || res.data.role === allowedRole) {
          setRoleMatch(true);
        }
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [allowedRole]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;
  if (!roleMatch) return <Navigate to="/access-denied" replace />;

  return children;
};


export default ProtectedRoute;
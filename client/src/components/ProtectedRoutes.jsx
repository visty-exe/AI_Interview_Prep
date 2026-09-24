import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({ children, allowAdmin = false }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admins do not take student interviews or practice modules; redirect to admin console
  if (user?.role === "admin" && !allowAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoutes;

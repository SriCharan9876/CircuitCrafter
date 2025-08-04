import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";

export const PrivateRoute = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) notify.warning("Login required to access this feature");
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};

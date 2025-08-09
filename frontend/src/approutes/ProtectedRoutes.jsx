import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";

export const PrivateRoute = () => {
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    if (!loadingUser &&!user) notify.warning("Login required to access this feature");
  }, [loadingUser,user]);

  if (loadingUser) return null;

  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};

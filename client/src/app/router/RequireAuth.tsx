import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import type{ JSX } from "react";

interface RequireAuthProps {
  children?: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const currentUser = useAppSelector((state) => state.account.user);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return children ? children : <Outlet />;
};

export default RequireAuth;

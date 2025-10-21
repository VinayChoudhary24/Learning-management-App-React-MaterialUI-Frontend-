import React, { type ReactNode } from "react";
import { useAppSelector } from "../../store/hooks/react-redux/hook";
import { selectIsUserLoggedIn } from "../../store/auth/authSlice/authSlice";
import { Navigate } from "react-router-dom";
import { clearAuth } from "../../store/auth/service/localStorage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
  // const dispatch = useAppDispatch();
  if (!isUserLoggedIn) {
    clearAuth();
    return <Navigate to="/login" replace />;
    // dispatch(logoutAsync());
  }
  return <>{children}</>;
};

export default ProtectedRoute;

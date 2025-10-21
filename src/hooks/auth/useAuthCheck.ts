import { useEffect, useRef } from "react";
import { verifyToken } from "../../store/auth/service/authService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import { logoutAsync } from "../../store/auth/authEffects/authEffects";
import { clearAuth } from "../../store/auth/service/localStorage";

export const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const hasChecked = useRef(false); // 🧠 Prevent re-runs

  useEffect(() => {
    const checkAuth = async () => {
      // Avoid multiple executions
      if (hasChecked.current) return;
      hasChecked.current = true;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          clearAuth();
          return;
        }

        const isValid = await verifyToken();

        if (!isValid) {
          console.warn("Invalid token — logging out...");
          await dispatch(logoutAsync());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        await dispatch(logoutAsync());
      }
    };

    checkAuth();
  }, [dispatch]);
};

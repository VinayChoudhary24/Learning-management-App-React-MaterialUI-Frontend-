import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import {
  hideLoader,
  showLoader,
} from "../../store/loader/loaderSlice/loaderSlice";
import { setAuthState } from "../../store/auth/authSlice/authSlice";
import {
  clearAuth,
  saveOAuthToken,
} from "../../store/auth/service/localStorage";
import { getUser } from "../../services/user/userService";

const GoogleAuthResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const authParams = useMemo(
    () => ({
      token: searchParams.get("token"),
      error: searchParams.get("error"),
    }),
    [searchParams]
  );

  useEffect(() => {
    dispatch(showLoader());
    const fetchUser = async () => {
      if (authParams.token) {
        saveOAuthToken(authParams.token);
      }

      if (authParams.error) {
        dispatch(hideLoader());
        // console.error("Google OAuth failed:", authParams.error);
        setErrorMessage("Google login failed. Please try again.");
        return;
      }

      if (!authParams.token && !authParams.error) {
        dispatch(hideLoader());
        setErrorMessage("No token found. Please login again.");
        return;
      }

      try {
        const user = await getUser();
        console.log("user-DATA", user);
        if (user.success) {
          // Store User State and LocalStorage
          dispatch(setAuthState(user.response));
          navigate("/my-courses");
        } else {
          dispatch(hideLoader());
          setErrorMessage("Could not fetch user profile.");
          clearAuth();
        }
      } catch (err) {
        dispatch(hideLoader());
        console.error("Failed to fetch user profile:", err);
        setErrorMessage("Could not fetch user profile.");
        clearAuth();
      }
    };

    fetchUser();
  }, [authParams.error, authParams.token, navigate, dispatch]);

  // Auto navigate after 2s if error occurs
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, navigate]);

  const handleClose = () => {
    setErrorMessage(null);
    navigate("/");
  };

  return (
    <Snackbar
      open={!!errorMessage}
      autoHideDuration={2500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        position: "fixed", // force it to stick to viewport
        top: { xs: 70, sm: 90 }, // adjust spacing from top based on viewport
        zIndex: (theme) => theme.zIndex.snackbar,
      }}
    >
      <Alert
        severity="error"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default GoogleAuthResult;

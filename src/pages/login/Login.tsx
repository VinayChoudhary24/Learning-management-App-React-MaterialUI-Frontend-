import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  ButtonBase,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useForm } from "react-hook-form";

import LoginIllustration from "../../assets/Home/thinking.png";
import GoogleLightIcon from "../../assets/auth/googleLightTheme.svg";
import GoogleDarkIcon from "../../assets/auth/googleDarkTheme.svg";
import {
  loginWithGoogle,
  verifyToken,
} from "../../store/auth/service/authService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import {
  loginWithEmailAsync,
  logoutAsync,
} from "../../store/auth/authEffects/authEffects";
import { showLoader } from "../../store/loader/loaderSlice/loaderSlice";
import { useEffect, useState } from "react";
import { clearAuth } from "../../store/auth/service/localStorage";
import ForgotPasswordModal from "../../components/forgotPasswordModal/ForgotPasswordModal";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const [googleLoginStart, setGoogleLoginStart] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // if no token → redirect immediately
      if (!token) {
        clearAuth();
        return;
      }

      // verify with backend
      const isValid = await verifyToken();

      if (!isValid) {
        dispatch(logoutAsync());
      } else {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: "onChange", // validate as you type
    reValidateMode: "onChange", // revalidate immediately after changes
    criteriaMode: "firstError", // only show first error per field
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    setGoogleLoginStart(true);
    loginWithGoogle();
  };

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Login clicked", data);
    const { email, password } = data;
    const payload = {
      email,
      password,
    };

    const result = await dispatch(loginWithEmailAsync(payload));
    if (loginWithEmailAsync.fulfilled.match(result)) {
      // set all form values to default i.e empty
      console.log("LOGGIN-SUCCESS", result);
      dispatch(showLoader());
      reset();
      navigate("/my-courses");
    } else if (loginWithEmailAsync.rejected.match(result)) {
      console.log("result", result);
      console.log("result.payload", result.payload);
      const message =
        (result.payload as string) ||
        "Login failed. Please check your credentials.";
      setErrorMessage(message);
      // Auto-hide after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleForgotPassword = () => {
    setOpen(true);
  };

  return (
    <Grid container>
      {/* Left side: Illustration (hidden on small screens) */}
      {!isMobile && (
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
            position: "relative",
            p: 4,
          }}
        >
          <Box
            component="img"
            src={LoginIllustration}
            alt="Login Illustration"
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: "500px",
              maxHeight: "70vh",
              objectFit: "contain",
              filter:
                theme.palette.mode === "dark" ? "brightness(0.9)" : "none",
            }}
          />
        </Grid>
      )}

      {/* Right side: centered Paper with transparent look + border */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            width: "100%",
            maxWidth: 480,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              backgroundColor: "transparent",
              border: `1px solid ${theme.palette.divider}`,
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                boxShadow: theme.shadows[3],
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              align="center"
              gutterBottom
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              mb={3}
            >
              Login to continue your learning journey
            </Typography>

            {/* Google Sign-in Button (accessible) */}
            <ButtonBase
              onClick={handleGoogleLogin}
              disabled={googleLoginStart}
              role="button"
              sx={{
                width: "100%",
                borderRadius: 1,
                mb: 2,
                overflow: "hidden",
                "& img": {
                  width: "100%",
                  height: "auto",
                  maxHeight: "48px",
                  transition: "transform 0.2s ease",
                },
                "&:hover img": {
                  transform: "scale(1.02)",
                },
                "&:active img": {
                  transform: "scale(0.98)",
                },
              }}
            >
              <Box
                component="img"
                src={
                  theme.palette.mode === "dark"
                    ? GoogleDarkIcon
                    : GoogleLightIcon
                }
                alt="Sign in with Google"
              />

              {googleLoginStart && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    borderRadius: 1,
                  }}
                >
                  <CircularProgress size={28} color="inherit" />
                </Box>
              )}
            </ButtonBase>

            <Divider sx={{ my: 2 }}>OR</Divider>

            {/* Form with react-hook-form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Password must include uppercase, lowercase, number, and special character",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              {/* Forgot password link */}
              <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
                <Link
                  sx={{ cursor: "pointer" }}
                  onClick={handleForgotPassword}
                  variant="body2"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Box>

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 99, 71, 0.1)"
                        : "rgba(255, 99, 71, 0.15)",
                    color: theme.palette.error.main,
                    "& .MuiAlert-icon": {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  {errorMessage}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 1,
                  mb: 2,
                  position: "relative",
                  height: 40,
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Box>

            <Typography align="center" variant="body2">
              Don’t have an account?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal open={open} onClose={() => setOpen(false)} />
    </Grid>
  );
}

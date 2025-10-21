/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  TextField,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { resetPassword } from "../../store/auth/service/authService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import { setAuthState } from "../../store/auth/authSlice/authSlice";
import { saveAuthToken } from "../../store/auth/service/localStorage";
import { showLoader } from "../../store/loader/loaderSlice/loaderSlice";
import { logoutAsync } from "../../store/auth/authEffects/authEffects";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        await dispatch(logoutAsync());
        return;
      }
    };
    checkToken();
  }, [token, dispatch]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: "onChange", // validate as you type
    reValidateMode: "onChange", // revalidate immediately after changes
    criteriaMode: "firstError", // only show first error per field
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    setApiError("");
    setIsSubmitting(true);

    // console.log("DATA", data);
    try {
      const { password, confirmPassword } = data;
      if (!token) {
        await dispatch(logoutAsync());
        return;
      }
      const res = await resetPassword(token, password, confirmPassword);
      if (res.success) {
        dispatch(showLoader());
        saveAuthToken(res.token);
        dispatch(setAuthState(res.response));
        navigate("/my-courses");
      } else {
        setApiError(
          res.message ||
            "Failed to reset password. Please try again or request a new reset link."
        );
      }
    } catch (err: any) {
      console.log("RESET-PASSWORD-ERR", err);
      setApiError(
        err?.message ||
          "Failed to reset password. Please try again or request a new reset link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        px: 2,
        py: 4,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={3}
        sx={{
          width: { xs: "100%", sm: "90%", md: "500px" },
          maxWidth: "500px",
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Stack alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Reset Password
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Stack spacing={3}>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <LockOutlined
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              Enter your new password below. Make sure it's strong and secure.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Password must include uppercase, lowercase, number, and special character",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* API Error Message */}
              {apiError && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textAlign: "center" }}
                >
                  {apiError}
                </Typography>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.3,
                  mt: 1,
                }}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>

              {/* Back to Login */}
              <Button
                variant="text"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}

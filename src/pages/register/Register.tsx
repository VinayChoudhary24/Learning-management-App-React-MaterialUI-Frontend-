import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  useTheme,
  ButtonBase,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { JSX } from "@emotion/react/jsx-runtime";
import { MuiTelInput } from "mui-tel-input";
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import GoogleLightIcon from "../../assets/auth/googleLightTheme.svg";
import GoogleDarkIcon from "../../assets/auth/googleDarkTheme.svg";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  loginWithGoogle,
  verifyToken,
} from "../../store/auth/service/authService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import {
  logoutAsync,
  registerWithEmailAsync,
} from "../../store/auth/authEffects/authEffects";
import VerifyButton from "../../components/verifyButton/VerifyButton";
import VerifyModal from "../../components/verifyModal/VerifyModal";
import {
  sendOTP,
  verifyOTP,
} from "../../services/userRegisterVerification/verificationService";
import { showLoader } from "../../store/loader/loaderSlice/loaderSlice";
import { clearAuth } from "../../store/auth/service/localStorage";
// import { useAppDispatch } from "../../store/hooks/react-redux/hook";
// import {
//   hideLoader,
//   showLoader,
// } from "../../store/loader/loaderSlice/loaderSlice";

type MessageType = {
  text: string;
  severity: "success" | "error" | "info" | "warning";
};

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  phone: string; // full phone with code
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage(): JSX.Element {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // OTP
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState<null | "email" | "phone">(null);
  const [sendingOtp, setSendingOtp] = useState<"email" | "phone" | null>(null);
  const [verificationMessage, setVerificationMessage] =
    useState<MessageType | null>(null);

  const [alert, setAlert] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const [googleRegisterStart, setGoogleRegisterStart] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // if no token → redirect immediately
      if (!token) {
        clearAuth();
        navigate("/register");
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

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert({
          open: false,
          severity: "success",
          message: "",
        });
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    mode: "onChange", // validate as you type
    reValidateMode: "onChange", // revalidate immediately after changes
    criteriaMode: "firstError", // only show first error per field
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // SEND OTP
  const handleVerifyClick = useCallback(
    async (type: "email" | "phone", value: string) => {
      try {
        console.log("OTP-Value", value);
        // console.log("OTP-type", type);
        setSendingOtp(type);
        const result = await sendOTP(type, value);
        console.log("SEND-OTP-Result", result);
        if (result.success) {
          setModalOpen(type);
          setVerificationMessage({ text: result.message, severity: "info" });
        }
        return result;
      } catch (err) {
        console.error("SEND-OTP-ERR", err);
        setSendingOtp(null);
        setVerificationMessage({
          text: "Failed to send OTP",
          severity: "error",
        });
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to send OTP",
        });
        throw err;
      }
    },
    [] // no deps since it doesn’t depend on props/state except setters
  );

  const handleResend = useCallback(async () => {
    if (!modalOpen) return;

    // get the value based on modal type
    const value = modalOpen === "email" ? watch("email") : watch("phone");

    return await handleVerifyClick(modalOpen, value);
  }, [handleVerifyClick, modalOpen, watch]);

  // VERIFY OTP
  const handleConfirmOtp = useCallback(
    async (otp: string) => {
      if (!modalOpen) return;
      const type = modalOpen;
      const value = type === "email" ? watch("email") : watch("phone");

      try {
        const result = await verifyOTP(type, value, otp);
        // console.log("OTP-Confirm", type, value, otp);
        console.log("OTP-Confirm-Result", result);
        if (result.success) {
          if (type === "email") setEmailVerified(true);
          if (type === "phone") setPhoneVerified(true);
          setSendingOtp(null);
          setModalOpen(null);
        }
        // return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("err-msg", err.message);
        }
        setVerificationMessage({
          text: err instanceof Error ? err.message : "Failed to verify OTP",
          severity: "error",
        });
      }
    },
    [modalOpen, watch]
  );

  const closeModal = useCallback(() => {
    setSendingOtp(null);
    setModalOpen(null);
  }, []);

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const toggleConfirmPasswordVisibility = useCallback(
    () => setShowConfirmPassword((prev) => !prev),
    []
  );

  const onSubmit = async (data: RegisterFormInputs) => {
    setEmailError(null);
    setPhoneError(null);
    // console.log("Register:", data);
    // if (!phoneVerified) {
    //   setPhoneError("Please verify your mobile number.");
    //   return;
    // }
    // if (!emailVerified) {
    //   setEmailError("Please verify your email account.");
    //   return;
    // }
    // e.preventDefault();
    // dispatch(clearError());
    const { firstName, lastName, email, password } = data;
    const phoneNumber = parsePhoneNumberFromString(data.phone || "");
    // console.log("Parsed Phone Number:", phoneNumber);

    const payload = {
      firstName,
      lastName,
      email,
      phoneCode: phoneNumber ? phoneNumber.countryCallingCode : "",
      phone: phoneNumber ? phoneNumber.nationalNumber : "",
      password,
    };
    console.log("Payload:", payload);

    const result = await dispatch(registerWithEmailAsync(payload));
    console.log("Registration result:", result);
    if (registerWithEmailAsync.fulfilled.match(result)) {
      // set all form values to default i.e empty
      dispatch(showLoader());
      reset();
      navigate("/my-courses");
    } else if (registerWithEmailAsync.rejected.match(result)) {
      // console.log("result", result);
      console.log("result.payload", result.payload);
      const message =
        (result.payload as string) ||
        "Register failed. Please check your credentials.";
      setErrorMessage(message);
      // Auto-hide after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleGoogleRegister = useCallback(() => {
    console.log("Google signup clicked");
    setGoogleRegisterStart(true);
    loginWithGoogle();
    // console.log("Google login initiated:", result);
  }, []);

  // Memoized values
  const googleIcon = useMemo(
    () => (theme.palette.mode === "dark" ? GoogleDarkIcon : GoogleLightIcon),
    [theme.palette.mode]
  );

  // const VerifyButtonWrapper = () => (
  // <VerifyButton
  //   label="Email"
  //   verified={emailVerified}
  //   onClick={() => handleVerifyClick("email", watch("email"))}
  //   loading={sendingOtp && modalOpen !== "email"}
  // />
  // );

  // memoize modal props so modal doesn’t re-render unnecessarily
  const verifyModalProps = useMemo(
    () => ({
      open: !!modalOpen,
      onClose: closeModal,
      onConfirm: handleConfirmOtp,
      onResend: handleResend,
      title: modalOpen === "email" ? "Verify Email" : "Verify Phone",
      verificationMessage: verificationMessage || null,
    }),
    [modalOpen, verificationMessage, handleConfirmOtp, handleResend, closeModal]
  );

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Grid container>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Grid
        size={{ xs: 12 }}
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
            width: "100%",
            maxWidth: 520,
            backgroundColor: "transparent",
            boxShadow: "none",
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
              variant="h5"
              fontWeight={700}
              align="center"
              gutterBottom
            >
              Create your account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              mb={2}
            >
              Sign up to get started
            </Typography>

            {/* Google Register Button (accessible) */}
            <ButtonBase
              onClick={handleGoogleRegister}
              disabled={googleRegisterStart}
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
              <Box component="img" src={googleIcon} alt="Sign in with Google" />

              {googleRegisterStart && (
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

            {/* Register Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First name"
                    fullWidth
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 30,
                        message: "First name cannot exceed 30 characters",
                      },
                    })}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last name"
                    fullWidth
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 30,
                        message: "Last name cannot exceed 30 characters",
                      },
                    })}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>

                {/* Mobile Input with country picker */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      validate: (value) => {
                        if (!value) return "Phone number is required";
                        if (!isValidPhoneNumber(value)) {
                          return "Enter a valid phone number";
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <MuiTelInput
                        {...field}
                        label="Phone number"
                        defaultCountry="IN"
                        fullWidth
                        error={!!fieldState.error || !!phoneError}
                        helperText={fieldState.error?.message || phoneError}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <VerifyButton
                                // label="Phone"
                                verified={phoneVerified}
                                onClick={() =>
                                  handleVerifyClick("phone", field.value)
                                }
                                loading={sendingOtp === "phone"}
                                disabled={!!fieldState.error || !field.value}
                              />
                            ),
                          },
                        }}
                        forceCallingCode
                        focusOnSelectCountry
                        disableDropdown={false}
                        MenuProps={{
                          //   disablePortal: true,
                          PaperProps: {
                            style: {
                              maxHeight: 250,
                              zIndex: 1300,
                              //   width: "100%",
                            },
                          },
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "center",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "center",
                          },
                        }}
                        preferredCountries={["IN", "US", "GB"]}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    error={!!errors.email || !!emailError}
                    helperText={errors.email?.message || emailError}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <VerifyButton
                            // label="Email"
                            verified={emailVerified}
                            onClick={() =>
                              handleVerifyClick("email", watch("email"))
                            }
                            loading={sendingOtp === "email"}
                            disabled={
                              !!errors.email || !watch("email") // disable if invalid or empty
                            }
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    {...register("password", {
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
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
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
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (val) =>
                        val === watch("password") || "Passwords do not match",
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={toggleConfirmPasswordVisibility}
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
                  />
                </Grid>

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

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      height: 40,
                      fontWeight: 600,
                      position: "relative",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={20}
                          color="inherit"
                          sx={{ mr: 1 }}
                        />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Typography align="center" variant="body2" mt={2}>
              Already have an account?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Typography>

            {/* OTP Modal */}
            {/* <VerifyModal
              open={!!modalOpen}
              onClose={closeModal}
              onConfirm={handleConfirmOtp}
              onResend={handleResend}
              title={modalOpen === "email" ? "Verify Email" : "Verify Phone"}
              verificationMessage={verificationMessage || null}
            /> */}
            <VerifyModal {...verifyModalProps} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

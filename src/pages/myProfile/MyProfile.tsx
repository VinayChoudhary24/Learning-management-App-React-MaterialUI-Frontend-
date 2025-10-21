/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  TextField,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks/react-redux/hook";
import {
  selectUserDetails,
  setAuthState,
} from "../../store/auth/authSlice/authSlice";
import { updateUserProfile } from "../../store/auth/service/authService";
import { MuiTelInput } from "mui-tel-input";
import parsePhoneNumberFromString, {
  isValidPhoneNumber,
} from "libphonenumber-js";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";

const MotionPaper = motion(Paper);

const MyProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useAppSelector(selectUserDetails);
  const dispatch = useAppDispatch();

  const [alert, setAlert] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileImgPreview, setProfileImgPreview] = useState<string | null>(
    null
  );

  // Auth Check
  useAuthCheck();

  // React Hook Form Setup
  const {
    register,
    formState: { errors },
    control,
    reset,
    // watch,
  } = useForm({
    mode: "onChange", // validate as you type
    reValidateMode: "onChange", // revalidate immediately after changes
    criteriaMode: "firstError", // only show first error per field
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      phoneCode: "+91",
    },
  });

  // Load user into form
  useEffect(() => {
    if (user) {
      // Construct the full E.164 phone number string
      const fullPhone =
        user.phoneCode && user.phone
          ? `+${user.phoneCode}${user.phone}`
          : user.phone || "";
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: fullPhone,
        phoneCode: user.phoneCode || "",
      });
      setProfileImgPreview(user.profileImg?.url || "");
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [user, reset]);

  // Convert selected image to base64
  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.log("Please select a valid image file");
        setAlert({
          open: true,
          severity: "error",
          message: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.log("Image size should not exceed 5MB");
        setAlert({
          open: true,
          severity: "error",
          message: "Image size should not exceed 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImgPreview(base64String);

        // Submit after the base64 conversion is complete
        const payload: any = {
          "profileImg.url": base64String,
        };
        onSubmit(payload);
      };
      reader.onerror = () => {
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to read image file",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update field API call on change
  const handleFieldChange = async (field: string, value: string) => {
    try {
      // Don't submit if there are validation errors for this field
      if (errors[field as keyof typeof errors]) {
        return;
      }

      // Additional validation checks
      if (!value || value.trim() === "") {
        return;
      }
      const payload: any = { [field]: value };
      onSubmit(payload);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  // Handle phone field change with validation and parsing
  const handlePhoneChange = async (value: string) => {
    // Validate the phone number
    if (!value || !isValidPhoneNumber(value)) {
      return;
    }

    try {
      const phoneNumber = parsePhoneNumberFromString(value);

      if (phoneNumber) {
        const payload = {
          phoneCode: phoneNumber.countryCallingCode,
          phone: phoneNumber.nationalNumber,
        };
        onSubmit(payload);
      }
    } catch (error) {
      console.error("Phone update failed:", error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const updatedUser = await updateUserProfile(data);
      if (updatedUser.success) {
        // Store User State and LocalStorage
        dispatch(setAuthState(updatedUser.response));
        setAlert({
          open: true,
          severity: "success",
          message: updatedUser.message || "User updated successfully!",
        });
      } else {
        setAlert({
          open: true,
          severity: "error",
          message: updatedUser.message || "Failed to update user.",
        });
      }
    } catch (error: any) {
      console.error("Update-Err", error);
      setAlert({
        open: true,
        severity: "error",
        message: error?.message || "Failed to update user.",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          p: 2,
          backgroundColor:
            theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            maxWidth: "600px",
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            p: 4,
          }}
        >
          <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Skeleton variant="circular" width={90} height={90} />
            <Skeleton variant="text" width="90%" height={5} />
          </Stack>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton
                variant="rectangular"
                height={48}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 2,
        backgroundColor:
          theme.palette.mode === "dark" ? "grey.900" : "grey.100",
      }}
    >
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
      <MotionPaper
        elevation={5}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          p: 4,
        }}
      >
        <form>
          {/* Avatar Upload */}
          <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={profileImgPreview || "/default-avatar.png"}
                alt="Profile Picture"
                sx={{
                  width: isMobile ? 80 : 100,
                  height: isMobile ? 80 : 100,
                  border: `3px solid ${theme.palette.primary.main}`,
                }}
              />
              <IconButton
                component="label"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                <Upload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfileImgChange}
                />
              </IconButton>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Inputs */}
          <Stack spacing={2}>
            <TextField
              label="First Name"
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
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <TextField
              label="Last Name"
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
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

            <TextField
              label="Email"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              onBlur={(e) => handleFieldChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
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
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    forceCallingCode
                    focusOnSelectCountry
                    disableDropdown={false}
                    onBlur={() => {
                      field.onBlur(); // Triggers react-hook-form validation
                      handlePhoneChange(field.value);
                    }}
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
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Account Created:{" "}
            <Typography component="span" fontWeight={600}>
              {dayjs
                .unix(user?.createdAt ? user?.createdAt : 0)
                .format("DD MMM YYYY, hh:mm A")}
            </Typography>
          </Typography>
        </form>
      </MotionPaper>
    </Box>
  );
};

export default MyProfile;

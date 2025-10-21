/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Stack,
  Divider,
  Fade,
  Button,
  TextField,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, EmailOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
import { passwordResetLink } from "../../store/auth/service/authService";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await passwordResetLink(email);

      if (res.success) {
        setAlert({
          open: true,
          severity: "success",
          message: res.message || `Password reset link sent to ${email}`,
        });
        setEmail("");
        setTimeout(() => {
          onClose();
        }, 6500);
      } else {
        setAlert({
          open: true,
          severity: "error",
          message: res.message || "Failed to send password reset email",
        });
      }
      // You can add a success notification here
    } catch (error: any) {
      //   setError("Failed to send reset email. Please try again.");
      //   console.log("ERROR", error.message);
      setAlert({
        open: true,
        severity: "error",
        message: error.message || "Failed to send password reset email",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Fade in={open}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            width: { xs: "100%", sm: "90%", md: "500px" },
            maxWidth: "500px",
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 2, sm: 3 },
            outline: "none",
            display: "flex",
            flexDirection: "column",
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
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Forgot Password
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Content */}
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <EmailOutlined
                sx={{
                  fontSize: 60,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="body1" color="text.secondary">
                Enter your email address and we'll send you a link to reset your
                password.
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.3,
              }}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Button
              variant="text"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                fontWeight: 500,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
}

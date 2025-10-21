import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, type JSX } from "react";
import { Mail, Phone, MapPin, SendHorizonal } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { sendContactForm } from "../../services/contactMail/contactMailService";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs(): JSX.Element {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  // Auth Check
  useAuthCheck();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      const response = await sendContactForm(data);

      if (response.success) {
        setSubmitting(false);
        setAlert({
          open: true,
          severity: "success",
          message:
            response.message ||
            "Message sent successfully! We'll get back to you soon.",
        });
      } else {
        setSubmitting(false);
        setAlert({
          open: true,
          severity: "error",
          message:
            response.message || "Failed to send message. Please try again.",
        });
      }
      reset();
    } catch (error) {
      console.error("Failed to send contact form:", error);
      setSubmitting(false);
      setAlert({
        open: true,
        severity: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ p: { xs: 3, md: 6 } }}
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

      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            <Box
              component={motion.div}
              variants={fadeInUp}
              sx={{
                width: "100%",
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                backgroundColor: "transparent",
                border: `1px solid ${theme.palette.divider}`,
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                "&:hover": { boxShadow: theme.shadows[3] },
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                align="center"
                gutterBottom
              >
                Get in Touch
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                mb={3}
              >
                Have questions, feedback, or partnership ideas? We'd love to
                hear from you.
              </Typography>

              <Grid container spacing={3}>
                {/* Left Side - Info */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <motion.div variants={fadeInUp}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Mail size={20} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          vinaychoudhary2401@gmail.com
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Phone size={20} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          +91 9413221527
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <MapPin
                          size={20}
                          color={theme.palette.text.secondary}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Bengaluru, India
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Right Side - Form */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <motion.form
                    variants={fadeInUp}
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Your Name"
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Your Email"
                          type="email"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail size={18} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="subject"
                      control={control}
                      rules={{ required: "Subject is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Subject"
                          fullWidth
                          error={!!errors.subject}
                          helperText={errors.subject?.message}
                        />
                      )}
                    />

                    <Controller
                      name="message"
                      control={control}
                      rules={{
                        required: "Message is required",
                        minLength: {
                          value: 10,
                          message: "Message must be at least 10 characters",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Message"
                          fullWidth
                          multiline
                          minRows={4}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        height: 42,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {submitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message <SendHorizonal size={18} />
                        </>
                      )}
                    </Button>
                  </motion.form>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
}

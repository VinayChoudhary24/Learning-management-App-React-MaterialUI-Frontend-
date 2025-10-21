/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { useCartContext } from "../../context/cart/CartContext";
import { useLastPurchaseContext } from "../../context/lastPurchase/LastPurchaseContext";
import { clearAuth } from "../../store/auth/service/localStorage";
import { formatCurrency } from "../../utils/currency/formatCurrency";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";

type ReceiptData = {
  courses: { title: string; price: number }[];
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  subTotalAmount: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: number;
};

const Receipt = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { clearCart } = useCartContext();
  const { lastPurchase } = useLastPurchaseContext();
  const [searchParams] = useSearchParams();
  // Store receipt data and clear contexts on mount
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  useAuthCheck();

  useEffect(() => {
    // Check if payment_intent exists in URL params
    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");

    // If no payment_intent or redirect_status is not succeeded, redirect to login
    if (!paymentIntent || redirectStatus !== "succeeded") {
      clearAuth();
      navigate("/login");
      return;
    }

    if (lastPurchase) {
      // Clear cart
      // console.log("LASTPURCHASE-", lastPurchase);
      clearCart();
      // Store the data
      setReceiptData({
        courses: lastPurchase?.enrollmentDetails.map((item: any) => ({
          title: item.title || "",
          price: item.price || 0,
        })),
        userDetails: {
          firstName: lastPurchase.userDetails.firstName || "",
          lastName: lastPurchase.userDetails.lastName || "",
          email: lastPurchase.userDetails.email || "",
        },
        subTotalAmount: lastPurchase.subTotalAmount || 0,
        taxes: lastPurchase.taxes || 0,
        discountAmount: lastPurchase.discountAmount || 0,
        totalAmount: lastPurchase.totalAmount || 0,
        createdAt: lastPurchase.createdAt || 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Framer Motion Variants for animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const MotionPaper = motion(Paper);
  const MotionBox = motion(Box);
  const MotionTypography = motion(Typography);

  if (!receiptData) {
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
            boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header Section Skeleton */}
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Skeleton
              variant="circular"
              width={isMobile ? 50 : 70}
              height={isMobile ? 50 : 70}
              sx={{ mx: "auto", mb: 2 }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={isMobile ? 40 : 48}
              sx={{ mx: "auto", mb: 1 }}
            />
            <Skeleton variant="text" width="80%" sx={{ mx: "auto" }} />
          </Box>

          <Divider />

          <Stack spacing={2} sx={{ p: 4 }}>
            {/* Customer Information Skeleton */}
            <Box>
              <Skeleton variant="text" width="50%" height={32} sx={{ mb: 1 }} />
              <Stack spacing={0.5} sx={{ px: 2 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="60%" />
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Purchased Courses Skeleton */}
            <Box>
              <Skeleton variant="text" width="50%" height={32} sx={{ mb: 1 }} />
              {[1, 2].map((index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1,
                    px: 2,
                    mb: 1,
                    backgroundColor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="20%" />
                  </Stack>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Price Breakdown Skeleton */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Skeleton variant="text" width="35%" height={32} />
                <Skeleton variant="text" width="25%" height={32} />
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Transaction Details Skeleton */}
            <Box>
              <Stack direction="row" justifyContent="space-between">
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="40%" />
              </Stack>
            </Box>
          </Stack>

          {/* Button Skeleton */}
          <Box sx={{ p: 3, backgroundColor: "action.hover" }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              sx={{ borderRadius: 2 }}
            />
          </Box>
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
      <MotionPaper
        elevation={5}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ p: 4, textAlign: "center" }}>
          <motion.div variants={itemVariants}>
            <CheckCircle2
              size={isMobile ? 50 : 70}
              color={theme.palette.success.main}
              strokeWidth={1.5}
            />
          </motion.div>
          <MotionTypography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            sx={{ mt: 2 }}
            variants={itemVariants}
          >
            Payment Successful!
          </MotionTypography>
          <MotionTypography
            color="text.secondary"
            sx={{ mt: 1 }}
            variants={itemVariants}
          >
            Thank you for your purchase, {receiptData.userDetails.firstName}{" "}
            {receiptData.userDetails.lastName}!
          </MotionTypography>
        </Box>

        <Divider />

        <Stack spacing={2} sx={{ p: 4 }}>
          {/* User Details */}
          <MotionBox variants={itemVariants}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Customer Information
            </Typography>
            <Stack spacing={0.5} sx={{ px: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Name:{" "}
                <Typography component="span" color="text.primary">
                  {receiptData.userDetails.firstName}{" "}
                  {receiptData.userDetails.lastName}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email:{" "}
                <Typography component="span" color="text.primary">
                  {receiptData.userDetails.email}
                </Typography>
              </Typography>
            </Stack>
          </MotionBox>

          <Divider sx={{ my: 2 }} />

          {/* Purchased Courses */}
          <MotionBox variants={itemVariants}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Purchased Courses
            </Typography>
            {receiptData.courses.map((course, index) => (
              <Stack
                key={index}
                direction="row"
                justifyContent="space-between"
                sx={{
                  py: 1,
                  px: 2,
                  mb: 1,
                  backgroundColor: "action.hover",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{course.title}</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatCurrency(course.price)}
                </Typography>
              </Stack>
            ))}
          </MotionBox>

          <Divider sx={{ my: 2 }} />

          {/* Price Breakdown */}
          <MotionBox variants={itemVariants}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>
                {formatCurrency(receiptData.subTotalAmount)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography color="text.secondary">Discount</Typography>
              <Typography color="success.main">
                -{formatCurrency(receiptData.discountAmount)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography color="text.secondary">Taxes</Typography>
              <Typography>{formatCurrency(receiptData.taxes)}</Typography>
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600}>
                Total Amount
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(receiptData.totalAmount)}
              </Typography>
            </Stack>
          </MotionBox>

          <Divider sx={{ my: 2 }} />

          {/* Transaction Details */}
          <MotionBox variants={itemVariants}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Date & Time</Typography>
              <Typography>
                {dayjs
                  .unix(receiptData.createdAt)
                  .format("DD MMM YYYY, hh:mm A")}
              </Typography>
            </Stack>
          </MotionBox>
        </Stack>

        <Box sx={{ p: 3, backgroundColor: "action.hover" }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<ArrowRight />}
              onClick={() => navigate("/my-courses")}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Go to My Courses
            </Button>
          </motion.div>
        </Box>
      </MotionPaper>
    </Box>
  );
};

export default Receipt;

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Button,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { CurrencyRupee, RefreshRounded } from "@mui/icons-material";
import { useCartContext } from "../../context/cart/CartContext";
import type { CourseResponse } from "../../services/course/types/course.types";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm/CheckoutForm";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";
import { createEnrollment } from "../../services/enrollment/enrollmentService";
import { createPaymentIntent } from "../../services/payment/paymentService";
import { formatCurrency } from "../../utils/currency/formatCurrency";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function Checkout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cart, removeFromCart, clearCart } = useCartContext();

  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Auth Check
  useAuthCheck();

  // Fetch enrollment details from backend
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        setPaymentLoading(true);
        const courseIds = cart.map((course) => course._id);
        if (courseIds.length > 0) {
          const response = await createEnrollment(courseIds);
          // console.log("Enrollment API Response:", response);
          if (response?.success && response?.response?._id) {
            const enrollmentId = response.response?._id;
            const createdAt = response.response?._createdAtDate;

            // set current enrollmentId and createdAt purchase in localStorage
            localStorage.setItem("currentPurchaseEnrollmentId", enrollmentId);
            localStorage.setItem(
              "enrollmentCreatedAt",
              new Date(createdAt).toISOString()
            );
            localStorage.setItem(
              "lastPurchase",
              JSON.stringify(response?.response)
            );
            // Call createPaymentIntent only after successful enrollment
            setPaymentLoading(true);
            try {
              // console.log("THIS-IS-STRIPECHECKOUT");
              const { clientSecret } = await createPaymentIntent();
              // console.log("clientSecret", clientSecret);
              setClientSecret(clientSecret);
            } catch (error) {
              console.error("Failed to create payment intent:", error);
            } finally {
              setPaymentLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to create enrollment:", err);
      } finally {
        setLoading(false);
        setPaymentLoading(false);
      }
    };

    fetchEnrollment();
  }, [cart]);

  // Calculate totals
  const subtotal = cart.reduce((sum, course) => sum + (course.price || 0), 0);
  const formattedSubtotalAmount = formatCurrency(subtotal);
  const TAX_RATE = 0.07;
  const DISCOUNT_RATE = 0.17;

  const discountAmount = parseFloat((subtotal * DISCOUNT_RATE).toFixed(2));
  const amountAfterDiscount = subtotal - discountAmount;
  const tax = parseFloat((amountAfterDiscount * TAX_RATE).toFixed(2));
  const decimalAmount = parseFloat((amountAfterDiscount + tax).toFixed(2));
  const totalAmount = Math.round(decimalAmount);

  const formattedTax = formatCurrency(tax);
  const formattedDiscountAmount = formatCurrency(discountAmount);
  const formattedTotalAmount = formatCurrency(totalAmount);

  const handleRemove = (courseId: string) => removeFromCart(courseId);
  const handleClearCart = () => clearCart();

  const options: StripeElementsOptions | undefined = clientSecret
    ? {
        // mode: "payment",
        // currency: "inr",
        // amount: Number(totalAmount),
        clientSecret,
        appearance: {
          theme: "stripe",
          // variables allow some theming to match MUI. adjust as needed.
          variables: {
            colorPrimary: theme.palette.primary.main,
            colorBackground: theme.palette.background.paper,
            colorText: theme.palette.text.primary,
            borderRadius: "8px",
          },
        },
      }
    : undefined;

  // Re-initialize Stripe window
  const handleRetryPaymentIntent = async () => {
    try {
      setPaymentLoading(true);
      const { clientSecret } = await createPaymentIntent();
      if (clientSecret) {
        setClientSecret(clientSecret);
        // console.log("Payment intent re-initialized successfully");
      }
    } catch (err) {
      console.error("Error while retrying payment intent:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* LEFT SIDE - Cart Items + Payment Window */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* CART ITEMS */}
            <Box
              sx={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 3,
                mb: 3,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Cart Items
              </Typography>

              {loading ? (
                <Stack spacing={2}>
                  {cart.map((i) => (
                    <Card
                      key={i._id}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        borderRadius: 3,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width={isMobile ? "100%" : 180}
                        height={180}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
                        <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                        <Skeleton width="30%" height={25} sx={{ mb: 2 }} />
                        <Skeleton variant="rounded" width={100} height={36} />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : cart.length === 0 ? (
                <Typography color="text.secondary">
                  Your cart is empty.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {cart.map((course: CourseResponse) => (
                    <Card
                      key={course._id}
                      component={motion.div}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        borderRadius: 3,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={course.courseImg.url || undefined}
                        alt={course.title || "Course"}
                        sx={{
                          width: { xs: "100%", sm: 180 },
                          height: { xs: 180, sm: "auto" },
                          objectFit: "cover",
                        }}
                      />
                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            {course.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {course.instructor.firstName}{" "}
                            {course.instructor.lastName}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CurrencyRupee sx={{ fontSize: 18 }} />
                            {course.price != null
                              ? course.price.toLocaleString("en-IN")
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            mt: 2,
                            alignSelf: "flex-start",
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                          onClick={() => handleRemove(course._id)}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}

              {!loading && cart.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              )}
            </Box>
            {/* PAYMENT WINDOW */}
            <Box
              sx={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 3,
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
              }}
            >
              {paymentLoading ? (
                <Stack spacing={2}>
                  <Skeleton variant="rectangular" height={60} width="100%" />
                  <Skeleton variant="rectangular" height={60} width="100%" />
                  <Skeleton variant="rectangular" height={60} width="100%" />
                </Stack>
              ) : !clientSecret ? (
                <Stack
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ py: 4, textAlign: "center" }}
                >
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetryPaymentIntent}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      border: `2px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                    }}
                  >
                    <RefreshRounded fontSize="large" />
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1, fontWeight: 500 }}
                  >
                    Failed to initialize payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to try again
                  </Typography>
                </Stack>
              ) : (
                <>
                  {/* Stripe Test Mode Info Banner */}
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.03)",
                      border: `1px dashed ${theme.palette.primary.main}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="primary.main"
                      >
                        ⚠️ Test Mode Active
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This payment is running in{" "}
                        <strong>Stripe Test Mode</strong>. Use test card:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{ mt: 0.5 }}
                      >
                        4242 4242 4242 4242 — 01/27 — 123
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        // alignSelf: "flex-end",
                        // textAlign: "right",
                        fontStyle: "italic",
                      }}
                    >
                      💡 You’ll see a Stripe test popup on the bottom-right of
                      your screen for more card information.
                    </Typography>
                  </Box>

                  {/* Stripe Payment Form */}
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                  </Elements>
                </>
              )}
            </Box>
          </Grid>

          {/* RIGHT SIDE - PAYMENT SUMMARY */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: theme.palette.text.primary }}
              >
                Payment Summary
              </Typography>

              {loading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={28} width="100%" />
                  ))}
                  <Divider sx={{ my: 1.5 }} />
                  <Skeleton height={30} width="80%" />
                </Stack>
              ) : (
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight="600">
                      {/* <CurrencyRupee sx={{ fontSize: 16 }} /> */}
                      {formattedSubtotalAmount}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Tax (7%)</Typography>
                    <Typography fontWeight="600">
                      {/* <CurrencyRupee sx={{ fontSize: 16 }} /> */}
                      {formattedTax}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">
                      Discount (17%)
                    </Typography>
                    <Typography fontWeight="600" color="success.main">
                      {/* -<CurrencyRupee sx={{ fontSize: 16 }} /> */}-
                      {formattedDiscountAmount}
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="bold">Total Amount</Typography>
                    <Typography fontWeight="bold" color="primary">
                      {/* <CurrencyRupee sx={{ fontSize: 18 }} /> */}
                      {formattedTotalAmount}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

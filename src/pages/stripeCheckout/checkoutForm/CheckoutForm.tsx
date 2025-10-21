import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Typography, Stack } from "@mui/material";
import { useLastPurchaseContext } from "../../../context/lastPurchase/LastPurchaseContext";
import { useCartContext } from "../../../context/cart/CartContext";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { setLastPurchase, clearLastPurchase } = useLastPurchaseContext();
  const { cart } = useCartContext();

  // Check if enrollment is still valid (within 15 min TTL window)
  const isEnrollmentValid = (): boolean => {
    const enrollmentCreatedAt = localStorage.getItem("enrollmentCreatedAt");

    if (!enrollmentCreatedAt) {
      return false;
    }

    const createdTime = new Date(enrollmentCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedMinutes = (currentTime - createdTime) / (1000 * 60);

    // Check if more than 10 minutes have passed (leaving 5 min buffer before 15 min TTL)
    return elapsedMinutes < 10;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // Validate enrollment before proceeding with payment
    if (!isEnrollmentValid()) {
      setErrorMessage(
        "Your session has expired. Refreshing to create a new session..."
      );

      // Clear old enrollment data
      localStorage.removeItem("currentPurchaseEnrollmentId");
      localStorage.removeItem("enrollmentCreatedAt");
      clearLastPurchase();

      // Reload page after 2 seconds to create fresh enrollment
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }

    try {
      setProcessing(true);
      const storedPurchase = localStorage.getItem("lastPurchase");
      const lastPurchase = storedPurchase ? JSON.parse(storedPurchase) : null;
      if (lastPurchase) {
        setLastPurchase(lastPurchase);
      }
      //   const { error } = await stripe.confirmPayment({
      const stripeResult = await stripe.confirmPayment({
        elements,
        // redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/receipt`,
          // receipt_email: userDetails?.email || undefined,
        },
      });
      // console.log("stripeResult", stripeResult);
      if (stripeResult.error) {
        setErrorMessage(stripeResult.error.message || "Payment failed");
      }
    } catch (err) {
      console.error("Error during payment confirmation:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <PaymentElement />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!stripe || !elements || processing || cart.length === 0}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          {processing ? "Processing..." : "Pay Now"}
        </Button>
        {errorMessage && (
          <Typography color="error" fontSize="0.9rem">
            {errorMessage}
          </Typography>
        )}
      </Stack>
    </form>
  );
};

export default CheckoutForm;

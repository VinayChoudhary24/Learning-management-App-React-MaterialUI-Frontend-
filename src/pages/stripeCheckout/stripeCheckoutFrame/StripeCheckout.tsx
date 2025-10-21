import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "../checkoutForm/CheckoutForm";
import { createPaymentIntent } from "../../../services/payment/paymentService";
import { Stack, Skeleton } from "@mui/material";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const StripeCheckout: React.FC = () => {
  // const theme = useTheme();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log("THIS-IS-STRIPECHECKOUT");
        const { clientSecret } = await createPaymentIntent();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
      } finally {
        setLoading(false);
      }
    };
    initializePayment();
  }, []);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={40} width="100%" />
        <Skeleton variant="rectangular" height={60} width="100%" />
        <Skeleton variant="rectangular" height={45} width="50%" />
      </Stack>
    );
  }

  if (!clientSecret) {
    return <div>Failed to initialize payment. Please try again.</div>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "flat",
      labels: "floating",
    },
    // appearance: {
    //     theme: "stripe",
    //     // variables allow some theming to match MUI. adjust as needed.
    //     variables: {
    //       colorPrimary: theme.palette.primary.main,
    //       colorBackground: theme.palette.background.paper,
    //       colorText: theme.palette.text.primary,
    //       borderRadius: "8px",
    //     },
    //   },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;

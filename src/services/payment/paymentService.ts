import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";

interface PaymentIntentResponse {
  // success: boolean;
  // message: string;
  clientSecret: string;
}

export const createPaymentIntent = async (): Promise<PaymentIntentResponse> => {
  try {
    const enrollmentId = localStorage.getItem("currentPurchaseEnrollmentId");
    // console.log("ATACHING-ENROLLMENTID-PAYMENT-INTENT", enrollmentId);
    if (!enrollmentId) throw new Error("Missing enrolmentId in localStorage");
    const response = await api.post<unknown, PaymentIntentResponse>(
      "/payment/create-payment-intent",
      { enrollmentId } // only enrolmentId
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error?.message || "Failed to create payment intent");
  }
};

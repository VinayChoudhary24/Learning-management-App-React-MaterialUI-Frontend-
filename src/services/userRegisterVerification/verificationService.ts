import { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";

type OTPResponse = {
  success: boolean;
  message: string;
  identifier?: string;
};

type VerifyOTPResponse = {
  success: boolean;
  message: string;
};

export const sendOTP = async (
  type: "email" | "phone",
  value: string
): Promise<OTPResponse> => {
  try {
    const response = await api.post<unknown, OTPResponse>("/user/send-otp", {
      type,
      value,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export const verifyOTP = async (
  type: "email" | "phone",
  value: string,
  otp: string
): Promise<VerifyOTPResponse> => {
  try {
    const response = await api.post<unknown, VerifyOTPResponse>(
      "/user/verify-otp",
      {
        type,
        value,
        otp,
      }
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

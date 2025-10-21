import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const sendContactForm = async (
  data: ContactFormData
): Promise<ContactResponse> => {
  try {
    const response = await api.post<unknown, ContactResponse>(
      "/user/contact",
      data
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message || "Failed to send contact form"
    );
  }
};

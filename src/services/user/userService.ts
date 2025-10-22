import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";
import type { OAuth2Response } from "../../store/auth/types/auth.types";

export const getUser = async (): Promise<OAuth2Response> => {
  try {
    return await api.get<unknown, OAuth2Response>("/user");
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error?.message || "Failed to fetch user");
  }
};

import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";
import type {
  EnrollmentDataResponse,
  EnrollmentsDataResponse,
} from "./types/enrollment.types";

export const createEnrollment = async (
  courseIds: string[]
): Promise<EnrollmentDataResponse> => {
  try {
    const response = await api.post<unknown, EnrollmentDataResponse>(
      "/enrollment",
      {
        courseIds,
      }
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message || "Failed to create enrollment"
    );
  }
};

export const getEnrollments = async (): Promise<EnrollmentsDataResponse> => {
  try {
    const response = await api.get<unknown, EnrollmentsDataResponse>(
      "/enrollment"
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message || "Failed to fetch Enrollments"
    );
  }
};

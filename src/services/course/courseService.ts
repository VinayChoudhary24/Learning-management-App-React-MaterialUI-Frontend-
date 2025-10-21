import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";
import type {
  CourseDataResponse,
  CourseModulesDataResponse,
} from "./types/course.types";

export const getCourses = async (options?: {
  limit?: number;
  offset?: number;
  status?: number;
  isFeatured?: boolean;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}): Promise<CourseDataResponse> => {
  try {
    const params: Record<string, unknown> = {};
    if (options?.limit !== undefined) params.limit = options.limit;
    if (options?.offset !== undefined) params.offset = options.offset;
    if (options?.status !== undefined) params.status = options.status;
    if (options?.isFeatured !== undefined)
      params.isFeatured = options.isFeatured;
    if (options?.searchTerm?.trim()) params.search = options.searchTerm.trim();

    if (options?.minPrice !== undefined) params.minPrice = options.minPrice;
    if (options?.maxPrice !== undefined) params.maxPrice = options.maxPrice;
    if (options?.category?.trim()) params.category = options.category.trim();

    const response = await api.get<unknown, CourseDataResponse>("/course", {
      params,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error.response?.data?.message || "Failed to fetch courses");
  }
};

export const getCourseModules = async (
  courseId: string
): Promise<CourseModulesDataResponse> => {
  try {
    const response = await api.get<unknown, CourseModulesDataResponse>(
      `/course/module/${courseId}`
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message || "Failed to fetch course modules"
    );
  }
};

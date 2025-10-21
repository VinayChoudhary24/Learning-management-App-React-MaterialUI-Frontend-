import type { AxiosError } from "axios";
import api from "../../utils/api/axiosInterceptor/axiosInstance";
import type { CategoryDataResponse } from "./types/category.types";

export const getCategories = async (options?: {
  isLimitedData?: boolean;
}): Promise<CategoryDataResponse> => {
  try {
    const params: Record<string, unknown> = {};
    if (options?.isLimitedData !== undefined)
      params.isLimitedData = options.isLimitedData;

    const response = await api.get<unknown, CategoryDataResponse>("/category", {
      params,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};

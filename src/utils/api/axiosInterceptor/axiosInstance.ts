/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { appConfig } from "../../../configs/appConfig";
import { clearAuth } from "../../../store/auth/service/localStorage";

// Create Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl || import.meta.env.VITE_API_URL,
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = localStorage.getItem("token");

    if (token && config.headers) {
      token = JSON.parse(token);
      // console.log("Attaching token to request:", token);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // unwrap response -> return only data
    return response.data;
  },
  (error: AxiosError) => {
    const errorResponse = {
      success: false,
      statusCode: 0,
      message: "An unexpected error occurred",
      details: null as any,
    };
    if (error.response) {
      const { status, data } = error.response;
      const responseData = data as any;
      errorResponse.statusCode = status;
      errorResponse.details = responseData;

      switch (status) {
        case 400:
          console.error("Bad Request:", error.response.data);
          errorResponse.message =
            responseData?.message || "Bad Request. Please check your input.";
          break;
        case 401:
          errorResponse.message = "Unauthorized. Please login again.";
          console.warn("Unauthorized. Redirecting to login...");
          clearAuth();
          // We check if 'window' is defined to ensure this code only runs in the browser.
          // We also check that we're not *already* on the login page to avoid redirect loops.
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login"
          ) {
            window.location.href = "/login"; // Or your specific login route
          }
          break;
        case 403:
          console.error("Forbidden:", error.response.data);
          errorResponse.message =
            "You do not have permission to perform this action.";
          break;
        case 404:
          console.error("Not Found:", error.response.data);
          errorResponse.message = "Requested resource not found.";
          break;
        case 500:
          console.error("Server Error:", error.response.data);
          errorResponse.message =
            "Internal server error. Please try again later.";
          break;
        default:
          console.error("Unexpected Error:", error.response.data);
          errorResponse.message =
            responseData?.message || "Unexpected server error.";
      }
      return Promise.reject(errorResponse);
    } else if (error.request) {
      console.error("No response from server:", error.request);
      errorResponse.message =
        "No response from server. Please check your network connection.";
    } else {
      console.error("Request setup error:", error.message);
      errorResponse.message = error.message || "Request configuration error.";
    }

    return Promise.reject(errorResponse);
  }
);

export default api;

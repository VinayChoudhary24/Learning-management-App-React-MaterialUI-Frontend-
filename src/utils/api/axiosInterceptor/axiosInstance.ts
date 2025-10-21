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
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", error.response.data);
          break;
        case 401:
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
          break;
        case 404:
          console.error("Not Found:", error.response.data);
          break;
        case 500:
          console.error("Server Error:", error.response.data);
          break;
        default:
          console.error("Unexpected Error:", error.response.data);
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

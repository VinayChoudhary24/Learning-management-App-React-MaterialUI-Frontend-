/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from "axios";
import api from "../../../utils/api/axiosInterceptor/axiosInstance";
import type {
  AuthCheckResponse,
  AuthLogoutResponse,
  AuthResponse,
  GoogleAuthRedirect,
  ResetLinkResponse,
} from "../types/auth.types";

// Register with email/password
export const registerWithEmail = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneCode: string,
  phone: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response: AuthResponse = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      phoneCode,
      phone,
      password,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error?.message || "Registration failed. Please try again.");
  }
};

// Login with email/password
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response: AuthResponse = await api.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.log("Error in loginWithEmail:", error);
    throw new Error(error?.message || "Login failed. Please try again.");
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const response: GoogleAuthRedirect = await api.get("/auth/google");
    // console.log("Google login response:", response);
    window.location.href = response.authUrl || "/";
    // return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error?.message || "Google login failed. Please try again.");
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.get<AuthLogoutResponse>("/auth/logout");
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(error?.message || "Logout failed. Please try again.");
  }
};

// Verify Token in Components
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response: AuthCheckResponse = await api.get("/auth/verify");
    // console.log("response?.data?.success ?? false", response.success ?? false);
    return response.success ?? false;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("Token verification failed:", error?.message);
    return false;
  }
};

// Verify Course Auth Components
export const verifyCourseAuth = async (id: string): Promise<boolean> => {
  try {
    const response: AuthCheckResponse = await api.get(
      `/auth/verify/course-auth/${id}`
    );
    return response.success ?? false;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("CourseAuth verification failed:", error?.message);
    return false;
  }
};

export const updateUserProfile = async (userData: any): Promise<any> => {
  try {
    const response = await api.put("/user", userData);
    return response;
  } catch (err) {
    console.error("Profile update failed:", err);
    throw err;
  }
};

// Send Forgot Password Reset-link
export const passwordResetLink = async (
  email: string
): Promise<ResetLinkResponse> => {
  try {
    const response: ResetLinkResponse = await api.post(
      "/auth/password/forget",
      {
        email,
      }
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error?.message || "Failed to send password reset link. Please try again."
    );
  }
};

// Reset User Password
export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  try {
    const response: AuthResponse = await api.put(
      `/auth/password/reset/${token}`,
      {
        newPassword: password,
        confirmPassword,
      }
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    throw new Error(
      error?.message || "Failed to send password reset link. Please try again."
    );
  }
};

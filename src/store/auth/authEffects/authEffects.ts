import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginWithEmail,
  logout,
  // loginWithGoogle,
  // logout,
  registerWithEmail,
} from "../service/authService";
import type {
  AuthResponse,
  AuthSuccessResponse,
  LoginPayload,
  // LoginPayload,
  RegisterPayload,
} from "../types/auth.types";
import { mapAuthResponse } from "../../../utils/authResponse/mapAuthResponse";

export const registerWithEmailAsync = createAsyncThunk<
  AuthSuccessResponse,
  RegisterPayload,
  { rejectValue: string }
>(
  "auth/registerWithEmail",
  async (
    { firstName, lastName, email, phoneCode, phone, password }: RegisterPayload,
    { rejectWithValue }
  ): Promise<AuthSuccessResponse | ReturnType<typeof rejectWithValue>> => {
    try {
      const user: AuthResponse = await registerWithEmail(
        firstName,
        lastName,
        email,
        phoneCode,
        phone,
        password
      );

      console.log("Registered user:", user);
      const mappedData = mapAuthResponse(user);
      const response = {
        user: mappedData,
        token: user.token || "",
      };
      return response;
    } catch (error: unknown) {
      console.log("Registration error:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred during registration.");
    }
  }
);

export const loginWithEmailAsync = createAsyncThunk<
  AuthSuccessResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/loginWithEmail",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const user: AuthResponse = await loginWithEmail(email, password);
      console.log("Logged in user:", user);
      return {
        user: mapAuthResponse(user),
        token: user.token || "",
      };
    } catch (error: unknown) {
      console.log("Login error:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred during login.");
    }
  }
);

// export const loginWithGoogleAsync = createAsyncThunk<
//   UserResponse,
//   void,
//   { rejectValue: string }
// >("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
//   try {
//     const user = await loginWithGoogle();

//     return {
//       uid: user.uid,
//       email: user.email,
//       displayName: user.displayName,
//       photoURL: user.photoURL,
//     };
//   } catch (error: unknown) {
//     console.log("Google Login error:", error);
//     if (error instanceof Error) {
//       return rejectWithValue(error.message);
//     }
//     return rejectWithValue("An unknown error occurred during google login.");
//   }
// });

export const logoutAsync = createAsyncThunk<
  void, // No payload to return
  void, // No argument expected
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    console.log("Calling Logout...");
    await logout();
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred during logout.");
  }
});

// export const updateUserProfileAsync = createAsyncThunk<
//   any,
//   any,
//   { rejectValue: string }
// >("auth/updateUserProfile", async (userData, { rejectWithValue }) => {
//   try {
//     const updatedUser = await updateUserProfile(userData);
//     return {
//       user: mapAuthResponse(updatedUser),
//     };
//   } catch (error: any) {
//     return rejectWithValue(error?.response?.data?.message || "Update failed");
//   }
// });

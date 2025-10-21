import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../types/auth.types";
import {
  loginWithEmailAsync,
  logoutAsync,
  registerWithEmailAsync,
  // loginWithGoogleAsync,
  //   logoutAsync,
} from "../authEffects/authEffects";
import { clearAuth, saveAuth } from "../service/localStorage";

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      // Clear Data from LocalStorage
      clearAuth();
    },
    // For auth state changes
    setAuthState: (state, action) => {
      const user = action.payload;
      if (user) {
        state.isLoggedIn = true;
        state.user = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneCode: user.phoneCode,
          phone: user.phone,
          email: user.email,
          role: user.role,
          profileImg: user.profileImg,
          has2FA: user.has2FA ?? false, // safer default than `|| true`
          isEmailVerified: user.isEmailVerified ?? false,
          isPhoneVerified: user.isPhoneVerified ?? false,
          status: user.status,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          fullName: user.fullName,
          mobile: user.mobile,
        };
        saveAuth({ user: state.user });
      } else {
        state.isLoggedIn = false;
        state.user = null;
        clearAuth();
      }
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    // REGISTER USER
    builder
      .addCase(registerWithEmailAsync.pending, (state) => {
        state.user = null;
        state.loading = true;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(registerWithEmailAsync.fulfilled, (state, action) => {
        // console.log("USER-REGISTER-FULLFILEED", action.payload);
        const { user, token } = action.payload;
        state.user = user;
        state.isLoggedIn = true;
        state.loading = false;
        // Save User and token
        saveAuth({ user: state.user, token });
      })
      .addCase(registerWithEmailAsync.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
        // state.error = (action.payload as string) ?? action.error.message ?? "Registration failed";
        state.error = action.payload ?? "Registration failed";
      });

    // LOGIN USER
    builder
      .addCase(loginWithEmailAsync.pending, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAsync.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
        state.user = user;
        // Save User and Token in LocalStorage
        saveAuth({ user: state.user, token });
      })
      .addCase(loginWithEmailAsync.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
        // state.error = (action.payload as string) ?? action.error.message ?? "Login failed";
        state.error = action.payload ?? "Login failed";
      });

    // // GOOGLE SOCIAL LOGIN
    // builder
    //   .addCase(loginWithGoogleAsync.pending, (state) => {
    //     state.isLoggedIn = false;
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginWithGoogleAsync.fulfilled, (state, action) => {
    //     state.isLoggedIn = true;
    //     state.loading = false;
    //     state.user = action.payload;
    //     // Save User and Token in LocalStorage
    //     saveAuth({ user: state.user });
    //   })
    //   .addCase(loginWithGoogleAsync.rejected, (state, action) => {
    //     state.isLoggedIn = false;
    //     state.loading = false;
    //     // state.error = (action.payload as string) ?? action.error.message ?? "Social login failed";
    //     state.error = action.payload ?? "Social login failed";
    //   });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoggedIn = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        console.log("Logout-Fullfilled");
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
        // Clear Data from LocalStorage
        clearAuth();
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        console.log("Logout-Rejected", action.payload);
        state.isLoggedIn = true;
        state.loading = false;
        // state.error = (action.payload as string) ?? action.error.message ?? "logout failed";
        state.error = action.payload ?? "logout failed";
      });
  },
});

// Action creators are generated for each case reducer function
export const authReducer = AuthSlice.reducer;

export const { logout, setAuthState, clearError } = AuthSlice.actions;

// --- Memoized Selectors (high perf)
const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectUserDetails = createSelector(
  selectAuthState,
  (auth) => auth.user
);
export const selectIsUserLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.isLoggedIn
);
// export const selectIsUserLoggedIn = (state: { auth: AuthState }) =>
//   state.auth.isLoggedIn;

export const selectAuthLoadingStatus = createSelector(
  selectAuthState,
  (auth) => auth.loading
);
export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice/authSlice";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { loaderReducer } from "./loader/loaderSlice/loaderSlice";
import { loadAuth } from "./auth/service/localStorage";
// import { bookingReducer } from "./bookings/bookingSlice/bookingSlice";

// Load persisted data from localStorage
const persistedAuth = loadAuth();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    // bookings: bookingReducer,
  },
  preloadedState: persistedAuth
    ? {
        auth: {
          user: persistedAuth.user,
          isLoggedIn: true,
          loading: false,
          error: null,
        },
      }
    : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64, // default is 32ms → increase threshold
      },
      immutableCheck: {
        warnAfter: 64,
      },
    }).concat([loggerMiddleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

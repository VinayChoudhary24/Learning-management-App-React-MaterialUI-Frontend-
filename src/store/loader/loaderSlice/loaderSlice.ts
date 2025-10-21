import { createSelector, createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  isLoading: boolean;
}

const initialState: LoaderState = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.isLoading = true;
    },
    hideLoader: (state) => {
      state.isLoading = false;
    },
    toggleLoader: (state) => {
      state.isLoading = !state.isLoading;
    },
  },
});

export const loaderReducer = loaderSlice.reducer;

export const { showLoader, hideLoader, toggleLoader } = loaderSlice.actions;

// --- Memoized Selectors (high perf)
const selectLoaderState = (state: { loader: LoaderState }) => state.loader;

export const selectIsLoading = createSelector(
  selectLoaderState,
  (loader) => loader.isLoading
);

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Middleware } from "@reduxjs/toolkit";
import { hideLoader, showLoader } from "../loader/loaderSlice/loaderSlice";

export const loaderMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    //   if (typeof action.type === "string") {
    if (action.type.endsWith("/pending")) {
      store.dispatch(showLoader());
    } else if (
      action.type.endsWith("/fulfilled") ||
      action.type.endsWith("/rejected")
    ) {
      store.dispatch(hideLoader());
    }
    //   }

    return next(action);
  };

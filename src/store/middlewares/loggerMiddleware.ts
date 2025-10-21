import type { Middleware } from "@reduxjs/toolkit";

/**
 * A scalable and performant logger middleware for Redux Toolkit.
 * Logs actions, Previous State and Next state
 */
export const loggerMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    console.log(
      "DISPATCHING-ACTION " +
        (action as { type?: string })?.type +
        " " +
        new Date().toString()
    );
    console.log("PAYLOAD ", (action as { payload?: unknown })?.payload);
    console.log("PREVIOUS_STATE:", store.getState());
    const result = next(action);
    console.log("NEXT_STATE:", store.getState());
    return result; // important: pass back result from next(action)
  };

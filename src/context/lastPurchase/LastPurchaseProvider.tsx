import { type ReactNode, useState, useEffect } from "react";
import type { EnrollmentResponse } from "../../services/enrollment/types/enrollment.types";
import { LastPurchaseContext } from "./LastPurchaseContext";

const STORAGE_KEY = "lastPurchase";

export const LastPurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [lastPurchase, setLastPurchaseState] =
    useState<EnrollmentResponse | null>(() => {
      try {
        const storedPurchase = localStorage.getItem(STORAGE_KEY);
        return storedPurchase ? JSON.parse(storedPurchase) : null;
      } catch (error) {
        console.error(
          "Failed to parse last purchase from localStorage:",
          error
        );
        return null;
      }
    });

  //   // Derived boolean for easy checking
  //   const hasLastPurchase = lastPurchase !== null;

  // Set last purchase (called after successful enrollment)
  const setLastPurchase = (enrollment: EnrollmentResponse) => {
    setLastPurchaseState(enrollment);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollment));
    } catch (error) {
      console.error("Failed to save last purchase to localStorage:", error);
    }
  };

  // Clear last purchase
  const clearLastPurchase = () => {
    setLastPurchaseState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Sync to localStorage on changes
  useEffect(() => {
    if (lastPurchase) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lastPurchase));
      } catch (error) {
        console.error("Failed to sync last purchase to localStorage:", error);
      }
    }
  }, [lastPurchase]);

  return (
    <LastPurchaseContext.Provider
      value={{
        lastPurchase,
        setLastPurchase,
        clearLastPurchase,
        // hasLastPurchase,
      }}
    >
      {children}
    </LastPurchaseContext.Provider>
  );
};

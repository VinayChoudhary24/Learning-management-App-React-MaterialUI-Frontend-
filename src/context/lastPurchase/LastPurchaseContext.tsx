import { createContext, useContext } from "react";
import type { EnrollmentResponse } from "../../services/enrollment/types/enrollment.types";

interface LastPurchaseContextType {
  lastPurchase: EnrollmentResponse | null;
  setLastPurchase: (enrollment: EnrollmentResponse) => void;
  clearLastPurchase: () => void;
  //   hasLastPurchase: boolean;
}

export const LastPurchaseContext = createContext<
  LastPurchaseContextType | undefined
>(undefined);

export const useLastPurchaseContext = () => {
  const context = useContext(LastPurchaseContext);
  if (!context) {
    throw new Error(
      "useLastPurchaseContext must be used within LastPurchaseProvider"
    );
  }
  return context;
};

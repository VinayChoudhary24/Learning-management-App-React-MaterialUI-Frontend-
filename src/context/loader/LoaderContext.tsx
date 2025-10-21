import { createContext, useContext } from "react";

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  toggleLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined
);

export const useLoaderContext = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoaderContext must be used inside LoaderProvider");
  }
  return context;
};

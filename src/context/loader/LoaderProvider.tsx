import { useState, type ReactNode } from "react";
import { LoaderContext } from "./LoaderContext";

export const LoaderContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  const toggleLoader = () => setIsLoading((prev) => !prev);

  return (
    <LoaderContext.Provider
      value={{ isLoading, showLoader, hideLoader, toggleLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

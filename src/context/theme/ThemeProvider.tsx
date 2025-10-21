import { useState, useMemo, useEffect, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "../../utils/theme/theme";
import { ThemeContext } from "./ThemeContext";
import { GlobalScrollbarStyles } from "../../styles/scrollbar/Scrollbar";

const THEME_STORAGE_KEY = "lms-theme-mode";

// Helper functions for localStorage operations
const getStoredTheme = (): "light" | "dark" => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "dark" ? "dark" : "light";
  } catch (error) {
    console.warn("Failed to get theme from localStorage:", error);
    return "light";
  }
};

const setStoredTheme = (theme: "light" | "dark"): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
    // return "light";
  }
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setMode(storedTheme);
    setIsInitialized(true);
  }, []);

  // Update localStorage whenever theme changes
  useEffect(() => {
    if (isInitialized) {
      setStoredTheme(mode);
    }
  }, [mode, isInitialized]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Prevent flash of wrong theme by not rendering until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {/* SCROLLBAR STYLES */}
        <GlobalScrollbarStyles />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

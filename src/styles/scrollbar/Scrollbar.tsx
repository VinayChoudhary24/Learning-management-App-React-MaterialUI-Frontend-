import { GlobalStyles, type Theme } from "@mui/material";
import React from "react";

export const GlobalScrollbarStyles: React.FC = () => {
  return (
    <GlobalStyles
      styles={(theme: Theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.text.primary} ${theme.palette.background.default}`,
        },
        "::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: theme.palette.background.default,
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.text.primary,
          borderRadius: "10px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.palette.text.secondary,
        },
      })}
    />
  );
};

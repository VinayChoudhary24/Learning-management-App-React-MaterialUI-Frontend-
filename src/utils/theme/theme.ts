import {
  createTheme,
  responsiveFontSizes,
  type ThemeOptions,
} from "@mui/material/styles";

/**
 * getTheme
 * ----------
 * Dynamically generates a Material UI theme based on the selected mode ("light" or "dark").
 *
 * - Controls global colors for background, buttons, and text.
 * - Applies consistent font family across the app.
 * - Ensures smooth switching between light and dark modes.
 * - Responsive typography scaling for headings and body.
 */
const getTheme = (mode: "light" | "dark") => {
  let theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#FCCC18" }, // Buttons Background Color
            secondary: { main: "#6D6D6EB3" }, // Buttons Background Color
            background: {
              default: "#ffffffff", // App background (body)
              paper: "#f9f9f9", // Surfaces (cards, containers, modals)
            },
            text: {
              primary: "#271526", // Main text
              secondary: "#333333", // Subdued text (labels, subtitles)
            },
          }
        : {
            primary: { main: "#E50914" }, // Buttons Background Color
            secondary: { main: "#6D6D6EB3" }, // Buttons Background Color
            background: {
              default: "#141414", // App background (body)
              paper: "#1e1e1e", // Surfaces (cards, containers, modals)
            },
            text: {
              primary: "#E5E5E5", // Main text
              secondary: "#808080", // Subdued text (labels, subtitles)
            },
          }),
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',

      // Headings (base sizes, will scale responsively)
      h1: { fontSize: "3rem", fontWeight: 700, lineHeight: 1.2 }, // 48px
      h2: { fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.3 }, // 36px
      h3: { fontSize: "1.875rem", fontWeight: 600, lineHeight: 1.3 }, // 30px
      h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 }, // 24px
      h5: { fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.4 }, // 20px
      h6: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 }, // 16px

      // Body text
      body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }, // 16px
      body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 }, // 14px

      // Subtitles
      subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 }, // 16px
      subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.5 }, // 14px

      // Buttons
      button: {
        fontSize: "0.875rem", // 14px
        fontWeight: 600,
        // textTransform: "none",
      },

      // Captions & overline
      caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.4 }, // 12px
      overline: {
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  } as ThemeOptions);

  // Enable responsive scaling
  theme = responsiveFontSizes(theme);

  return theme;
};

export default getTheme;

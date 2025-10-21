import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      textAlign="center"
      px={2}
    >
      {/* Big "404" */}
      <Typography
        variant="h1"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: { xs: "5rem", md: "8rem" }, lineHeight: 1 }}
      >
        404
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mt: 2, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
      >
        Oops! Page not found
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>

      {/* Redirect notice */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, fontStyle: "italic" }}
      >
        Redirecting to home page in 3 seconds...
      </Typography>

      {/* Action Buttons */}
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/courses")}
        >
          Explore Courses
        </Button>
      </Box>
    </Box>
  );
}
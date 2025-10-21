import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardMedia,
  useTheme,
  Divider,
  //   useMediaQuery,
} from "@mui/material";
import { CurrencyRupee } from "@mui/icons-material";
import { Star, Clock, Languages, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../services/course/types/course.types";
import { useAppSelector } from "../../store/hooks/react-redux/hook";
import { selectIsUserLoggedIn } from "../../store/auth/authSlice/authSlice";
import { useCartContext } from "../../context/cart/CartContext";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";

export default function CourseDetails() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
  //   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const course = (location.state as { course?: CourseResponse })?.course;
  const { addToCart } = useCartContext();

  // Auth Check
  useAuthCheck();

  const handleAddToCart = (course: CourseResponse) => {
    if (course && course._id) {
      // Add To Cart the course
      addToCart(course);
    } else {
      if (isUserLoggedIn) {
        navigate("/courses");
      } else {
        navigate("/login");
      }
    }
  };

  const handleBuyNow = (course: CourseResponse) => {
    if (course && course._id) {
      // Add To Cart the course and Navigate
      addToCart(course);
      setTimeout(() => {
        navigate("/checkout");
      }, 500);
    } else {
      if (isUserLoggedIn) {
        navigate("/courses");
      } else {
        navigate("/login");
      }
    }
  };

  // Don't render section if no courses
  if (!course) {
    return null;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* HERO SECTION */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            gap: 3,
            backgroundColor: "transparent",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            p: 4,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            },
          }}
        >
          {/* Course Image */}
          <Card
            component={motion.div}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
            sx={{
              flex: 1,
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            }}
          >
            <CardMedia
              component="img"
              image={course.courseImg.url || undefined}
              alt={course.title || "course name"}
              sx={{
                width: "100%",
                height: { xs: 220, md: "100%" },
                objectFit: "cover",
              }}
            />
          </Card>

          {/* Action Buttons */}
          <Stack
            direction="column"
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
            sx={{
              minWidth: { md: 280 },
              backgroundColor: "transparent",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1.5,
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
              onClick={() => handleAddToCart(course)}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1.5,
                fontWeight: 600,
              }}
              onClick={() => handleBuyNow(course)}
            >
              Buy Now
            </Button>
          </Stack>
        </Box>

        {/* DETAILS SECTION */}
        <Box
          sx={{
            mt: 3,
            backgroundColor: "transparent",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            p: 4,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            {course.title}
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            by{" "}
            <strong>
              {course.instructor.firstName} {course.instructor.lastName}
            </strong>{" "}
            | <strong>{course.category.name}</strong>
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Star size={18} fill="gold" color="gold" />
            <Typography variant="body1" color="text.secondary">
              4.8 (1,245 ratings) • {course.duration} hours
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 3,
            }}
          >
            <CurrencyRupee sx={{ fontSize: 20 }} />
            {course.price != null
              ? course.price.toLocaleString("en-IN")
              : "N/A"}
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
            sx={{ lineHeight: 1.7, mb: 4 }}
          >
            {course.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Course Info */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Clock size={18} />
              <Typography variant="body2" color="text.secondary">
                Duration: <strong>{course.duration} hours</strong>
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Layers size={18} />
              <Typography variant="body2" color="text.secondary">
                Level:{" "}
                <strong>
                  {course.level === 1 ? "Beginner" : "Intermediate"}
                </strong>
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Languages size={18} />
              <Typography variant="body2" color="text.secondary">
                Language: <strong>{course.language}</strong>
              </Typography>
            </Stack>
          </Stack>

          {/* Tags */}
          <Stack direction="row" flexWrap="wrap" gap={1.2}>
            {course.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontSize: 13,
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

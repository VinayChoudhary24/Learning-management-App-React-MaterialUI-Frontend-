import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen, Award } from "lucide-react";
import AnimatedRocket from "./AnimatedRocket";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  // console.log("THIS-IS-HERO-COM");
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        color: "paper",
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: "absolute",
          width: "200%",
          height: "200%",
          background: isDark
            ? `radial-gradient(circle, ${alpha(
                "#ffffff",
                0.15
              )} 2px, transparent 2px)`
            : `radial-gradient(circle, #f81919 2px, transparent 2px)`,
          backgroundSize: "30px 30px",
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translate(-50%, -50%) rotate(0deg)" },
            "50%": { transform: "translate(-50%, -50%) rotate(180deg)" },
          },
        }}
      />

      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4}>
          {/* Left Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant={isMobile ? "h3" : "h1"}
                fontWeight="bold"
                color="secondary"
                sx={{ mb: 3 }}
              >
                Learn Skills of the
                <Typography
                  component="span"
                  color="primary"
                  variant={isMobile ? "h3" : "h1"}
                  fontWeight="bold"
                  sx={{ ml: 1, WebkitBackgroundClip: "text" }}
                >
                  Future
                </Typography>
              </Typography>

              <Typography
                variant="h5"
                color={theme.palette.text.secondary}
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Master cutting-edge technologies with expert-led courses. Build
                projects, gain certifications, and advance your career.
              </Typography>

              {/* CTA Button */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRight size={20} />}
                  onClick={() => navigate("/courses")}
                  sx={{
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF5252, #26C6DA)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Learning
                </Button>
              </Box>

              {/* Stats */}
              <Box sx={{ display: "flex", gap: 4, mt: 4, flexWrap: "wrap" }}>
                {[
                  { icon: Users, label: "50K+ Students", value: "50,000+" },
                  { icon: BookOpen, label: "Courses", value: "200+" },
                  { icon: Award, label: "Success Rate", value: "95%" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <stat.icon
                        size={24}
                        color={theme.palette.text.secondary}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          color="secondary"
                          fontWeight="bold"
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AnimatedRocket isMobile={isMobile} />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

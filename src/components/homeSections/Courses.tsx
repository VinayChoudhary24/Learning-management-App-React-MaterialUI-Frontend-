import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  useTheme,
  CardActionArea,
} from "@mui/material";
import { motion, easeOut } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseResponse } from "../../services/course/types/course.types";
import { getCourses } from "../../services/course/courseService";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

export default function Courses() {
  // console.log("THIS-IS-COURSE-COM");
  const theme = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses({
          limit: 10,
          offset: 0,
          status: 1,
          isFeatured: true,
        });

        if (data.success) {
          // setTimeout(() => {
          setCourses(data.courses);
          setLoading(false);
          // }, 2500);
        } else {
          setCourses([]);
          setLoading(false);
        }
      } catch {
        setCourses([]);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (course: CourseResponse) => {
    if (course && course._id) {
      navigate(`/courses/${course._id}`, { state: { course } });
    } else {
      navigate("/");
    }
  };

  // Don't render section if no courses and not loading
  if (!loading && (!courses || courses.length === 0)) {
    return null;
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Featured Courses
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Hand-picked courses from industry experts
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {loading ? (
              // Skeleton Loader
              Array.from(new Array(3)).map((_, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={`skeleton-${index}`}>
                  <motion.div
                    variants={itemVariants}
                    key={`motion-skeleton-${index}`}
                  >
                    <Card
                      sx={{
                        backgroundColor: "transparent",
                        height: "100%",
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                      <CardContent>
                        {/* Course Title */}
                        <Skeleton
                          variant="text"
                          height={32}
                          width="85%"
                          animation="wave"
                          sx={{ mb: 2 }}
                        />

                        {/* Tags */}
                        <Box
                          sx={{
                            mb: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {Array.from(new Array(3)).map((_, tagIndex) => (
                            <Skeleton
                              key={tagIndex}
                              variant="rounded"
                              width={60}
                              height={24}
                              animation="wave"
                            />
                          ))}
                        </Box>

                        {/* Rating and Duration */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Skeleton
                            variant="circular"
                            width={16}
                            height={16}
                            animation="wave"
                          />
                          <Skeleton
                            variant="text"
                            width={80}
                            height={20}
                            animation="wave"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : courses.length > 0 ? (
              courses
                .filter((course) => course.isFeatured)
                .map((course) => (
                  <Grid size={{ xs: 12, md: 4 }} key={course.title}>
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Card
                        sx={{
                          backgroundColor: "transparent",
                          border: `1px solid ${theme.palette.divider}`,
                          height: "100%",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleCourseClick(course)}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={
                              course.courseImg.url ||
                              "https://images.unsplash.com/photo-1713618502575-213ce1b24922?q=80&w=400&h=300&fit=crop"
                            }
                            alt={course.title || "Course"}
                          />
                          <CardContent>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{ mb: 2 }}
                            >
                              {course.title}
                            </Typography>

                            <Box
                              sx={{
                                mb: 2,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              {course.tags.slice(0, 3).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.primary,
                                    border: `1px solid ${theme.palette.text.secondary}`,
                                  }}
                                />
                              ))}
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Star size={16} fill="gold" color="gold" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                4.8 • {course.duration}h
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
            ) : (
              // Empty State
              <Grid size={{ xs: 12 }}>
                <Typography textAlign="center" color="text.secondary">
                  No courses available at the moment.
                </Typography>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

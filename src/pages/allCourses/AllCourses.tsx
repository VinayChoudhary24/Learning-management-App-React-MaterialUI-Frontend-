import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  useTheme,
  Pagination,
  Stack,
  type SelectChangeEvent,
  useMediaQuery,
  CardActionArea,
} from "@mui/material";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { CourseResponse } from "../../services/course/types/course.types";
import { getCourses } from "../../services/course/courseService";
import { CurrencyRupee } from "@mui/icons-material";
import type {
  CategoryResponse,
  CoursesQuery,
} from "../../services/category/types/category.types";
import { getCategories } from "../../services/category/categoryService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";
// import type { BreadcrumbItem } from "../../components/breadCrumbsNav/BreadCrumbsNav";

export default function AllCourses() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { categoryId } = (location.state as { categoryId?: string }) || {};

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  //   const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [page, setPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 10;

  // BREADCRUMBS
  // const { setBreadcrumbs } = useOutletContext<{
  //   setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
  // }>();

  // useEffect(() => {
  //   setBreadcrumbs([{ label: "Home", path: "/" }, { label: "All Courses" }]);
  // }, [setBreadcrumbs]);

  // Auth Check
  useAuthCheck();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories({
          isLimitedData: true,
        });

        if (data.success) {
          setCategories(data.categories || []);
          setCategoriesLoading(false);
        } else {
          setCategories([]);
          setCategoriesLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses whenever filters or page changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const query: CoursesQuery = {
          limit: coursesPerPage,
          offset: (page - 1) * coursesPerPage,
          status: 1,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        };

        // Send category _id instead of name
        if (selectedCategory) {
          query.category = selectedCategory;
        }

        const data = await getCourses(query);

        if (data.success) {
          // setTimeout(() => {
          setCourses(data.courses);
          setTotalCourses(data.total || data.courses.length);
          setLoading(false);
          // }, 500);
        } else {
          setCourses([]);
          setTotalCourses(0);
          setLoading(false);
        }
      } catch {
        setCourses([]);
        setTotalCourses(0);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, priceRange, page]);

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setPage(1);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  const handleCourseClick = (course: CourseResponse) => {
    if (course && course._id) {
      navigate(`/courses/${course._id}`, { state: { course } });
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* LEFT FILTER PANEL */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: "transparent",
                position: "sticky",
                top: 80,
                borderRadius: 3,
              }}
            >
              <Typography
                color="text.secondary"
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Filters
              </Typography>

              {/* Category Filter with Skeleton */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                {categoriesLoading ? (
                  <>
                    <Skeleton
                      variant="text"
                      width="30%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={56}
                      sx={{ borderRadius: 1 }}
                    />
                  </>
                ) : (
                  <>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem
                          key={cat._id}
                          value={cat._id}
                          color="text.secondary"
                        >
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </FormControl>

              {/* Price Filter */}
              <Typography color="text.secondary" gutterBottom>
                Price Range (₹)
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                min={0}
                max={50000}
                step={1000}
                valueLabelDisplay="auto"
                sx={{ color: theme.palette.primary.main }}
              />
              <Typography variant="body2" color="text.secondary">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </Typography>
            </Card>
          </Grid>

          {/* RIGHT COURSE LIST */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Empty State - Show message but keep filters visible */}
            {!loading && courses.length === 0 ? (
              <Box sx={{ py: 10, textAlign: "center" }}>
                <Typography variant="h5" color="text.secondary">
                  No courses found.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Try adjusting your filters to see more results.
                </Typography>
              </Box>
            ) : (
              <>
                <Stack spacing={3}>
                  {loading
                    ? Array.from(new Array(coursesPerPage)).map((_, index) => (
                        <Card
                          key={`skeleton-${index}`}
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            backgroundColor: "transparent",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <Skeleton
                            variant="rectangular"
                            width={isMobile ? "100%" : 200}
                            height={220}
                            sx={{ flexShrink: 0 }}
                          />
                          <CardContent sx={{ flex: 1 }}>
                            <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
                            <Skeleton width="50%" height={20} sx={{ mb: 2 }} />
                            <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                            <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
                            <Skeleton width="20%" height={20} sx={{ mb: 1 }} />
                            <Skeleton width="10%" height={20} />
                          </CardContent>
                        </Card>
                      ))
                    : courses.map((course) => (
                        <Card
                          key={course._id}
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            backgroundColor: "transparent",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <CardActionArea
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: "stretch",
                              textAlign: "left",
                            }}
                            onClick={() => handleCourseClick(course)}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                width: { xs: "100%", sm: 220 },
                                height: { xs: 180, sm: "auto" },
                                objectFit: "cover",
                              }}
                              image={
                                course.courseImg?.url ||
                                "https://images.unsplash.com/photo-1713618502575-213ce1b24922?q=80&w=400&h=300&fit=crop"
                              }
                              alt={course.title || "course name"}
                            />
                            <CardContent sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ mb: 1 }}
                              >
                                {course.title}
                              </Typography>

                              <Box
                                sx={{
                                  mb: 1.5,
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

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                <strong>{course.category?.name}</strong>
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Instructor:{" "}
                                <strong>
                                  {course.instructor?.firstName}{" "}
                                  {course.instructor?.lastName}
                                </strong>
                              </Typography>

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

                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <CurrencyRupee sx={{ fontSize: 18 }} />
                                {course.price != null
                                  ? course.price.toLocaleString("en-IN")
                                  : "N/A"}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}
                </Stack>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 5,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size="medium"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: "12px",
                          border: `1px solid ${theme.palette.divider}`,
                          "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

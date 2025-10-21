import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Skeleton,
  CardActionArea,
} from "@mui/material";
import { motion, easeOut } from "framer-motion";
import { useEffect, useState } from "react";
import type { CategoryResponse } from "../../services/category/types/category.types";
import { getCategories } from "../../services/category/categoryService";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

export default function Categories() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();

        if (data?.success) {
          // setTimeout(() => {
          // console.log("data.categories", data.categories);
          setCategories(data.categories);
          setLoading(false);
          // }, 1500);
        } else {
          setCategories([]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate("/courses", { state: { categoryId } });
  };

  // Don't render section if no courses and not loading
  if (!loading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Explore Categories
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Discover courses across various domains and skill levels
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {loading ? (
              // Skeleton Loader
              Array.from(new Array(6)).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${index}`}>
                  <motion.div
                    variants={itemVariants}
                    key={`motion-skeleton-${index}`}
                  >
                    <Card
                      sx={{
                        backgroundColor: "transparent",
                        height: "100%",
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                      <CardContent>
                        <Skeleton
                          variant="text"
                          height={32}
                          width="70%"
                          animation="wave"
                          sx={{ mb: 2 }}
                        />
                        <Skeleton
                          variant="text"
                          height={20}
                          width="90%"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          height={20}
                          width="80%"
                          animation="wave"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      sx={{
                        backgroundColor: "transparent",
                        height: "100%",
                        border: `1px solid ${theme.palette.divider}`,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleCategoryClick(category._id)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            category.image ||
                            "https://images.unsplash.com/photo-1713618502575-213ce1b24922?q=80&w=400&h=300&fit=crop"
                          }
                          alt={category.name || "Category"}
                        />
                        <CardContent>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                          >
                            {category.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
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
                  No categories available at the moment.
                </Typography>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

import {
  Box,
  Modal,
  Paper,
  InputBase,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  Fade,
  Backdrop,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CourseResponse } from "../../services/course/types/course.types";
import { getCourses } from "../../services/course/courseService";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search courses...",
}: SearchBarProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounced API call
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        const data = await getCourses({
          limit: 10,
          offset: 0,
          status: 1,
          searchTerm,
        });
        if (data.success) {
          setSearchResults(data.courses);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (course: CourseResponse) => {
    if (course && course._id) {
      navigate(`/courses/${course._id}`, { state: { course } });
    } else {
      navigate("/");
    }
    handleClose();
  };

  return (
    <>
      {/* Search Icon Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <SearchIcon />
      </IconButton>

      {/* Search Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: { xs: "10%", sm: "15%" },
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: "90%", sm: "80%", md: "600px" },
              maxHeight: { xs: "80vh", sm: "70vh" },
              display: "flex",
              flexDirection: "column",
              outline: "none",
            }}
          >
            <Paper
              elevation={24}
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(30, 30, 30, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Search Input Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <SearchIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: 28,
                  }}
                />
                <InputBase
                  placeholder={placeholder}
                  inputRef={inputRef}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{
                    ml: 2,
                    flex: 1,
                    fontSize: "1.1rem",
                    color: theme.palette.text.primary,
                  }}
                  autoFocus
                />
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                )}
                <IconButton
                  onClick={handleClose}
                  sx={{
                    ml: 1,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              {/* Results Section */}
              <Box
                sx={{
                  maxHeight: { xs: "50vh", sm: "400px" },
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1a1a1a" : "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#4a4a4a" : "#888",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#5a5a5a" : "#555",
                    },
                  },
                }}
              >
                {searchTerm.trim() === "" ? (
                  <Box
                    sx={{
                      py: 8,
                      textAlign: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                    <Typography variant="body1">
                      Start typing to search courses...
                    </Typography>
                  </Box>
                ) : loading ? (
                  // Skeleton Loader Section
                  <List sx={{ py: 1 }}>
                    {Array.from(new Array(5)).map((_, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          mx: 1,
                          borderRadius: 2,
                          py: 1.5,
                        }}
                      >
                        <ListItemAvatar>
                          <Skeleton
                            variant="rectangular"
                            width={70}
                            height={50}
                            sx={{ borderRadius: 1.5, marginRight: "5px" }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            mt: 0,
                          }}
                          slotProps={{
                            primary: { component: "span" },
                            secondary: { component: "span" },
                          }}
                          primary={
                            <Skeleton
                              variant="text"
                              width="80%"
                              height={24}
                              sx={{ borderRadius: 1 }}
                            />
                          }
                          secondary={
                            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                              {[1, 2, 3].map((tag) => (
                                <Skeleton
                                  key={tag}
                                  variant="rounded"
                                  width={40 + tag * 10}
                                  height={18}
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : searchResults.length === 0 ? (
                  <Box
                    sx={{
                      py: 8,
                      textAlign: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Typography variant="body1">No courses found</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Try searching different course
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ py: 1 }}>
                    {searchResults.map((course) => (
                      <ListItem
                        key={course._id}
                        sx={{
                          cursor: "pointer",
                          mx: 1,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.04)",
                            transform: "translateX(4px)",
                          },
                        }}
                        onClick={() => handleResultClick(course)}
                      >
                        <ListItemAvatar>
                          <Box
                            component="img"
                            src={
                              course.courseImg.url ||
                              "https://images.unsplash.com/photo-1713618502575-213ce1b24922?q=80&w=400&h=300&fit=crop"
                            }
                            alt={course.title || "course"}
                            sx={{
                              marginRight: "5px",
                              width: 70,
                              height: 50,
                              borderRadius: 1.5,
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            mt: 0,
                          }}
                          slotProps={{
                            primary: { component: "span" },
                            secondary: { component: "span" },
                          }}
                          primary={
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{
                                color: theme.palette.text.primary,
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {course.title}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                                mt: 0.5,
                              }}
                            >
                              {course.tags.slice(0, 3).map((tag) => (
                                <Typography
                                  key={tag}
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    backgroundColor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "rgba(0, 0, 0, 0.05)",
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: 1,
                                  }}
                                >
                                  #{tag}
                                </Typography>
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

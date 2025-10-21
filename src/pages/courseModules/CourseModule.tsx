/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Stack,
  Skeleton,
  useTheme,
  ListItemButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import ReactPlayer from "react-player";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";
// import { clearAuth } from "../../store/auth/service/localStorage";
import { getCourseModules } from "../../services/course/courseService";
import { useParams } from "react-router-dom";
import type {
  CourseModuleResponse,
  Lesson,
} from "../../services/course/types/course.types";
import { verifyCourseAuth } from "../../store/auth/service/authService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import { logoutAsync } from "../../store/auth/authEffects/authEffects";

const CourseModules: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseModuleResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModuleDescription, setSelectedModuleDescription] = useState<
    string | null
  >(null);
  const theme = useTheme();
  //   const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useAuthCheck();

  useEffect(() => {
    const checkAndFetch = async () => {
      if (!courseId) {
        // clearAuth();
        // navigate("/login");
        await dispatch(logoutAsync());
        return;
      }
      setLoading(true);
      try {
        const isValid = await verifyCourseAuth(courseId);
        if (!isValid) {
          await dispatch(logoutAsync());
          return;
        }
        const res = await getCourseModules(courseId);
        if (res.success) {
          setCourseData(res.course);

          // Auto-select first module + lesson
          if (
            res.course.modules?.length &&
            res.course.modules[0].lessons?.length
          ) {
            setSelectedLesson(res.course.modules[0].lessons[0]);
            setSelectedModuleDescription(res.course.modules[0].description);
            setExpandedModules([res.course.modules[0]._id]);
          }
        } else {
          await dispatch(logoutAsync());
        }
      } catch (error) {
        console.error("Error checking auth or fetching course:", error);
        await dispatch(logoutAsync());
      } finally {
        setLoading(false);
      }
    };

    checkAndFetch();
  }, [courseId, dispatch]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lesson: Lesson, moduleDescription: string) => {
    setSelectedLesson(lesson);
    setSelectedModuleDescription(moduleDescription);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        bgcolor: theme.palette.background.default,
        borderRadius: 3,
        boxShadow: 3,
        m: 2,
      }}
    >
      {/* Left Sidebar: Modules & Lessons */}
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          flexShrink: 0,
          borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
          borderBottom: {
            xs: `1px solid ${theme.palette.divider}`,
            md: "none",
          },
          overflowY: "auto",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          {loading ? (
            <Skeleton width="80%" />
          ) : (
            courseData?.title || "Course Title"
          )}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          // Skeleton for sidebar
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="90%" height={30} />
                {Array.from({ length: 2 }).map((__, j) => (
                  <Skeleton key={j} variant="text" width="70%" sx={{ ml: 2 }} />
                ))}
              </Box>
            ))}
          </>
        ) : courseData &&
          courseData.modules &&
          courseData.modules.length > 0 ? (
          <List>
            {courseData.modules.map((moduleItem) => (
              <Box key={moduleItem._id}>
                <ListItemButton
                  onClick={() => toggleModule(moduleItem._id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: expandedModules.includes(moduleItem._id)
                      ? theme.palette.action.selected
                      : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600}>
                        {moduleItem.name}
                      </Typography>
                    }
                  />
                  <IconButton edge="end">
                    {expandedModules.includes(moduleItem._id) ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </ListItemButton>
                <Collapse
                  in={expandedModules.includes(moduleItem._id)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {moduleItem.lessons.map((lesson) => (
                      <ListItemButton
                        key={lesson._id}
                        onClick={() =>
                          handleLessonClick(lesson, moduleItem.description)
                        }
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor:
                            selectedLesson?._id === lesson._id
                              ? theme.palette.action.selected
                              : "transparent",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.secondary">
                              {lesson.title}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        ) : (
          <Typography
            textAlign="center"
            variant="body2"
            color="text.secondary"
            mt={4}
          >
            No modules found for this course.
          </Typography>
        )}
      </Box>

      {/* Right Content: Lesson Details & Video */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          bgcolor: theme.palette.background.default,
        }}
      >
        {loading ? (
          // Skeleton for main content
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="90%" height={20} />
            {/* <Skeleton variant="text" width="85%" height={20} /> */}
            <Skeleton variant="rectangular" height={400} />
          </Stack>
        ) : selectedLesson ? (
          <>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {selectedLesson.title}
            </Typography>
            {selectedModuleDescription && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {selectedModuleDescription}
              </Typography>
            )}

            <Box
              sx={{
                position: "relative",
                pt: "56.25%", // 16:9 aspect ratio
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 4,
                mb: 3,
              }}
            >
              <ReactPlayer
                src={selectedLesson.videoUrl}
                controls
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {courseData?.description}
            </Typography>
          </>
        ) : (
          <Typography
            textAlign="center"
            variant="h6"
            color="text.secondary"
            mt={10}
          >
            Select a lesson from the left to start learning!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CourseModules;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Divider,
  Skeleton,
  useTheme,
  CardActionArea,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import dayjs from "dayjs";
import { getEnrollments } from "../../services/enrollment/enrollmentService";
import { useAppDispatch } from "../../store/hooks/react-redux/hook";
import { hideLoader } from "../../store/loader/loaderSlice/loaderSlice";
import { formatCurrency } from "../../utils/currency/formatCurrency";
import type { Course } from "../../services/course/types/course.types";
import type { Payment } from "../../services/payment/types/payment.types";
import { getStatusChip } from "../../utils/paymentStatus/paymentStatusHelper";
import { getCardInfoDisplay } from "../../utils/cardBrand/cardBrandHelper";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";
import { useNavigate } from "react-router-dom";

const MyCourses: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const theme = useTheme();

  const dispatch = useAppDispatch();

  useAuthCheck();

  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  // Fetch Enrollments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getEnrollments();
        if (res.success) {
          const enrollments = res.response || [];

          // Flatten all courses from enrollmentDetails arrays
          const allCourses = enrollments.flatMap((enroll: any) =>
            enroll.enrollmentDetails.map((course: any) => ({
              _id: course._id,
              title: course.title,
              price: course.price,
              duration: course.duration,
              courseImg: course.courseImg,
              instructor: course.instructor,
            }))
          );
          setCourses(allCourses);

          // Map payments (1 per enrollment)
          const allPayments = enrollments
            .filter((enroll: any) => enroll.paymentId)
            .map((enroll: any) => ({
              _id: enroll.paymentId._id,
              status: enroll.paymentId.status,
              gateway: enroll.paymentId.gateway,
              taxes: enroll.paymentId.taxes ?? enroll.taxes,
              discountAmount:
                enroll.paymentId.discountAmount ?? enroll.discountAmount,
              amount: enroll.paymentId.amount ?? enroll.totalAmount,
              updatedAt: enroll.paymentId.updatedAt,
              cardInfo: enroll.paymentId.cardInfo,
              courses: enroll.enrollmentDetails.map((course: any) => ({
                title: course.title,
                price: course.price,
              })),
            }));

          setPayments(allPayments);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const toggleRow = (id: string) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const handleMyCourseClick = (course: any) => {
    if (course && course._id) {
      navigate(`/my-courses/course/${course._id}`, { state: { course } });
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ py: 2, mx: 1 }}>
      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
          "& .MuiTabs-indicator": { height: 4, borderRadius: 2 },
        }}
      >
        <Tab label="My Courses" />
        <Tab label="Payment History" />
      </Tabs>

      {/* Tab 1: Courses */}
      {tabValue === 0 && (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {loading ? (
            // Show skeleton loader
            Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton width="80%" height={28} />
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="50%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <CardActionArea onClick={() => handleMyCourseClick(course)}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.courseImg?.url || ""}
                      alt={course.title || "course name"}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Instructor: {course.instructor.firstName}{" "}
                        {course.instructor.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {course.duration} hrs
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography textAlign="center" width="100%">
              No enrolled courses found.
            </Typography>
          )}
        </Grid>
      )}

      {/* Tab 2: Payments */}
      {tabValue === 1 && (
        <TableContainer
          component={Paper}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            mt: 2,
            // borderRadius: 3,
            // boxShadow: 3,
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 850,
              // Target all cells for base styling
              "& .MuiTableCell-root": {
                paddingY: 1,
                paddingLeft: 3,
                // paddingRight: 0.5,
              },
              // Override the last cell in any row for better edge spacing
              "& th:last-child, & td:last-child": {
                paddingRight: 1, // Restore standard right padding (16px)
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell>
                  <b>Gateway</b>
                </TableCell>
                <TableCell>
                  <b>Card</b>
                </TableCell>
                <TableCell>
                  <b>Taxes</b>
                </TableCell>
                <TableCell>
                  <b>Discount</b>
                </TableCell>
                <TableCell>
                  <b>Amount</b>
                </TableCell>
                <TableCell>
                  <b>Updated</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment: any) => (
                  <React.Fragment key={payment._id}>
                    <TableRow
                      sx={{
                        // "& > *": { borderBottom: "unset" },
                        transition: "background 0.2s",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                      }}
                    >
                      <TableCell>
                        <IconButton onClick={() => toggleRow(payment._id)}>
                          {expandedRows.includes(payment._id) ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{getStatusChip(payment.status)}</TableCell>
                      <TableCell>{payment.gateway}</TableCell>
                      <TableCell>
                        {getCardInfoDisplay({ cardInfo: payment.cardInfo })}
                      </TableCell>

                      <TableCell>{formatCurrency(payment.taxes)}</TableCell>
                      <TableCell>
                        {formatCurrency(payment.discountAmount)}
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        {dayjs(payment.updatedAt * 1000).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expandable Row */}
                    <TableRow>
                      <TableCell colSpan={9} sx={{ py: 0 }}>
                        <Collapse
                          in={expandedRows.includes(payment._id)}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ m: 2 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              Purchased Courses
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {payment.courses.map(
                              (course: any, index: number) => (
                                <Stack
                                  key={index}
                                  direction="row"
                                  justifyContent="space-between"
                                  sx={{
                                    mb: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    backgroundColor: "rgba(0,0,0,0.03)",
                                  }}
                                >
                                  <Typography>{course.title}</Typography>
                                  <Typography fontWeight={600}>
                                    {formatCurrency(course.price)}
                                  </Typography>
                                </Stack>
                              )
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyCourses;

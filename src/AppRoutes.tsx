import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/rootLayout/RootLayout";
import LoginPage from "./pages/login/Login";
import NotFound from "./pages/notFound/NotFound";
import RegisterPage from "./pages/register/Register";
import HomePage from "./pages/home/Home";
import GoogleAuthResult from "./pages/googleAuth/GoogleAuthResult";
import AllCourses from "./pages/allCourses/AllCourses";
import MyCourses from "./pages/myCourses/MyCourses";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import CourseDetails from "./pages/courseDetails/CourseDetails";
import ContactUs from "./pages/contactUS/ContactUs";
import Checkout from "./pages/stripeCheckout/Checkout";
import Receipt from "./pages/receipt/Receipt";
import CourseModules from "./pages/courseModules/CourseModule";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import MyProfile from "./pages/myProfile/MyProfile";

const ROUTES = {
  HOME: {
    PATH: "/",
    CHILDREN: {
      CONTACT: "contact",
      LOGIN: "login",
      REGISTER: "register",
      ALL_COURSES: "courses",
      GOOGLE_AUTH: "auth/google/oauth2/result",
      MY_COURSES: "my-courses",
      MY_PROFILE: "profile",
      COURSE_MODULE: "my-courses/course/:courseId",
      CHECKOUT: "checkout",
      COURSE_DETAILS: "courses/:courseId",
      RECEIPT: "receipt",
      RESET_PASSWORD: "reset-password/:token",
    },
  },
};

const router = createBrowserRouter([
  {
    path: ROUTES.HOME.PATH,
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <>
            <HomePage />
          </>
        ),
      },
      // USER COURSES AND PAYMENT DETAILS
      {
        path: ROUTES.HOME.CHILDREN.MY_COURSES,
        element: (
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        ),
      },
      // USER COURSES AND PAYMENT DETAILS
      {
        path: ROUTES.HOME.CHILDREN.MY_PROFILE,
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      // USER COURSE MODULES
      {
        path: ROUTES.HOME.CHILDREN.COURSE_MODULE,
        element: (
          <ProtectedRoute>
            <CourseModules />
          </ProtectedRoute>
        ),
      },
      // USER CHECKOUT
      {
        path: ROUTES.HOME.CHILDREN.CHECKOUT,
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      // USER PAYMENT RECEIPT
      {
        path: ROUTES.HOME.CHILDREN.RECEIPT,
        element: (
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        ),
      },
      // AUTH
      { path: ROUTES.HOME.CHILDREN.LOGIN, element: <LoginPage /> },
      { path: ROUTES.HOME.CHILDREN.REGISTER, element: <RegisterPage /> },
      // EXPLORE COURSES
      { path: ROUTES.HOME.CHILDREN.ALL_COURSES, element: <AllCourses /> },
      // COURSE DETAILS
      { path: ROUTES.HOME.CHILDREN.COURSE_DETAILS, element: <CourseDetails /> },
      // GOOGLE OAUTH2
      {
        path: ROUTES.HOME.CHILDREN.GOOGLE_AUTH,
        element: <GoogleAuthResult />,
      },
      // CONTACT US
      { path: ROUTES.HOME.CHILDREN.CONTACT, element: <ContactUs /> },
      // RESET USER PASSWORD
      { path: ROUTES.HOME.CHILDREN.RESET_PASSWORD, element: <ResetPassword /> },
    ],
  },
]);

export default router;

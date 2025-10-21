import { Box } from "@mui/material";
import Hero from "../../components/homeSections/HeroSection";
import Categories from "../../components/homeSections/Categories";
import Courses from "../../components/homeSections/Courses";
import CTA from "../../components/homeSections/CTA";
// import { useEffect } from "react";
// import { verifyToken } from "../../store/auth/service/authService";
// import { useEffect } from "react";
// import { useAppDispatch } from "../../store/hooks/react-redux/hook";
// import { logoutAsync } from "../../store/auth/authEffects/authEffects";
import { useAuthCheck } from "../../hooks/auth/useAuthCheck";
// import { showLoader } from "../../store/loader/loaderSlice/loaderSlice";

export default function HomePage() {
  // console.log("THIS-IS-HOME-COM");
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(showLoader());
  //   // console.log("SHOWING-LOADERRRRR===>>>>>");
  // }, [dispatch]);

  useAuthCheck();
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem("token");
  //     console.log("token", token);

  //     // if no token → redirect immediately
  //     if (!token) {
  //       dispatch(logoutAsync());
  //       return;
  //     }

  //     // verify with backend
  //     const isValid = await verifyToken();
  //     console.log("isTokenValid", isValid);
  //     if (!isValid) {
  //       dispatch(logoutAsync());
  //     }
  //   };

  // checkAuth();
  // }, [dispatch]);

  return (
    <Box>
      <Hero />
      <Categories />
      <Courses />
      <CTA />
    </Box>
  );
}

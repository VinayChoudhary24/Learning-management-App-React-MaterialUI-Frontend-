// import { useEffect, useRef } from "react";
// import { useAppDispatch } from "../../store/hooks/react-redux/hook";
// import { logoutAsync } from "../../store/auth/authEffects/authEffects";
// import { verifyCourseAuth } from "../../store/auth/service/authService";

// export const useCourseAuthCheck = () => {
//   const dispatch = useAppDispatch();
//   const hasChecked = useRef(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // Avoid multiple executions
//       if (hasChecked.current) return;
//       hasChecked.current = true;

//       try {
//         const isValid = await verifyCourseAuth(id);
//         if (!isValid) {
//           console.warn("Invalid Auth — logging out...");
//           await dispatch(logoutAsync());
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         await dispatch(logoutAsync());
//       }
//     };

//     checkAuth();
//   }, [dispatch]);
// };

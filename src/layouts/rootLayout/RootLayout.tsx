import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import loaderGif from "../../components/loader/d.gif";
import { useAppSelector } from "../../store/hooks/react-redux/hook";
import { selectIsLoading } from "../../store/loader/loaderSlice/loaderSlice";
// import BreadcrumbsNav, {
// type BreadcrumbItem,
// } from "../../components/breadCrumbsNav/BreadCrumbsNav";
// import { useState } from "react";

export default function RootLayout() {
  const isLoading = useAppSelector(selectIsLoading);

  // const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumbs */}
      {/* {breadcrumbs.length > 1 && <BreadcrumbsNav breadcrumbs={breadcrumbs} />} */}

      {/* Outlet renders child routes */}
      <Box flexGrow={1} p={0}>
        <Outlet />
        {/* <Outlet context={{ setBreadcrumbs }} /> */}
      </Box>

      {/* Footer */}
      <Footer />

      {/* Full-page loader overlay */}
      {isLoading && (
        <Box
          position="fixed" // fixed to cover the whole viewport
          top={0}
          left={0}
          width="100%"
          // height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          // border="1px solid red"
          minHeight="100vh"
          bgcolor="#ffffff"
          zIndex={9999}
        >
          <Box
            component="img"
            src={loaderGif}
            alt="Loading..."
            sx={{
              width: { xs: "120px", sm: "150px", md: "200px" },
              height: "auto",
            }}
          />
        </Box>
      )}
    </Box>
  );
}

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  // Tabs,
  // Tab,
  Box,
  Switch,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
  Button,
  Badge,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppsIcon from "@mui/icons-material/Apps";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeContext } from "../../context/theme/ThemeContext";
import { useCartContext } from "../../context/cart/CartContext";
import { logoutAsync } from "../../store/auth/authEffects/authEffects";
import {
  useAppDispatch,
  useAppSelector,
} from "../../store/hooks/react-redux/hook";
import SearchBar from "../searchBar/SearchBar";
import {
  selectIsUserLoggedIn,
  selectUserDetails,
} from "../../store/auth/authSlice/authSlice";
import CartModal from "../cartModal/CartModal";

export default function Navbar() {
  // console.log("THIS-IS-NAVBAR-COM");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const isUserLoggedIn = useAppSelector(selectIsUserLoggedIn);
  const userDetails = useAppSelector(selectUserDetails);

  // console.log("isUserLoggedIn", isUserLoggedIn);
  // console.log("userDetails", userDetails);
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleTheme } = useThemeContext();
  const { cartCount } = useCartContext();

  // Hide cart if on Checkout
  const showCartIcon = location.pathname !== "/checkout";

  const onLogout = () => {
    // console.log("CALL REDUX LOGOUT");
    dispatch(logoutAsync());
  };

  // Tabs config
  // const tabs = [{ label: "Explore Courses", path: "/courses" }];

  // Detect active tab by current route
  // const currentTab = tabs.findIndex((tab) =>
  //   location.pathname.startsWith(tab.path)
  // );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileMenuEl, setProfileMenuEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
  //   navigate(tabs[newValue].path);
  // };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuEl(null);
  };

  // Utility: generate initials if no profilePic
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "User";

    const firstInitial = firstName?.trim()?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.trim()?.[0]?.toUpperCase() || "";

    if (firstInitial && lastInitial) {
      return firstInitial + lastInitial;
    }

    return firstInitial || lastInitial || "User";
  };

  const handleCartModal = () => {
    handleMenuClose();
    setOpen(true);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      // sx={{
      //   backgroundColor: "transparent", // fully transparent
      //   borderBottom: `1px solid ${theme.palette.divider}`, // adaptive border
      // }}
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(20, 20, 20, 0.85)" // #141414 with 85% opacity
            : "rgba(255, 255, 255, 0.85)", // #ffffff with 85% opacity
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      color="inherit"
      enableColorOnDark
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side: Icon + App Name */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {/* Home */}
          {/* <HomeIcon color="primary" /> */}
          <Typography variant="h6" fontWeight="bold" color="primary">
            DEFI
          </Typography>
        </Box>
        {/* Right Side */}
        {isMobile ? (
          <>
            {/* Mobile: Search + Hamburger Menu */}
            <Box display="flex" alignItems="center" gap={1}>
              <SearchBar />
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AppsIcon />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* {tabs.map((tab) => (
                <MenuItem
                  key={tab.path}
                  onClick={() => {
                    navigate(tab.path);
                    handleMenuClose();
                  }}
                >
                  {tab.label}
                </MenuItem>
              ))} */}
              <MenuItem onClick={() => navigate("/courses")}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    py: 1,
                    fontWeight: 400,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                >
                  Explore Courses
                </Button>
              </MenuItem>

              {showCartIcon && (
                <MenuItem onClick={handleCartModal}>
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                  <Typography sx={{ ml: 1 }}>Cart</Typography>
                </MenuItem>
              )}

              {isUserLoggedIn ? (
                <MenuItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    onClick={handleProfileMenuOpen}
                  >
                    <Avatar
                      src={userDetails?.profileImg?.url || undefined}
                      alt={
                        `${userDetails?.firstName || ""} ${
                          userDetails?.lastName || ""
                        }`.trim() || "User"
                      }
                      sx={{ width: 30, height: 30 }}
                    >
                      {!userDetails?.profileImg?.url &&
                        getInitials(
                          userDetails?.firstName,
                          userDetails?.lastName
                        )}
                    </Avatar>
                    <Typography>{userDetails?.firstName}</Typography>
                  </Box>
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
                  <MenuItem onClick={() => navigate("/signup")}>
                    Signup
                  </MenuItem>
                </>
              )}

              <MenuItem>
                <Box display="flex" alignItems="center" gap={1}>
                  {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleTheme}
                    color="default"
                  />
                </Box>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={3}>
            {/* Search Section */}
            <SearchBar />
            {/* Courses Tab */}
            {/* <Tabs
              value={currentTab === -1 ? false : currentTab}
              onChange={handleTabChange}
              // textColor="inherit"
              // indicatorColor="secondary"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.path}
                  label={tab.label}
                  sx={{
                    borderRadius: 5,
                    backgroundColor: "#6D6D6EB3",
                    color: "white",

                    "&:hover": {
                      backgroundColor: "secondary.light",
                      // transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Tabs> */}

            {/* Courses Tab */}
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1,
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate("/courses")}
            >
              Explore Courses
            </Button>

            {/* Cart */}
            {showCartIcon && (
              <IconButton color="inherit" onClick={handleCartModal}>
                <AnimatePresence mode="popLayout">
                  {cartCount > 0 && (
                    <motion.div
                      key={cartCount} // re-animates when count changes
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    >
                      <Badge badgeContent={cartCount} color="secondary">
                        <ShoppingCartIcon />
                      </Badge>
                    </motion.div>
                  )}
                  {cartCount === 0 && <ShoppingCartIcon />}{" "}
                  {/* no badge if empty */}
                </AnimatePresence>
              </IconButton>
            )}

            {/* Auth Section */}
            {isUserLoggedIn ? (
              <Box display="flex" alignItems="center" gap={1}>
                {/* <Typography variant="body1" fontWeight={500}>
                  {username}
                </Typography> */}
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    src={userDetails?.profileImg?.url || undefined}
                    alt={
                      `${userDetails?.firstName || ""} ${
                        userDetails?.lastName || ""
                      }`.trim() || "User"
                    }
                    sx={{ width: 35, height: 35 }}
                  >
                    {!userDetails?.profileImg?.url &&
                      getInitials(
                        userDetails?.firstName,
                        userDetails?.lastName
                      )}
                  </Avatar>
                </IconButton>
              </Box>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate("/register")}
                >
                  Signup
                </Button>
              </Box>
            )}

            {/* Theme Switch */}
            <Box display="flex" alignItems="center" gap={1}>
              {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                color="default"
              />
            </Box>
          </Box>
        )}
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuEl}
        open={Boolean(profileMenuEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleProfileMenuClose();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/my-courses");
            handleProfileMenuClose();
          }}
        >
          My Courses
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            navigate("/settings");
            handleProfileMenuClose();
          }}
        >
          Settings
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* Cart Modal */}
      <CartModal open={open} onClose={() => setOpen(false)} />
    </AppBar>
  );
}

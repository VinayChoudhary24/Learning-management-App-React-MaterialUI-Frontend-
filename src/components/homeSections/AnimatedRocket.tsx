import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const AnimatedRocket = ({ isMobile }: { isMobile: boolean }) => {
  // console.log("THIS-IS-ROCKET-COM");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const rocketColor = isDark ? "#ffffff" : "#ff4d4d";

  return (
    <div
      style={{
        display: "flex",
        gap: isMobile ? 40 : 80,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Left Small Rocket */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          rotate: [0, -8, 8, 0],
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Rocket size={60} color={rocketColor} strokeWidth={1.5} />
      </motion.div>

      {/* Main Big Rocket */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          opacity: { duration: 1, delay: 0.3 },
        }}
        whileHover={{
          rotate: [0, -10, 10, 0],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.9, rotate: -15 }}
      >
        <Rocket
          size={isMobile ? 100 : 140}
          color={rocketColor}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Right Small Rocket */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        whileHover={{
          rotate: [0, -8, 8, 0],
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Rocket size={60} color={rocketColor} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
};

export default AnimatedRocket;

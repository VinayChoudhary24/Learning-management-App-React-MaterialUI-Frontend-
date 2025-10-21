import { CircularProgress, IconButton, useTheme } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { memo } from "react";

type VerifyButtonProps = {
  //   label?: string;
  verified: boolean;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

function VerifyButton({
  //   label,
  verified,
  onClick,
  loading,
  disabled,
}: VerifyButtonProps) {
  const theme = useTheme();
  // console.log("loading", loading);
  // console.log("verified", verified);
  // console.log("disabled", disabled);
  return (
    // <Tooltip title={verified ? `${label} Verified` : `Verify ${label}`}>
    <IconButton
      onClick={onClick}
      size="small"
      disabled={loading || disabled}
      sx={{
        ml: 1,
        borderRadius: 1,
        px: verified ? 1 : 2,
        backgroundColor: verified ? "transparent" : "rgba(255, 0, 0, 0.215)",
        "&:hover": {
          backgroundColor: verified ? "transparent" : "rgba(255, 0, 0, 0.352)",
        },
        [theme.breakpoints.down("sm")]: {
          px: verified ? 0.5 : 1.5,
          py: 0.5,
          marginRight: -1,
          minWidth: "auto",
          "& span": {
            fontSize: "0.70rem",
          },
        },
      }}
    >
      {loading ? (
        <CircularProgress size={18} />
      ) : verified ? (
        <CheckCircle color="success" />
      ) : (
        <span style={{ color: "red", fontWeight: 600, fontSize: "0.75rem" }}>
          Verify
        </span>
      )}
    </IconButton>
    // </Tooltip>
  );
}

export default memo(VerifyButton);

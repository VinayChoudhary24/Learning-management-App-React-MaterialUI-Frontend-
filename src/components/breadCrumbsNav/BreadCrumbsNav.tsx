import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

interface BreadcrumbsNavProps {
  breadcrumbs: { label: string; path?: string }[];
}

// Define the shape of a single breadcrumb item
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Define props type
interface BreadcrumbsNavProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function BreadcrumbsNav({ breadcrumbs }: BreadcrumbsNavProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: { xs: 2, sm: 3 },
        py: { xs: 1, sm: 1 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": { color: "text.secondary" },
          fontSize: isMobile ? "0.85rem" : "0.95rem",
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography
              key={index}
              color="text.primary"
              fontWeight="bold"
              sx={{ textTransform: "capitalize" }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              color="text.secondary"
              underline="hover"
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.primary.main },
                textTransform: "capitalize",
              }}
              onClick={() => item.path && navigate(item.path)}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

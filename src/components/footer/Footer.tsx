import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import ExternalLinkIcon from "../../utils/icons/ExternalLinkIcon";
import GitHubIcon from "../../utils/icons/GithubIcon";

export default function Footer() {
  // console.log("THIS-IS-FOOTER-COM");
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "transparent", // fully transparent
        borderTop: `1px solid ${theme.palette.divider}`, // adaptive border
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              MyApp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learn. Grow. Succeed. Your modern learning platform for everyone.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/courses" color="inherit" underline="hover">
                Courses
              </Link>
              {/* <Link href="/about" color="inherit" underline="hover">
                About
              </Link> */}
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link
                href="https://vinay-choudhary.vercel.app/"
                color="inherit"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                }}
              >
                <ExternalLinkIcon fontSize="small" />
                Portfolio
              </Link>
              <Link
                href="https://github.com/VinayChoudhary24"
                color="inherit"
                underline="hover"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                }}
              >
                {/* <Github size={16} /> */}
                <GitHubIcon fontSize="small" />
                Github
              </Link>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://www.instagram.com/leave_some_mark/"
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://www.linkedin.com/in/vinay-choudhary-9661121a1"
                target="_blank"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DEFI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

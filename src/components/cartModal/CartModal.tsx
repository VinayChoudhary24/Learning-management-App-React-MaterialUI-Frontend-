import {
  Modal,
  Box,
  IconButton,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Fade,
  //   Backdrop,
  Button,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, CurrencyRupee } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/cart/CartContext";
import { formatCurrency } from "../../utils/currency/formatCurrency";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CartModal({ open, onClose }: CartModalProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCartContext();

  const subtotal = cart.reduce((sum, c) => sum + (c.price || 0), 0);
  const formattedSubtotalAmount = formatCurrency(subtotal);
  const isCartEmpty = cart.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      //   slots={{ backdrop: Backdrop }}
      //   slotProps={{ backdrop: { timeout: 300 } }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2, // small horizontal padding for mobile view
      }}
    >
      <Fade in={open}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            width: { xs: "100%", sm: "90%", md: "70%", lg: "60%" },
            maxWidth: "900px",
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 2, sm: 3 },
            outline: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Your Cart
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Cart Items */}
          {cart.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 5 }}>
              Your cart is empty.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {cart.map((course) => (
                <Card
                  key={course._id}
                  component={motion.div}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: 3,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={course.courseImg.url || undefined}
                    alt={course.title || "course name"}
                    sx={{
                      width: { xs: "100%", sm: 150 },
                      height: { xs: 160, sm: "auto" },
                      objectFit: "cover",
                    }}
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor.firstName}{" "}
                        {course.instructor.lastName}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CurrencyRupee sx={{ fontSize: 18 }} />
                        {course.price?.toLocaleString("en-IN")}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        mt: 2,
                        alignSelf: "flex-start",
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                      onClick={() => removeFromCart(course._id)}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography fontWeight="bold">Subtotal</Typography>
                <Typography fontWeight="bold" color="primary">
                  {/* <CurrencyRupee sx={{ fontSize: 18 }} /> */}
                  {formattedSubtotalAmount}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={isCartEmpty}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.3,
                }}
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

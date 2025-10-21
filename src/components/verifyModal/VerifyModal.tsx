import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { memo, useEffect, useRef, useState } from "react";

type MessageType = {
  text: string;
  severity: "success" | "error" | "info" | "warning";
};

type OTPResponse = {
  success?: boolean;
  message?: string;
};

type OTPModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => Promise<void> | void;
  onResend?: () => Promise<OTPResponse | undefined>;
  title: string;
  verificationMessage?: MessageType | null;
};

function VerifyModal({
  open,
  onClose,
  onConfirm,
  onResend,
  title,
  verificationMessage,
}: OTPModalProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);
  // Refs for inputs to control focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // console.log("open", open);
  // console.log("title", title);
  // console.log("verificationMessage", verificationMessage);

  // Sync verificationMessage prop to local message state
  useEffect(() => {
    // console.log("verificationMessage", verificationMessage);
    if (verificationMessage) {
      setMessage(verificationMessage);
      // console.log("message", message);
    }
  }, [verificationMessage]);

  useEffect(() => {
    if (!open) return;

    // reset state
    setOtp(Array(6).fill(""));
    setTimeLeft(60);
    // setMessage(null);
    // auto focus first box
    setTimeout(() => inputRefs.current[0]?.focus(), 100);

    // timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleChange = (val: string, index: number) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < 5) {
        inputRefs.current[index + 1]?.focus(); // auto move forward
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus(); // move back
    }
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length === 6) {
      setVerifying(true);
      setMessage(null);
      try {
        await onConfirm(code);
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleResendClick = async () => {
    if (!onResend) return;
    try {
      setSending(true);
      const result = await onResend();
      // console.log("RESEND-MODAL", result);
      if (result && result.success) {
        setTimeLeft(60);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography align="center" gutterBottom>
          Enter the 6-digit code (expires in {timeLeft}s)
        </Typography>

        <Grid container spacing={1} justifyContent="center">
          {otp.map((digit, idx) => (
            <Grid key={idx} size={{ xs: 2 }}>
              <TextField
                value={digit}
                inputRef={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                slotProps={{
                  htmlInput: { maxLength: 1, style: { textAlign: "center" } },
                }}
              />
            </Grid>
          ))}
        </Grid>

        {message && (
          <Alert severity={message.severity} sx={{ m: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={handleResendClick}
            disabled={sending || timeLeft > 0}
            size="small"
          >
            {sending ? <CircularProgress size={18} /> : "Resend OTP"}
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={verifying}
            startIcon={verifying ? <CircularProgress size={18} /> : null}
          >
            {verifying ? "Verifying..." : "Confirm"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default memo(VerifyModal);

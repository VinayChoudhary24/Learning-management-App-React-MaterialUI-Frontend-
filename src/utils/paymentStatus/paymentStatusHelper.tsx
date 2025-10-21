import { Chip } from "@mui/material";
import type { JSX } from "react";
import { PAYMENT_STATUS } from "../../services/payment/types/payment.types";

export const getStatusChip = (status: number): JSX.Element => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return <Chip label="Pending" color="warning" size="small" />;
    case PAYMENT_STATUS.PROCESSING:
      return <Chip label="Processing" color="info" size="small" />;
    case PAYMENT_STATUS.COMPLETED:
      return <Chip label="Paid" color="success" size="small" />;
    case PAYMENT_STATUS.FAILED:
      return <Chip label="Failed" color="error" size="small" />;
    case PAYMENT_STATUS.REFUNDED:
      return <Chip label="Refunded" color="secondary" size="small" />;
    case PAYMENT_STATUS.PARTIALLY_REFUNDED:
      return (
        <Chip
          label="Partially Refunded"
          color="secondary"
          size="small"
          variant="outlined"
        />
      );
    default:
      return <Chip label="Unknown" size="small" />;
  }
};

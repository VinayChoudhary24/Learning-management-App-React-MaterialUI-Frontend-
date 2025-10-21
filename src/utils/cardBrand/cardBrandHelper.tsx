import React from "react";
import { Stack, Typography } from "@mui/material";

const brandLogos: Record<string, string> = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
  mastercard:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  amex: "https://upload.wikimedia.org/wikipedia/en/3/30/American_Express_logo_%282018%29.svg",
  rupay: "https://upload.wikimedia.org/wikipedia/commons/f/f1/RuPay-Logo.png",
  discover:
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg",
};

interface CardInfoProps {
  cardInfo?: {
    type?: string;
    card?: {
      brand?: string;
      last4?: string;
    };
  };
}

export const getCardInfoDisplay = ({
  cardInfo,
}: CardInfoProps): React.JSX.Element => {
  if (!cardInfo?.card || !cardInfo?.card?.brand || !cardInfo?.card?.last4)
    return <Typography variant="body2">—</Typography>;

  const brand = cardInfo.card.brand?.toLowerCase() ?? "unknown";
  const logo = brandLogos[brand];

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {logo && (
        <img
          src={logo}
          alt={brand}
          style={{ width: 28, height: 18, objectFit: "contain" }}
        />
      )}
      <Typography variant="body2" color="text.secondary">
        {cardInfo.card.last4}
      </Typography>
    </Stack>
  );
};

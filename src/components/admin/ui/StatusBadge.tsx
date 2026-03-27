import { Box } from "@chakra-ui/react";
import { T } from "./tokens";

type Variant =
  | "green" | "red" | "orange" | "blue" | "purple" | "gray" | "yellow";

const BG_MAP: Record<Variant, string> = {
  green:  T.greenBg,   red:    T.redBg,     orange: "#fee2e2",
  blue:   T.blueBg,    purple: T.purpleBg,  gray:   T.grayBg,
  yellow: T.warnBg,
};
const CLR_MAP: Record<Variant, string> = {
  green:  T.greenDark, red:    T.redText,   orange: "#991b1b",
  blue:   T.blueText,  purple: T.purpleText, gray:   T.gray,
  yellow: T.warnText,
};

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  /** Shortcut map: pass a status string, component picks the color */
  status?: string;
}

const STATUS_VARIANT: Record<string, Variant> = {
  // fulfillment
  FULFILLED:    "green", Fulfilled:    "green",
  UNFULFILLED:  "orange",Unfulfilled:  "orange",
  RESTOCKED:    "gray",  Restocked:    "gray",
  PARTIALLY_FULFILLED: "blue",
  // payment
  PAID:         "green", Paid:         "green",
  COD:          "yellow",
  COD_PENDING:  "yellow",
  UNPAID:       "red",   Unpaid:       "red",
  REFUNDED:     "orange",Refunded:     "orange",
  // product
  ACTIVE:       "green", Active:       "green",
  DRAFT:        "gray",  Draft:        "gray",
  ARCHIVED:     "red",   Archived:     "red",
  // discount
  EXPIRED:      "red",   Expired:      "red",
  SCHEDULED:    "blue",  Scheduled:    "blue",
  // stock
  OK:           "green",
  Low:          "orange",
  Out:          "red",
  // misc
  Recovered:    "green",
  Abandoned:    "red",
  Open:         "blue",
  Invoice:      "purple",
};

export function StatusBadge({ children, variant, status }: StatusBadgeProps) {
  const v: Variant = variant ?? (status ? STATUS_VARIANT[status] ?? "gray" : "gray");
  return (
    <Box
      as="span"
      display="inline-block"
      px={2.5} py={0.5}
      borderRadius="full"
      fontSize="11px"
      fontWeight={600}
      bg={BG_MAP[v]}
      color={CLR_MAP[v]}
      whiteSpace="nowrap"
    >
      {children}
    </Box>
  );
}

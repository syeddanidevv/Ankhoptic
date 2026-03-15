import React from "react";
import { Button } from "@chakra-ui/react";
import { AdminLoader } from "./AdminLoader";
import { T } from "./tokens";

type BtnVariant = "primary" | "secondary" | "danger" | "ghost";

interface AdminButtonProps {
  variant?: BtnVariant;
  size?: "sm" | "xs" | "md";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  px?: number;
  type?: "button" | "submit";
}

const STYLES: Record<BtnVariant, object> = {
  primary: {
    bg: T.green,
    color: "white",
    _hover: { bg: T.greenDark },
  },
  secondary: {
    variant: "outline",
    borderColor: T.border,
    color: T.text,
    _hover: { bg: T.bg },
  },
  danger: {
    bg: T.redBg,
    color: T.redText,
    _hover: { bg: "#fecaca" },
  },
  ghost: {
    variant: "ghost",
    color: T.text,
    _hover: { bg: T.bg },
  },
};

export function AdminButton({
  variant = "secondary",
  size = "sm",
  px = 5,
  children,
  onClick,
  disabled,
  loading = false,
  type = "button",
}: AdminButtonProps) {
  return (
    <Button
      size={size}
      borderRadius="8px"
      fontSize="13px"
      px={px}
      gap={2}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      transition="all 0.15s"
      {...STYLES[variant]}
    >
      {loading && <AdminLoader fullPage={false} />}
      {children}
    </Button>
  );
}

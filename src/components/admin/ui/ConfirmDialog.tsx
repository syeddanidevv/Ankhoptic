"use client";
import { Box, Flex, Text } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import { AdminButton } from "./AdminButton";
import { T } from "./tokens";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!open || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    /* Backdrop */
    <Flex
      position="fixed" inset={0} zIndex={9999}
      align="center" justify="center"
      bg="rgba(15,23,42,0.45)"
      backdropFilter="blur(4px)"
      onClick={onCancel}
    >
      {/* Dialog card */}
      <Box
        bg="white"
        borderRadius="14px"
        boxShadow="0 20px 60px rgba(0,0,0,0.18)"
        p={6}
        w="100%"
        maxW="380px"
        mx={4}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <Flex
          w="44px" h="44px" borderRadius="12px"
          bg={danger ? "#fff1f2" : "#fffbeb"}
          align="center" justify="center"
          mb={4}
        >
          {danger
            ? <Trash2 size={20} color={T.red} strokeWidth={2} />
            : <AlertTriangle size={20} color={T.warn} strokeWidth={2} />
          }
        </Flex>

        <Text fontSize="15px" fontWeight={700} color={T.text} mb={1}>
          {title}
        </Text>
        <Text fontSize="13px" color={T.sub} mb={5} lineHeight={1.6}>
          {message}
        </Text>

        <Flex gap={2} justify="flex-end">
          <AdminButton variant="secondary" onClick={onCancel}>
            Cancel
          </AdminButton>
          <AdminButton
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AdminButton>
        </Flex>
      </Box>
    </Flex>,
    document.body
  );
}

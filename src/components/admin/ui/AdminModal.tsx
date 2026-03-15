"use client";
import React from "react";
import ReactDOM from "react-dom";
import { Box, Text } from "@chakra-ui/react";
import { T } from "./tokens";

export interface AdminModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  maxW?: string;
  description?: React.ReactNode;
}

export function AdminModal({
  isOpen,
  title,
  titleColor = T.text,
  children,
  maxW = "lg",
  description,
}: AdminModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <Box
      className="admin-modal-backdrop"
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        className="admin-modal-card"
        bg={T.card}
        p={6}
        borderRadius="xl"
        maxW={maxW}
        w="full"
        boxShadow="2xl"
        maxH="85vh"
        overflowY="auto"
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={description ? 2 : 4}
          color={titleColor}
        >
          {title}
        </Text>
        {description && (
          <Text color={T.text} mb={6}>
            {description}
          </Text>
        )}
        {children}
      </Box>
    </Box>,
    document.body,
  );
}

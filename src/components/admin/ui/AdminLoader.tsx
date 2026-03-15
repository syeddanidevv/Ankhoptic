"use client";
import { Box, Text } from "@chakra-ui/react";
import { T } from "./tokens";

interface AdminLoaderProps {
  message?: string;
  /** If true, fills the entire page (default). If false, inline centered spinner */
  fullPage?: boolean;
}

export function AdminLoader({
  message = "Loading...",
  fullPage = true,
}: AdminLoaderProps) {
  if (fullPage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        w="full"
        minH="calc(100vh - 64px)"
        gap={3}
      >
        <Box
          w="38px"
          h="38px"
          borderRadius="full"
          border="3px solid"
          borderColor={T.border}
          borderTopColor={T.green}
          style={{ animation: "spin 0.75s linear infinite" }}
        />
        <Text fontSize="13px" color={T.sub} fontWeight={500}>
          {message}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="18px"
      h="18px"
      borderRadius="full"
      border="2px solid currentColor"
      borderTopColor="transparent"
      display="inline-block"
      style={{ animation: "spin 0.6s linear infinite" }}
    />
  );
}

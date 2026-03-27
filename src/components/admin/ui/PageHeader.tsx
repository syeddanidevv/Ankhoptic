import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { T } from "./tokens";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;   // action buttons slot
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <Flex
      justify="space-between"
      align={{ base: "flex-start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 3, md: 0 }}
      mb={6}
    >
      <Box>
        <Text fontSize={{ base: "18px", md: "22px" }} fontWeight={700} color={T.text} lineHeight={1.2}>
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="13px" color={T.sub} mt={0.5}>{subtitle}</Text>
        )}
      </Box>
      {children && <HStack gap={2}>{children}</HStack>}
    </Flex>
  );
}

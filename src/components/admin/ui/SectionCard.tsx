import { Box, Text } from "@chakra-ui/react";
import { T } from "./tokens";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  /** Extra content rendered in the header row (right side) */
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  /** Padding inside the body. Default 5 */
  p?: number;
  /** CSS overflow. Default 'hidden' */
  overflow?: string;
}

export function SectionCard({ title, subtitle, headerRight, children, p = 5, overflow = "hidden" }: SectionCardProps) {
  return (
    <Box
      bg={T.card} border={`1px solid ${T.border}`}
      borderRadius="12px" overflow={overflow} shadow="sm"
    >
      <Box
        px={5} py={4} borderBottom={`1px solid ${T.divider}`}
        display="flex" alignItems="center" justifyContent="space-between"
      >
        <Box>
          <Text fontSize="14px" fontWeight={600} color={T.text}>{title}</Text>
          {subtitle && <Text fontSize="12px" color={T.sub} mt={0.5}>{subtitle}</Text>}
        </Box>
        {headerRight}
      </Box>
      <Box p={p}>{children}</Box>
    </Box>
  );
}

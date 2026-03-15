import { Box, Flex, Text } from "@chakra-ui/react";
import { T } from "./tokens";

interface StripItem {
  label: string;
  value: string | number;
}

interface TodayStripProps {
  items: StripItem[];
}

export function TodayStrip({ items }: TodayStripProps) {
  return (
    <Box
      bg={T.card} border={`1px solid ${T.border}`}
      borderRadius="12px" px={6} py={4} mb={5} shadow="sm"
    >
      <Flex align="center" gap={8} flexWrap="wrap">
        <Text
          fontSize="11px" fontWeight={700} color={T.sub}
          textTransform="uppercase" letterSpacing="0.7px" flexShrink={0}
        >
          Today
        </Text>
        {items.map((s, i) => (
          <Flex key={s.label} align="center" gap={8}>
            {i > 0 && <Box w="1px" h="28px" bg={T.border} />}
            <Box>
              <Text fontSize="18px" fontWeight={800} color={T.text} lineHeight={1}>
                {s.value}
              </Text>
              <Text fontSize="11px" color={T.sub} mt={0.5}>{s.label}</Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

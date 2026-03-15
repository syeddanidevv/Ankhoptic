import { Box, Flex, Text } from "@chakra-ui/react";
import { T } from "./tokens";

interface StatCardProps {
  label: string;
  value: string | number;
  /** Optional accent color for the corner tint and sparkline */
  color?: string;
  /** Optional sub-label (trend text etc.) */
  sub?: string;
  up?: boolean;
  /** Mini sparkline bar data */
  sparkline?: number[];
}

function MiniBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <Flex align="flex-end" gap="2px" h="26px">
      {data.map((v, i) => (
        <Box
          key={i} w="5px"
          h={`${Math.round((v / max) * 26)}px`}
          bg={color}
          opacity={0.25 + (i / data.length) * 0.75}
          borderRadius="2px"
        />
      ))}
    </Flex>
  );
}

export function StatCard({
  label, value, color = T.green, sub, up, sparkline,
}: StatCardProps) {
  const tintBg = color + "18"; // 10% opacity hex trick
  return (
    <Box
      bg={T.card} border={`1px solid ${T.border}`}
      borderRadius="12px" p={5} shadow="sm"
      position="relative" overflow="hidden" flex={1}
    >
      {/* Corner accent */}
      <Box
        position="absolute" top={0} right={0}
        w="56px" h="56px"
        bg={tintBg}
        borderRadius="0 12px 0 100%"
      />

      <Text
        fontSize="11px" fontWeight={600} color={T.sub}
        textTransform="uppercase" letterSpacing="0.6px" mb={2}
        position="relative"
      >
        {label}
      </Text>
      <Text fontSize="26px" fontWeight={800} color={T.text} lineHeight={1} mb={3} position="relative">
        {value}
      </Text>

      {(sub || sparkline) && (
        <Flex align="flex-end" justify="space-between" position="relative">
          {sub && (
            <Text fontSize="11px" color={up === false ? T.red : T.green} fontWeight={600}>
              {up === false ? "▼" : "▲"} {sub}
            </Text>
          )}
          {sparkline && <MiniBar data={sparkline} color={color} />}
        </Flex>
      )}
    </Box>
  );
}

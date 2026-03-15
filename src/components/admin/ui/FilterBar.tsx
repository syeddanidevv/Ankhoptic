import { Flex, Input, Button, Text, Box } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { T } from "./tokens";

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  filters?: string[];
  rightLabel?: string;
}

export function FilterBar({
  search, onSearch, placeholder = "Search...", filters = [], rightLabel,
}: FilterBarProps) {
  return (
    <Flex align="center" gap={3} px={4} py={3} borderBottom={`1px solid #f8fafc`} flexWrap="wrap">
      {/* Search field with icon left-aligned inside, proper inner padding */}
      <Flex
        align="center" gap={2}
        border={`1px solid ${T.border}`} borderRadius="8px"
        px={3} h="34px" maxW="360px" flex="0 1 360px"
        bg="white"
        _focusWithin={{ borderColor: T.green, boxShadow: `0 0 0 2px rgba(16,185,129,0.12)` }}
        transition="box-shadow 0.15s, border-color 0.15s"
      >
        <Box color={T.sub} flexShrink={0}><Search size={14} strokeWidth={2} /></Box>
        <Input
          placeholder={placeholder}
          border="none" outline="none" p={0} h="full"
          fontSize="13px" color={T.text}
          value={search} onChange={e => onSearch(e.target.value)}
          _placeholder={{ color: "#cbd5e1" }}
          _focus={{ boxShadow: "none", borderColor: "transparent" }}
          bg="transparent"
        />
      </Flex>

      {filters.map(f => (
        <Button
          key={f} size="sm" variant="outline" borderRadius="8px"
          fontSize="13px" borderColor={T.border} color={T.text}
          _hover={{ bg: T.bg }}
          px={4} h="34px"
        >
          {f}
        </Button>
      ))}

      {rightLabel && (
        <Text ml="auto" fontSize="12.5px" color={T.sub} flexShrink={0}>
          {rightLabel}
        </Text>
      )}
    </Flex>
  );
}

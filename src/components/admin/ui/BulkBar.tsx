import { Flex, Text, Box } from "@chakra-ui/react";
import { T } from "./tokens";
import { Trash2, CheckCircle, FileText, X } from "lucide-react";

interface BulkAction {
  label: string;
  onClick?: () => void;
  danger?: boolean;
  icon?: "active" | "draft" | "delete";
}

interface BulkBarProps {
  count: number;
  actions: BulkAction[];
  onClear?: () => void;
}

const ACTION_ICONS = {
  active: CheckCircle,
  draft: FileText,
  delete: Trash2,
};

export function BulkBar({ count, actions, onClear }: BulkBarProps) {
  if (count === 0) return null;

  return (
    <Flex
      align="center"
      gap={2}
      px={4}
      py={2.5}
      bg="#1e293b"
      borderBottom={`1px solid #334155`}
    >
      {/* Count badge */}
      <Flex
        align="center"
        gap={1.5}
        bg="rgba(255,255,255,0.1)"
        borderRadius="6px"
        px={2.5}
        py={1}
        mr={1}
      >
        <Box
          w="6px" h="6px" borderRadius="full"
          bg={T.green} flexShrink={0}
        />
        <Text fontSize="12.5px" fontWeight={600} color="white">
          {count} selected
        </Text>
      </Flex>

      {/* Action buttons */}
      {actions.map((a) => {
        const Icon = a.icon ? ACTION_ICONS[a.icon] : undefined;
        return (
          <Flex
            key={a.label}
            as="button"
            align="center"
            gap={1.5}
            px={3}
            py="5px"
            borderRadius="6px"
            fontSize="12.5px"
            fontWeight={500}
            cursor="pointer"
            transition="all 0.12s"
            border="1px solid"
            onClick={a.onClick}
            {...(a.danger
              ? {
                  color: "#f87171",
                  borderColor: "rgba(248,113,113,0.3)",
                  bg: "rgba(248,113,113,0.1)",
                  _hover: { bg: "rgba(248,113,113,0.2)", borderColor: "#f87171" },
                }
              : {
                  color: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.12)",
                  bg: "rgba(255,255,255,0.06)",
                  _hover: { bg: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.25)" },
                }
            )}
          >
            {Icon && <Icon size={12} strokeWidth={2.5} />}
            {a.label}
          </Flex>
        );
      })}

      {/* Spacer + Clear */}
      <Box flex={1} />
      {onClear && (
        <Flex
          as="button"
          align="center"
          gap={1}
          px={2}
          py="5px"
          borderRadius="6px"
          cursor="pointer"
          color="rgba(255,255,255,0.4)"
          _hover={{ color: "white", bg: "rgba(255,255,255,0.08)" }}
          transition="all 0.12s"
          onClick={onClear}
        >
          <X size={13} strokeWidth={2} />
          <Text fontSize="12px">Clear</Text>
        </Flex>
      )}
    </Flex>
  );
}

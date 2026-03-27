import { Box, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { T } from "./tokens";

/* ─── THead ─── */
interface THeadProps {
  columns: string[];
  checkboxCol?: boolean; // first col is a 44px checkbox
}

export function THead({ columns, checkboxCol = false }: THeadProps) {
  return (
    <thead>
      <tr style={{ background: "#f8fafc" }}>
        {checkboxCol && (
          <th
            style={{
              width: 44,
              padding: "10px 16px",
              borderBottom: `1px solid ${T.border}`,
            }}
          />
        )}
        {columns.map((h, idx) => (
          <th
            key={h + idx}
            style={{
              padding: "10px 16px",
              textAlign: "left",
              fontSize: "11px",
              color: T.sub,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: `1px solid ${T.border}`,
              whiteSpace: "nowrap",
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* ─── TableShell ─── */
interface TableShellProps {
  children: React.ReactNode; // <THead> + <tbody> ONLY
  /** Rendered above the table (TabBar, FilterBar, BulkBar) — outside <table> */
  header?: React.ReactNode;
  /** footer left text e.g. "Showing 5 of 20" */
  footerText?: string;
  /** show prev/next buttons */
  showPagination?: boolean;
}

export function TableShell({
  children,
  header,
  footerText,
  showPagination = true,
}: TableShellProps) {
  return (
    <Box
      bg={T.card}
      border={`1px solid ${T.border}`}
      borderRadius="12px"
      overflow="hidden"
      shadow="sm"
    >
      {/* Header slot: TabBar, FilterBar, BulkBar — outside <table> */}
      {header && <Box>{header}</Box>}
      <Box overflowX="auto">
        <style>{`.admin-table td:not(:first-child) { white-space: nowrap; text-align: left; }`}</style>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          {children}
        </table>
      </Box>

      {(footerText || showPagination) && (
        <Flex
          justify="space-between"
          align="center"
          px={5}
          py={3}
          borderTop={`1px solid #f8fafc`}
        >
          <Text fontSize="12.5px" color={T.sub}>
            {footerText ?? ""}
          </Text>
          {showPagination && (
            <HStack gap={1}>
              <Button
                size="sm"
                variant="outline"
                borderRadius="6px"
                borderColor={T.border}
                fontSize="13px"
                color={T.text}
                px={3}
                h="32px"
                bg="white"
                disabled
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderRadius="6px"
                borderColor={T.border}
                fontSize="13px"
                color={T.text}
                px={3}
                h="32px"
                bg="white"
                disabled
              >
                Next
              </Button>
            </HStack>
          )}
        </Flex>
      )}
    </Box>
  );
}

/* ─── TD helper ─── */
export function TD({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <td style={{ padding: "12px 16px", ...style }}>{children}</td>;
}

/* ─── TR helper (alternating rows) ─── */
export function TR({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <tr
      style={{
        borderBottom: "1px solid #f8fafc",
        background: index % 2 === 0 ? "white" : "#fafafa",
        cursor: "pointer",
      }}
    >
      {children}
    </tr>
  );
}

/* ─── Empty row ─── */
export function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={cols}
        style={{
          padding: "48px",
          textAlign: "center",
          color: T.sub,
          fontSize: "14px",
        }}
      >
        {message}
      </td>
    </tr>
  );
}

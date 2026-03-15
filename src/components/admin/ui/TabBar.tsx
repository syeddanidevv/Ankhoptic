import { Flex } from "@chakra-ui/react";
import { T } from "./tokens";

interface Tab {
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: (string | Tab)[];
  active: string;
  onChange: (tab: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <Flex borderBottom={`1px solid ${T.border}`} px={4} overflowX="auto">
      {tabs.map(t => {
        const label  = typeof t === "string" ? t : t.label;
        const count  = typeof t === "string" ? undefined : t.count;
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            style={{
              padding: "11px 14px",
              fontSize: "13.5px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? T.text : T.sub,
              background: "none",
              border: "none",
              borderBottom: isActive ? `2px solid ${T.green}` : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {label}
            {count !== undefined && (
              <span style={{
                background: isActive ? T.green : "#e2e8f0",
                color: isActive ? "white" : T.sub,
                fontSize: "10px", fontWeight: 700,
                padding: "1px 5px", borderRadius: "9999px",
                lineHeight: "1.4",
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </Flex>
  );
}

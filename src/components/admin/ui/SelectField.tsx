"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Check } from "lucide-react";
import { T } from "./tokens";
import { INPUT_ICONS } from "./InputField";
import type { NamedIcon } from "./InputField";

type Option = { value: string; label: string } | string;

function toEntry(opt: Option): { value: string; label: string } {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

interface SelectFieldProps {
  options: Option[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  iconName?: NamedIcon;
  icon?: LucideIcon;
  disabled?: boolean;
  h?: string;
  isInvalid?: boolean;
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder = "Select…",
  iconName,
  icon,
  disabled,
  h = "38px",
  isInvalid,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* Position the portal dropdown under the trigger */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropStyle({
      position: "fixed",
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
      zIndex: 99999,
    });
  }, []);

  /* Close on outside click — exclude both trigger and portal dropdown */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropRef.current &&
        !dropRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  /* Reposition on scroll / resize while open */
  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  const IconComp: LucideIcon | undefined =
    icon ?? (iconName ? INPUT_ICONS[iconName] : undefined);

  const entries = options.map(toEntry);
  const selected = entries.find((o) => o.value === value);
  const hasLeft = !!IconComp;

  const select = (val: string) => {
    onChange?.({ target: { value: val } });
    setOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!open) updatePosition();
    setOpen((v) => !v);
  };

  /* ── Dropdown list rendered via Portal ── */
  const dropdownEl =
    open && typeof document !== "undefined"
      ? createPortal(
          <Box
            ref={dropRef}
            style={dropStyle}
            bg="white"
            border={`1px solid ${T.border}`}
            borderRadius="10px"
            boxShadow="0 8px 24px rgba(0,0,0,0.12)"
            maxH="220px"
            overflowY="auto"
            py={1}
          >
            {placeholder && (
              <Box
                px={3}
                py="7px"
                fontSize="13px"
                color="#94a3b8"
                cursor="pointer"
                _hover={{ bg: T.bg }}
                onClick={() => select("")}
              >
                {placeholder}
              </Box>
            )}
            {entries.map((opt) => {
              const isActive = opt.value === value;
              return (
                <Flex
                  key={opt.value}
                  align="center"
                  px={3}
                  py="7px"
                  fontSize="13.5px"
                  fontWeight={isActive ? 600 : 400}
                  color={isActive ? T.green : T.text}
                  bg={isActive ? "rgba(16,185,129,0.06)" : "transparent"}
                  cursor="pointer"
                  transition="background 0.1s"
                  _hover={{ bg: isActive ? "rgba(16,185,129,0.10)" : T.bg }}
                  justify="space-between"
                  onClick={() => select(opt.value)}
                >
                  <Text>{opt.label}</Text>
                  {isActive && (
                    <Box color={T.green} display="flex">
                      <Check size={13} strokeWidth={2.5} />
                    </Box>
                  )}
                </Flex>
              );
            })}
          </Box>,
          document.body
        )
      : null;

  return (
    <>
      {/* ── Trigger ── */}
      <Box position="relative" ref={triggerRef} w="full">
        <Flex
          align="center"
          h={h}
          px={3}
          pl={hasLeft ? "34px" : "12px"}
          pr="34px"
          borderRadius="8px"
          border={`1px solid ${
            open ? (isInvalid ? T.red : T.green) : isInvalid ? T.red : T.border
          }`}
          boxShadow={
            open
              ? isInvalid
                ? "0 0 0 2px rgba(239,68,68,0.15)"
                : "0 0 0 2px rgba(16,185,129,0.12)"
              : "none"
          }
          bg={disabled ? T.bg : "white"}
          cursor={disabled ? "not-allowed" : "pointer"}
          opacity={disabled ? 0.6 : 1}
          transition="border-color 0.15s, box-shadow 0.15s"
          userSelect="none"
          onClick={handleToggle}
        >
          {/* Left icon */}
          {hasLeft && (
            <Box
              position="absolute"
              left="11px"
              color={T.sub}
              display="flex"
              pointerEvents="none"
            >
              <IconComp size={14} strokeWidth={2} />
            </Box>
          )}

          {/* Value / placeholder */}
          <Text
            fontSize="13.5px"
            color={selected ? T.text : "#94a3b8"}
            flex={1}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {selected ? selected.label : placeholder}
          </Text>

          {/* Chevron */}
          <Box
            position="absolute"
            right="10px"
            color={T.sub}
            display="flex"
            pointerEvents="none"
            transform={open ? "rotate(180deg)" : "rotate(0deg)"}
            transition="transform 0.15s"
          >
            <ChevronDown size={14} strokeWidth={2} />
          </Box>
        </Flex>
      </Box>

      {/* Portal dropdown */}
      {dropdownEl}
    </>
  );
}

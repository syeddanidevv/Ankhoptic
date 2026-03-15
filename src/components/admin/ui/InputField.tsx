"use client";
import { Box, Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";
import {
  Mail, Phone, Lock, Search, MapPin, Link2, Hash,
  Store, MessageCircle, DollarSign, Tag, Package,
  Ruler, User, Globe, Calendar, FileText, Eye, EyeOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { T } from "./tokens";

/* ── Icon map: input type → Lucide icon ── */
const TYPE_ICON: Record<string, LucideIcon> = {
  email:    Mail,
  tel:      Phone,
  password: Lock,
  search:   Search,
  url:      Link2,
  date:     Calendar,
};

/* ── Named icon map for explicit icon prop ── */
export const INPUT_ICONS = {
  store:    Store,
  email:    Mail,
  phone:    Phone,
  whatsapp: MessageCircle,
  address:  MapPin,
  password: Lock,
  search:   Search,
  url:      Link2,
  hash:     Hash,
  tag:      Tag,
  package:  Package,
  ruler:    Ruler,
  user:     User,
  globe:    Globe,
  money:    DollarSign,
  text:     FileText,
} as const;

export type NamedIcon = keyof typeof INPUT_ICONS;

interface InputFieldProps extends Omit<InputProps, "size"> {
  /** input type — determines auto-icon */
  type?: string;
  /** override icon by name */
  iconName?: NamedIcon;
  /** override with any Lucide component directly */
  icon?: LucideIcon;
  /** text prefix shown instead of icon (e.g. "PKR", "+92") */
  prefix?: string;
  /** standard HTML placeholder */
  placeholder?: string;
  /** controlled value */
  value?: string | number;
  /** change handler */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** default (uncontrolled) value */
  defaultValue?: string | number;
  /** disable the field */
  disabled?: boolean;
  /** min, max for number */
  min?: number | string;
  max?: number | string;
  /** explicit size override */
  h?: string;
  /** shows red border + ring when field has a validation error */
  isInvalid?: boolean;
}

export function InputField({
  type = "text",
  iconName,
  icon,
  prefix,
  placeholder,
  value,
  onChange,
  defaultValue,
  disabled,
  min,
  max,
  h = "38px",
  isInvalid,
  ...rest
}: InputFieldProps) {
  const [showPw, setShowPw] = useState(false);

  /* resolve icon */
  const IconComp: LucideIcon | undefined =
    icon ??
    (iconName ? INPUT_ICONS[iconName] : undefined) ??
    TYPE_ICON[type] ??
    undefined;

  const hasLeft  = !!IconComp || !!prefix;
  const isPass   = type === "password";
  const inputType = isPass ? (showPw ? "text" : "password") : type;

  /* left padding: prefix text needs more room than an icon */
  const leftPadding = prefix
    ? `${11 + prefix.length * 8 + 6}px`   // 11px offset + ~8px/char + 6px gap
    : hasLeft ? "34px" : "12px";

  /* for number inputs — block -, e, + keys and default min to 0 */
  const isNumber = type === "number";
  const resolvedMin = isNumber ? (min ?? 0) : min;
  const blockNegative = isNumber
    ? (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
      }
    : undefined;

  return (
    <Box position="relative" w="full">

      {/* Left icon / prefix */}
      {hasLeft && (
        <Box
          position="absolute" left="11px" top="50%"
          transform="translateY(-50%)"
          color={T.sub} pointerEvents="none" zIndex={1}
          display="flex" alignItems="center"
        >
          {prefix ? (
            <Box
              as="span" fontSize="12px" fontWeight={700}
              color={T.sub} lineHeight={1}
              pr="4px"                       /* gap between prefix and typed text */
              borderRight={`1px solid ${T.border}`}
            >
              {prefix}
            </Box>
          ) : IconComp ? (
            <IconComp size={14} strokeWidth={2} />
          ) : null}
        </Box>
      )}

      <Input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        min={resolvedMin}
        max={max}
        onKeyDown={blockNegative}
        borderRadius="8px"
        borderColor={isInvalid ? T.red : T.border}
        fontSize="13.5px"
        h={h}
        pl={leftPadding}
        pr={isPass ? "40px" : "12px"}
        bg={disabled ? T.bg : "white"}
        color={T.text}
        _focus={{
          borderColor: isInvalid ? T.red : T.green,
          boxShadow: isInvalid
            ? "0 0 0 2px rgba(239,68,68,0.15)"
            : "0 0 0 2px rgba(16,185,129,0.12)",
        }}
        _placeholder={{ color: "#cbd5e1" }}
        _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
        {...rest}
      />

      {/* Password toggle */}
      {isPass && (
        <Box
          position="absolute" right="11px" top="50%"
          transform="translateY(-50%)"
          color={T.sub} cursor="pointer" zIndex={1}
          onClick={() => setShowPw(v => !v)}
          display="flex" alignItems="center"
          _hover={{ color: T.text }}
        >
          {showPw ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
        </Box>
      )}
    </Box>
  );
}

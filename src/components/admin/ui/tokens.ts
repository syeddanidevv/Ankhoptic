/** Single source of truth for all admin design tokens */
export const T = {
  bg:     "#f1f5f9",   // page background
  card:   "#ffffff",   // card surface
  border: "#e2e8f0",   // dividers / card borders
  text:   "#0f172a",   // primary text
  sub:    "#94a3b8",   // muted / secondary text
  muted:  "#475569",   // table cell secondary text
  divider:"#f8fafc",   // subtle row dividers inside cards
  placeholder: "#cbd5e1", // input placeholder color
  green:  "#10b981",   // primary accent
  greenDark:  "#059669",
  greenLight: "#d1fae5",
  greenBg:    "#f0fdf4",
  red:    "#ef4444",
  redBg:  "#fee2e2",
  redText:"#991b1b",
  orange: "#f97316",   // warning/alert accent
  orangeBg:   "#fee2e2",
  orangeText: "#991b1b",
  warn:       "#d97706",
  warnBg:     "#fef9c3",
  warnText:   "#92400e",
  blue:       "#2563eb",
  blueBg:     "#eff6ff",
  blueText:   "#1d4ed8",
  purple:     "#7c3aed",
  purpleBg:   "#f5f3ff",
  purpleText: "#6d28d9",
  pink:       "#ec4899",
  pinkBg:     "#fce7f3",
  pinkText:   "#be185d",
  gray:       "#64748b",
  grayBg:     "#f1f5f9",
} as const;

/** Shared input props — spread onto any <Input> or <Textarea> */
export const inputProps = {
  size:          "md"    as const,  // md = 40px height baseline
  borderRadius:  "8px",
  borderColor:   T.border,
  fontSize:      "13.5px",
  px:            "12px",            // explicit inner left/right padding
  h:             "38px",            // fixed height so all inputs are uniform
  bg:            "white",
  _focus:        { borderColor: T.green, boxShadow: `0 0 0 2px rgba(16,185,129,0.12)` },
  _placeholder:  { color: T.placeholder },
};

/** Same as inputProps but for <Textarea> (no fixed h) */
export const textareaProps = {
  borderRadius:  "8px",
  borderColor:   T.border,
  fontSize:      "13.5px",
  px:            "12px",
  py:            "10px",
  bg:            "white",
  _focus:        { borderColor: T.green, boxShadow: `0 0 0 2px rgba(16,185,129,0.12)` },
  _placeholder:  { color: T.placeholder },
};

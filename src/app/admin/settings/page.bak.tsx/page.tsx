"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Text, HStack, VStack, Flex, Grid } from "@chakra-ui/react";
import {
  T,
  PageHeader,
  SectionCard,
  AdminButton,
  InputField,
  AdminLoader,
} from "@/components/admin/ui";
import { Plus, X, Search } from "lucide-react";
import toast from "react-hot-toast";
import { colornames as colorList } from "color-name-list";

/* ─── Types ─── */
interface ModalityOption {
  label: string;
  value: string;
}
interface LensConfig {
  lens_colors: string[];
  modality_options: ModalityOption[];
  power_options: string[];
}
interface ColorEntry {
  name: string;
  hex: string;
}

/* ─── Shared helpers ─── */
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Flex
      align="center"
      gap={1}
      bg="white"
      border="1px solid"
      borderColor={T.border}
      borderRadius="20px"
      pl={3}
      pr={1.5}
      py={1}
      transition="all 0.12s"
      _hover={{ borderColor: T.green }}
    >
      <Text fontSize="12.5px" fontWeight={500} color={T.text}>
        {label}
      </Text>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="18px"
        h="18px"
        borderRadius="full"
        color={T.muted}
        cursor="pointer"
        _hover={{ bg: "#fee2e2", color: T.red }}
        transition="all 0.1s"
        onClick={onRemove}
      >
        <X size={10} strokeWidth={2.5} />
      </Box>
    </Flex>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Flex
      align="center"
      gap={2}
      py={3}
      px={3}
      bg="#f8fafc"
      borderRadius="8px"
      border={`1px dashed ${T.border}`}
    >
      <Box w="6px" h="6px" borderRadius="full" bg={T.border} />
      <Text fontSize="12.5px" color={T.muted}>
        {label}
      </Text>
    </Flex>
  );
}

function CountBadge({ count, singular }: { count: number; singular: string }) {
  return (
    <Box
      px={2.5}
      py={0.5}
      bg={count > 0 ? T.greenLight : "#f1f5f9"}
      borderRadius="full"
      border="1px solid"
      borderColor={count > 0 ? T.green : T.border}
    >
      <Text
        fontSize="11px"
        fontWeight={700}
        color={count > 0 ? "#065f46" : T.muted}
      >
        {count} {count === 1 ? singular : `${singular}s`}
      </Text>
    </Box>
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      gap={1.5}
      px={3}
      h="38px"
      borderRadius="8px"
      border={`1px solid ${T.border}`}
      bg="white"
      color={T.text}
      fontSize="13px"
      fontWeight={500}
      cursor="pointer"
      _hover={{ borderColor: T.green, color: T.green }}
      transition="all 0.13s"
      onClick={onClick}
      flexShrink={0}
    >
      <Plus size={13} strokeWidth={2.5} />
      Add
    </Box>
  );
}

/* ─── Color Section ─── */
function ColorSection({
  items,
  onSave,
  onChange,
}: {
  items: string[];
  onSave: (key: string, value: string[]) => Promise<void>;
  onChange: (v: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Compute results directly from query — no setState in effect */
  const q = query.trim().toLowerCase();
  const results: ColorEntry[] = q
    ? (colorList as ColorEntry[])
        .filter((c: ColorEntry) => c.name.toLowerCase().includes(q))
        .sort((a, b) => {
          const an = a.name.toLowerCase();
          const bn = b.name.toLowerCase();
          if (an === q) return -1;
          if (bn === q) return 1;
          if (an.startsWith(q) && !bn.startsWith(q)) return -1;
          if (!an.startsWith(q) && bn.startsWith(q)) return 1;
          return an.length - bn.length; // shorter (simpler) names first
        })
        .slice(0, 12)
    : [];


  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (c: ColorEntry) => {
    if (!items.includes(c.name)) onChange([...items, c.name]);
    setQuery("");
    setOpen(false);
  };

  const remove = (name: string) => onChange(items.filter((x) => x !== name));

  /* Get hex of a saved color name */
  const hex = (name: string): string =>
    (colorList as ColorEntry[]).find((c: ColorEntry) => c.name === name)?.hex ??
    "#94a3b8";

  const save = async () => {
    setSaving(true);
    await onSave("lens_colors", items);
    setSaving(false);
  };

  return (
    <SectionCard
      title="Lens Colors"
      subtitle="Search and add named colors. The actual color swatch is shown for reference."
      headerRight={<CountBadge count={items.length} singular="color" />}
      overflow="visible"
    >
      {/* Current color chips */}
      {items.length === 0 ? (
        <EmptyState label="No colors added yet — search below to add" />
      ) : (
        <Flex gap={2} flexWrap="wrap" mb={3}>
          {items.map((name) => (
            <Flex
              key={name}
              align="center"
              gap={1.5}
              bg="white"
              border="1px solid"
              borderColor={T.border}
              borderRadius="20px"
              pl={2}
              pr={1.5}
              py={1}
              transition="all 0.12s"
              _hover={{ borderColor: T.green }}
            >
              {/* Color swatch */}
              <Box
                w="12px"
                h="12px"
                borderRadius="full"
                bg={hex(name)}
                border="1px solid rgba(0,0,0,0.1)"
                flexShrink={0}
              />
              <Text fontSize="12.5px" fontWeight={500} color={T.text}>
                {name}
              </Text>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="18px"
                h="18px"
                borderRadius="full"
                color={T.muted}
                cursor="pointer"
                _hover={{ bg: "#fee2e2", color: T.red }}
                transition="all 0.1s"
                onClick={() => remove(name)}
              >
                <X size={10} strokeWidth={2.5} />
              </Box>
            </Flex>
          ))}
        </Flex>
      )}

      {/* Searchable color picker */}
      <Box
        mt={3}
        pt={3}
        borderTop={`1px solid ${T.bg}`}
        position="relative"
        ref={ref}
      >
        <Box position="relative">
          <Box
            position="absolute"
            left="11px"
            top="50%"
            transform="translateY(-50%)"
            color={T.sub}
            pointerEvents="none"
            zIndex={1}
            display="flex"
            alignItems="center"
          >
            <Search size={14} strokeWidth={2} />
          </Box>
          <input
            type="text"
            placeholder="Search color name (e.g. sky blue, amber…)"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              setOpen(v.trim().length > 0);
            }}
            onFocus={() => results.length > 0 && setOpen(true)}
            style={{
              width: "100%",
              height: "38px",
              paddingLeft: "34px",
              paddingRight: "12px",
              borderRadius: "8px",
              border: `1px solid ${T.border}`,
              fontSize: "13.5px",
              background: "white",
              color: T.text,
              outline: "none",
              transition: "border-color 0.15s",
            }}
          />
        </Box>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <Box
            position="absolute"
            top="calc(100% + 4px)"
            left={0}
            right={0}
            bg="white"
            border={`1px solid ${T.border}`}
            borderRadius="10px"
            shadow="0 8px 24px rgba(0,0,0,0.10)"
            zIndex={50}
            overflow="hidden"
            maxH="260px"
            overflowY="auto"
          >
            <Grid templateColumns="repeat(2, 1fr)">
              {results.map((c) => {
                const already = items.includes(c.name);
                return (
                  <Flex
                    key={c.hex}
                    align="center"
                    gap={2.5}
                    px={3}
                    py={2.5}
                    cursor={already ? "not-allowed" : "pointer"}
                    bg="white"
                    opacity={already ? 0.45 : 1}
                    _hover={{ bg: already ? "white" : "#f8fafc" }}
                    transition="all 0.1s"
                    onClick={() => !already && select(c)}
                  >
                    {/* Big swatch */}
                    <Box
                      w="22px"
                      h="22px"
                      borderRadius="6px"
                      bg={c.hex}
                      flexShrink={0}
                      border="1px solid rgba(0,0,0,0.08)"
                      shadow="0 1px 3px rgba(0,0,0,0.12)"
                    />
                    <Box overflow="hidden">
                      <Text
                        fontSize="12.5px"
                        fontWeight={500}
                        color={T.text}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {c.name}
                      </Text>
                      <Text fontSize="10.5px" color={T.muted} fontFamily="mono">
                        {c.hex}
                      </Text>
                    </Box>
                    {already && (
                      <Text
                        fontSize="10px"
                        color={T.green}
                        fontWeight={700}
                        ml="auto"
                      >
                        ✓
                      </Text>
                    )}
                  </Flex>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>

      <Flex justify="flex-end" mt={3}>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </Flex>
    </SectionCard>
  );
}

/* ─── Modality Section ─── */
function ModalitySection({
  items,
  onSave,
  onChange,
}: {
  items: ModalityOption[];
  onSave: (key: string, value: ModalityOption[]) => Promise<void>;
  onChange: (v: ModalityOption[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    const l = label.trim();
    const v = value.trim().toUpperCase().replace(/\s+/g, "_");
    if (!l || !v || items.find((m) => m.value === v)) return;
    onChange([...items, { label: l, value: v }]);
    setLabel("");
    setValue("");
  };
  const remove = (v: string) => onChange(items.filter((m) => m.value !== v));
  const save = async () => {
    setSaving(true);
    await onSave("modality_options", items);
    setSaving(false);
  };

  return (
    <SectionCard
      title="Disposability Types"
      subtitle="Wear-type options in the product form. Each needs a label and a code value."
      headerRight={<CountBadge count={items.length} singular="type" />}
    >
      {items.length === 0 ? (
        <EmptyState label="No modality types added yet" />
      ) : (
        <Grid
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
          gap={2}
          mb={3}
        >
          {items.map((m) => (
            <Flex
              key={m.value}
              align="center"
              justify="space-between"
              bg="white"
              border={`1px solid ${T.border}`}
              borderRadius="8px"
              px={3}
              py={2}
              _hover={{ borderColor: T.green }}
              transition="all 0.12s"
            >
              <Box>
                <Text fontSize="13px" fontWeight={600} color={T.text}>
                  {m.label}
                </Text>
                <Text fontSize="11px" color={T.muted} fontFamily="mono">
                  {m.value}
                </Text>
              </Box>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="20px"
                h="20px"
                borderRadius="full"
                color={T.muted}
                cursor="pointer"
                _hover={{ bg: "#fee2e2", color: T.red }}
                transition="all 0.1s"
                onClick={() => remove(m.value)}
              >
                <X size={11} strokeWidth={2.5} />
              </Box>
            </Flex>
          ))}
        </Grid>
      )}
      <Box mt={3} pt={3} borderTop={`1px solid ${T.bg}`}>
        <Text fontSize="12px" fontWeight={600} color={T.muted} mb={2}>
          Add new modality
        </Text>
        <HStack gap={2}>
          <Box flex={1}>
            <InputField
              iconName="text"
              placeholder="Label (e.g. One Day)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Box>
          <Box flex={1}>
            <InputField
              iconName="hash"
              placeholder="Value (e.g. ONE_DAY)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && add()}
            />
          </Box>
          <AddBtn onClick={add} />
        </HStack>
      </Box>
      <Flex justify="flex-end" mt={3}>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </Flex>
    </SectionCard>
  );
}

/* ─── Powers Section ─── */
function PowersSection({
  items,
  onSave,
  onChange,
}: {
  items: string[];
  onSave: (key: string, value: string[]) => Promise<void>;
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Sort: positive first (desc) then negative (desc) → e.g. +6, +4, 0, -1, -6
  const sorted = (arr: string[]) =>
    [...arr].sort((a, b) => parseFloat(b) - parseFloat(a));

  const add = () => {
    const v = input.trim();
    if (!v || isNaN(parseFloat(v))) { setInput(""); return; }
    const formatted = parseFloat(v) > 0 ? `+${parseFloat(v).toFixed(2)}` : parseFloat(v).toFixed(2);
    if (items.includes(formatted)) { setInput(""); return; }
    onChange(sorted([...items, formatted]));
    setInput("");
  };

  const addRange = (from: number, to: number, step: number) => {
    const newOnes: string[] = [];
    const precision = step < 1 ? 2 : 0;
    for (let p = from; step > 0 ? p <= to : p >= to; p = Math.round((p + step) * 100) / 100) {
      const label = p > 0 ? `+${p.toFixed(precision)}` : p.toFixed(precision);
      if (!items.includes(label)) newOnes.push(label);
    }
    onChange(sorted([...items, ...newOnes]));
  };

  const remove = (v: string) => onChange(items.filter((x) => x !== v));
  const save = async () => {
    setSaving(true);
    await onSave("power_options", items);
    setSaving(false);
  };

  const quickBtn = (label: string, fn: () => void) => (
    <Box
      as="button"
      key={label}
      px={2.5} py={1}
      borderRadius="6px"
      fontSize="11.5px"
      fontWeight={500}
      border={`1px solid ${T.border}`}
      bg="white"
      color={T.sub}
      cursor="pointer"
      _hover={{ borderColor: T.green, color: T.green }}
      transition="all 0.12s"
      onClick={fn}
    >
      {label}
    </Box>
  );

  return (
    <SectionCard
      title="Power Options"
      subtitle="Minus (–) and plus (+) powers for both nearsighted and farsighted lenses."
      headerRight={<CountBadge count={items.length} singular="power" />}
    >
      {/* Quick range buttons */}
      <Box mb={3}>
        <Text fontSize="11px" fontWeight={600} color={T.muted} mb={1.5} textTransform="uppercase" letterSpacing="0.4px">
          Quick add ranges
        </Text>
        <Flex gap={1.5} flexWrap="wrap">
          {quickBtn("– 0.25 to –6.00", () => addRange(-0.25, -6.00, -0.25))}
          {quickBtn("– 0.25 to –12.00", () => addRange(-0.25, -12.00, -0.25))}
          {quickBtn("+ 0.25 to +6.00", () => addRange(0.25, 6.00, 0.25))}
          {quickBtn("+ 0.25 to +12.00", () => addRange(0.25, 12.00, 0.25))}
          {quickBtn("Clear all", () => onChange([]))}
        </Flex>
      </Box>

      {items.length === 0 ? (
        <EmptyState label="No power options added yet" />
      ) : (
        <Flex gap={1.5} flexWrap="wrap" mb={3}>
          {items.map((p) => (
            <Tag key={p} label={p} onRemove={() => remove(p)} />
          ))}
        </Flex>
      )}
      <Box mt={3} pt={3} borderTop={`1px solid ${T.bg}`}>
        <HStack gap={2}>
          <Box flex={1}>
            <InputField
              iconName="ruler"
              placeholder="e.g. -6.50 or +2.75"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && add()}
            />
          </Box>
          <AddBtn onClick={add} />
        </HStack>
      </Box>
      <Flex justify="flex-end" mt={3}>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </Flex>
    </SectionCard>
  );
}


/* ─── Main Page ─── */
export default function SettingsPage() {
  const [config, setConfig] = useState<LensConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/lens-config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const saveKey = async (key: string, value: unknown) => {
    try {
      const res = await fetch("/api/settings/lens-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  if (loading || !config) return <AdminLoader message="Loading settings..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader
        title="Lens Configuration"
        subtitle="Manage options that appear across product forms"
      />

      {/* 2-column grid — Colors+Powers left, Modality right */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={4} alignItems="start">
        {/* ── Left column ── */}
        <VStack gap={4} align="stretch">
          <ColorSection
            items={config.lens_colors}
            onSave={saveKey}
            onChange={(v) => setConfig((c) => c && { ...c, lens_colors: v })}
          />
          <PowersSection
            items={config.power_options}
            onSave={saveKey}
            onChange={(v) => setConfig((c) => c && { ...c, power_options: v })}
          />
        </VStack>

        {/* ── Right column ── */}
        <VStack gap={4} align="stretch">
          <ModalitySection
            items={config.modality_options}
            onSave={saveKey}
            onChange={(v) => setConfig((c) => c && { ...c, modality_options: v })}
          />
        </VStack>
      </Grid>
    </Box>
  );
}

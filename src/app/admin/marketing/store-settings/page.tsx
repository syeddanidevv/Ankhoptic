"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text, Flex, VStack, HStack } from "@chakra-ui/react";
import {
  T,
  PageHeader,
  SectionCard,
  AdminButton,
  InputField,
  AdminLoader,
} from "@/components/admin/ui";
import { Plus, X, Upload, Image as ImageIcon, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

/* ─── Types ─── */
interface Slide {
  url: string;
  link?: string;
  alt?: string;
}
/** A slide not yet uploaded — holds local File + blob preview URL */
interface PendingSlide {
  file: File;
  blobUrl: string;
  link?: string;
  alt?: string;
}
interface LinkOption {
  label: string;
  value: string;
}

type LinkMode = "custom" | "category" | "product";

/* ─── Smart Link Picker ─── */
function LinkPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [mode, setMode] = useState<LinkMode>("custom");
  const [cats, setCats] = useState<LinkOption[]>([]);
  const [prods, setProds] = useState<LinkOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "custom") return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        if (mode === "category") {
          const r = await fetch("/api/categories?flat=1");
          const d = await r.json();
          if (!isMounted) return;
          const list = d.categories ?? [];
          setCats(
            list.map((c: { name: string }) => ({
              label: c.name,
              value: `/products?category=${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            }))
          );
        } else {
          const r = await fetch("/api/products?limit=100");
          const d = await r.json();
          if (!isMounted) return;
          const list = d.products ?? d ?? [];
          setProds(
            list.map((p: { title: string; slug: string }) => ({
              label: p.title,
              value: `/products/${p.slug}`,
            }))
          );
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [mode]);

  const options = mode === "category" ? cats : mode === "product" ? prods : [];

  const selectStyle: React.CSSProperties = {
    height: "38px",
    width: "100%",
    padding: "0 32px 0 10px",
    fontSize: "13px",
    border: `1px solid ${T.border}`,
    borderRadius: "8px",
    background: "white",
    color: T.text,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  };

  return (
    <Box>
      {/* Mode tabs */}
      <HStack gap={1} mb={1.5}>
        {(["custom", "category", "product"] as LinkMode[]).map((m) => (
          <Box
            key={m}
            as="button"
            px={2.5}
            py={0.5}
            borderRadius="full"
            fontSize="11px"
            fontWeight={600}
            cursor="pointer"
            transition="all 0.12s"
            bg={mode === m ? T.green : "#f1f5f9"}
            color={mode === m ? "white" : T.muted}
            onClick={() => {
              setMode(m);
              if (m === "custom") onChange("");
            }}
          >
            {m === "custom"
              ? "Custom URL"
              : m === "category"
                ? "Category"
                : "Product"}
          </Box>
        ))}
      </HStack>

      {mode === "custom" ? (
        <InputField
          iconName="url"
          placeholder="e.g. /products or https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Box position="relative">
          <select
            style={selectStyle}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading…" : `-- Select ${mode} --`}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Box
            position="absolute"
            right="10px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            color={T.muted}
          >
            <ChevronDown size={13} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ─── Dropzone — only picks file, no upload yet ─── */
function SlideDropzone({ onPicked }: { onPicked: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5 MB");
      return;
    }
    onPicked(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) pick(file);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      h="88px"
      border={`2px dashed ${dragging ? T.green : T.border}`}
      borderRadius="10px"
      bg={dragging ? T.greenLight : "#f8fafc"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      transition="all 0.15s"
      _hover={{ borderColor: T.green, bg: T.greenLight }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = "";
        }}
      />
      <Flex direction="column" align="center" gap={1.5}>
        <Upload size={18} color={T.muted} />
        <Text fontSize="12px" color={T.muted}>
          Drop image or click to select
        </Text>
        <Text fontSize="11px" color={T.muted}>
          JPG, PNG, WebP · max 5 MB · uploads on Save
        </Text>
      </Flex>
    </Box>
  );
}

/* ─── Slides Section ─── */
function SlidesSection({
  slides,
  onChange,
  onSave,
}: {
  slides: Slide[];
  onChange: (v: Slide[]) => void;
  onSave: (pending: PendingSlide[]) => Promise<void>;
}) {
  const [pending, setPending] = useState<PendingSlide[]>([]);
  const [pendingUrl, setPendingUrl] = useState("");
  const [link, setLink] = useState("");
  const [alt, setAlt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(
    () => () => {
      pending.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    },
    [pending],
  );

  const addPending = useCallback(
    (file: File) => {
      const blobUrl = URL.createObjectURL(file);
      setPending((prev) => [
        ...prev,
        {
          file,
          blobUrl,
          link: link.trim() || undefined,
          alt: alt.trim() || undefined,
        },
      ]);
      setLink("");
      setAlt("");
    },
    [link, alt],
  );

  const removePending = useCallback((i: number) => {
    setPending((prev) => {
      URL.revokeObjectURL(prev[i].blobUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  }, []);

  const addFromUrl = () => {
    const u = pendingUrl.trim();
    if (!u) return;
    onChange([
      ...slides,
      { url: u, link: link.trim() || undefined, alt: alt.trim() || undefined },
    ]);
    setPendingUrl("");
    setLink("");
    setAlt("");
  };

  const removeConfirmed = (i: number) => {
    const slide = slides[i];
    // Delete from Cloudinary if it's a real URL (not a blob)
    if (slide.url && slide.url.includes("cloudinary.com")) {
      fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: slide.url }),
      }).catch(console.error);
    }
    onChange(slides.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    setSaving(true);
    await onSave(pending);
    pending.forEach((p) => URL.revokeObjectURL(p.blobUrl));
    setPending([]);
    setSaving(false);
  };

  const totalCount = slides.length + pending.length;

  return (
    <SectionCard
      title="Hero Slider Images"
      subtitle="Select images first — they upload to Cloudinary only when you Save."
      headerRight={
        <Box
          px={2.5}
          py={0.5}
          bg={totalCount > 0 ? T.greenLight : "#f1f5f9"}
          borderRadius="full"
          border="1px solid"
          borderColor={totalCount > 0 ? T.green : T.border}
        >
          <Text
            fontSize="11px"
            fontWeight={700}
            color={totalCount > 0 ? "#065f46" : T.muted}
          >
            {totalCount} slide{totalCount !== 1 ? "s" : ""}
          </Text>
        </Box>
      }
    >
      {totalCount === 0 ? (
        <Flex
          align="center"
          gap={2}
          py={2.5}
          px={3}
          bg="#f8fafc"
          borderRadius="8px"
          border={`1px dashed ${T.border}`}
          mb={3}
        >
          <ImageIcon size={13} color={T.muted} />
          <Text fontSize="12.5px" color={T.muted}>
            No slides yet — select images below
          </Text>
        </Flex>
      ) : (
        <VStack gap={2} mb={3} align="stretch">
          {slides.map((slide, i) => (
            <Flex
              key={`s-${i}`}
              align="center"
              gap={3}
              p={2.5}
              bg="white"
              border={`1px solid ${T.border}`}
              borderRadius="10px"
              _hover={{ borderColor: T.green }}
              transition="all 0.12s"
            >
              <Box
                w="60px"
                h="36px"
                borderRadius="6px"
                overflow="hidden"
                bg={T.bg}
                border={`1px solid ${T.border}`}
                flexShrink={0}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.url}
                  alt={slide.alt ?? `Slide ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box flex={1} overflow="hidden">
                <Text
                  fontSize="12px"
                  fontWeight={500}
                  color={T.text}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {slide.url}
                </Text>
                {slide.link && (
                  <Text fontSize="11px" color={T.muted}>
                    → {slide.link}
                  </Text>
                )}
              </Box>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="22px"
                h="22px"
                borderRadius="full"
                color={T.muted}
                cursor="pointer"
                _hover={{ bg: "#fee2e2", color: T.red }}
                transition="all 0.1s"
                onClick={() => removeConfirmed(i)}
              >
                <X size={11} strokeWidth={2.5} />
              </Box>
            </Flex>
          ))}
          {pending.map((p, i) => (
            <Flex
              key={`p-${i}`}
              align="center"
              gap={3}
              p={2.5}
              bg="#fffbeb"
              border="1px solid #fde68a"
              borderRadius="10px"
            >
              <Box
                w="60px"
                h="36px"
                borderRadius="6px"
                overflow="hidden"
                bg={T.bg}
                border="1px solid #fde68a"
                flexShrink={0}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.blobUrl}
                  alt={p.file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box flex={1} overflow="hidden">
                <Text
                  fontSize="12px"
                  fontWeight={500}
                  color={T.text}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {p.file.name}
                </Text>
                <Box
                  display="inline-block"
                  px={1.5}
                  py={0.5}
                  bg="#fef3c7"
                  borderRadius="4px"
                  border="1px solid #fde68a"
                  mt={0.5}
                >
                  <Text fontSize="10px" fontWeight={700} color="#92400e">
                    PENDING — uploads on Save
                  </Text>
                </Box>
              </Box>
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="22px"
                h="22px"
                borderRadius="full"
                color={T.muted}
                cursor="pointer"
                _hover={{ bg: "#fee2e2", color: T.red }}
                transition="all 0.1s"
                onClick={() => removePending(i)}
              >
                <X size={11} strokeWidth={2.5} />
              </Box>
            </Flex>
          ))}
        </VStack>
      )}

      <Box pt={3} borderTop={`1px solid ${T.bg}`}>
        <Text fontSize="12px" fontWeight={600} color={T.muted} mb={2}>
          Add new slide
        </Text>
        <HStack gap={2} mb={2} align="flex-start">
          <Box flex={1}>
            <Text fontSize="11px" fontWeight={600} color={T.muted} mb={1}>
              Click link (optional)
            </Text>
            <LinkPicker value={link} onChange={setLink} />
          </Box>
          <Box flex={1}>
            <Text fontSize="11px" fontWeight={600} color={T.muted} mb={1}>
              Alt text (optional)
            </Text>
            <InputField
              iconName="text"
              placeholder="Describe the image"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </Box>
        </HStack>
        <SlideDropzone onPicked={addPending} />
        <Flex align="center" gap={2} my={2}>
          <Box flex={1} h="1px" bg={T.border} />
          <Text fontSize="11px" color={T.muted}>
            or paste URL
          </Text>
          <Box flex={1} h="1px" bg={T.border} />
        </Flex>
        <HStack gap={2}>
          <Box flex={1}>
            <InputField
              iconName="package"
              placeholder="https://res.cloudinary.com/..."
              value={pendingUrl}
              onChange={(e) => setPendingUrl(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) =>
                e.key === "Enter" && addFromUrl()
              }
            />
          </Box>
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
            onClick={addFromUrl}
            flexShrink={0}
          >
            <Plus size={13} strokeWidth={2.5} /> Add
          </Box>
        </HStack>
        <Flex justify="space-between" align="center" mt={3}>
          {pending.length > 0 && (
            <Text fontSize="12px" color="#92400e" fontWeight={500}>
              {pending.length} image{pending.length > 1 ? "s" : ""} pending
              upload
            </Text>
          )}
          <Box ml="auto">
            <AdminButton
              variant="primary"
              size="sm"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Uploading & saving…" : "Save changes"}
            </AdminButton>
          </Box>
        </Flex>
      </Box>
    </SectionCard>
  );
}

/* ─── Logo Section ─── */
function LogoSection({
  currentUrl,
  onSave,
}: {
  currentUrl: string;
  onSave: (file: File | null, url: string) => Promise<void>;
}) {
  const [pending, setPending] = useState<{
    file: File;
    blobUrl: string;
  } | null>(null);
  const [preview, setPreview] = useState(currentUrl);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (pending) URL.revokeObjectURL(pending.blobUrl);
    const blobUrl = URL.createObjectURL(f);
    setPending({ file: f, blobUrl });
    setPreview(blobUrl);
  };

  const remove = () => {
    if (pending) URL.revokeObjectURL(pending.blobUrl);
    setPending(null);
    setPreview("");
  };

  const save = async () => {
    setSaving(true);
    await onSave(pending?.file ?? null, preview);
    if (pending) {
      URL.revokeObjectURL(pending.blobUrl);
      setPending(null);
    }
    setSaving(false);
  };

  return (
    <SectionCard
      title="Store Logo"
      subtitle="Upload your brand logo shown in header and footer."
    >
      {/* Preview */}
      <Box
        mb={3}
        p={3}
        bg="#f8fafc"
        borderRadius="10px"
        border={`1px solid ${T.border}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="90px"
        position="relative"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Logo preview"
              style={{
                maxHeight: "70px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            <Box
              as="button"
              position="absolute"
              top="6px"
              right="6px"
              w="22px"
              h="22px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="#fee2e2"
              color={T.red}
              cursor="pointer"
              onClick={remove}
            >
              <X size={11} strokeWidth={2.5} />
            </Box>
          </>
        ) : (
          <Flex direction="column" align="center" gap={1} color={T.muted}>
            <ImageIcon size={28} />
            <Text fontSize="12px">No logo set</Text>
          </Flex>
        )}
      </Box>

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={pick}
      />
      <Flex gap={2}>
        <Box flex={1}>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={13} style={{ marginRight: 6 }} /> Choose image
          </AdminButton>
        </Box>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving || (!pending && !preview)}
        >
          {saving ? "Saving…" : "Save logo"}
        </AdminButton>
      </Flex>
      {pending && (
        <Text mt={1.5} fontSize="11px" color={T.muted}>
          ⚠️ Pending: <strong>{pending.file.name}</strong> — click Save to
          upload
        </Text>
      )}
    </SectionCard>
  );
}

/* ─── Slider Settings Section ─── */
interface SliderSettings {
  preview: number;
  tablet: number;
  mobile: number;
  centered: boolean;
  loop: boolean;
  autoPlay: boolean;
  delay: number;
  speed: number;
  height: number;
  dotOffset: number;
  dotColor: string;
}
const SLIDER_DEFAULTS: SliderSettings = {
  preview: 3,
  tablet: 1,
  mobile: 1,
  centered: false,
  loop: true,
  autoPlay: true,
  delay: 4500,
  speed: 1200,
  height: 600,
  dotOffset: 20,
  dotColor: "#ffffff",
};

function SliderSettingsSection({
  settings,
  onChange,
  onSave,
}: {
  settings: SliderSettings;
  onChange: (v: SliderSettings) => void;
  onSave: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };
  const set = <K extends keyof SliderSettings>(k: K, v: SliderSettings[K]) =>
    onChange({ ...settings, [k]: v });

  const field = (label: string, key: keyof SliderSettings, desc?: string) => (
    <Flex
      align="center"
      justify="space-between"
      py={2.5}
      px={3}
      bg="white"
      border={`1px solid ${T.border}`}
      borderRadius="8px"
    >
      <Box>
        <Text fontSize="13px" fontWeight={500} color={T.text}>
          {label}
        </Text>
        {desc && (
          <Text fontSize="11px" color={T.muted}>
            {desc}
          </Text>
        )}
      </Box>
      {typeof settings[key] === "boolean" ? (
        <Box
          as="button"
          w="40px"
          h="22px"
          borderRadius="full"
          cursor="pointer"
          transition="all 0.2s"
          bg={settings[key] ? T.green : T.border}
          position="relative"
          onClick={() => set(key, !settings[key] as SliderSettings[typeof key])}
        >
          <Box
            position="absolute"
            top="3px"
            w="16px"
            h="16px"
            borderRadius="full"
            bg="white"
            transition="all 0.2s"
            left={settings[key] ? "21px" : "3px"}
          />
        </Box>
      ) : key === "dotColor" ? (
        <Flex gap={2} align="center">
          <input
            type="text"
            value={(settings[key] as string) || "#ffffff"}
            onChange={(e) =>
              set(key, e.target.value as SliderSettings[typeof key])
            }
            placeholder="#HEX"
            style={{
              width: "80px",
              height: "32px",
              padding: "0 8px",
              fontSize: "13px",
              border: `1px solid ${T.border}`,
              borderRadius: "6px",
              outline: "none",
            }}
          />
          <input
            type="color"
            value={(settings[key] as string) || "#ffffff"}
            onChange={(e) =>
              set(key, e.target.value as SliderSettings[typeof key])
            }
            style={{
              width: "32px",
              height: "32px",
              padding: "2px",
              border: `1px solid ${T.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              outline: "none",
            }}
          />
        </Flex>
      ) : (
        <input
          type="number"
          min={0}
          value={settings[key] as number}
          onChange={(e) =>
            set(key, Number(e.target.value) as SliderSettings[typeof key])
          }
          style={{
            width: "80px",
            height: "32px",
            padding: "0 8px",
            fontSize: "13px",
            border: `1px solid ${T.border}`,
            borderRadius: "6px",
            textAlign: "center",
            outline: "none",
          }}
        />
      )}
    </Flex>
  );

  return (
    <SectionCard
      title="Slider Behaviour"
      subtitle="Controls speed, autoplay, layout and spacing of the hero slider."
    >
      <VStack gap={2} align="stretch" mb={3}>
        {field(
          "Desktop Preview",
          "preview",
          "Slides visible at once on desktop",
        )}
        {field("Tablet Preview", "tablet", "Slides visible on tablet")}
        {field("Mobile Preview", "mobile", "Slides visible on mobile")}
        {field("Auto Play", "autoPlay", "Auto-advance slides")}
        {field("Delay (ms)", "delay", "Time between slides")}
        {field("Speed (ms)", "speed", "Transition animation duration")}
        {field("Slider Height (px)", "height", "Height of the slider images")}
        {field("Dot Offset (px)", "dotOffset", "Y-axis position from bottom for bullets")}
        {field("Dot Color", "dotColor", "Color of the pagination bullets")}
        {field("Loop", "loop", "Loop back to first slide")}
        {field("Centered", "centered", "Center active slide")}
      </VStack>
      <Flex justify="flex-end">
        <AdminButton
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save settings"}
        </AdminButton>
      </Flex>
    </SectionCard>
  );
}

/* ─── Announcement Messages Section ─── */
function MessagesSection({
  messages,
  onChange,
  onSave,
}: {
  messages: string[];
  onChange: (v: string[]) => void;
  onSave: () => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const add = () => {
    const v = input.trim();
    if (!v || messages.includes(v)) {
      setInput("");
      return;
    }
    onChange([...messages, v]);
    setInput("");
  };
  const remove = (i: number) =>
    onChange(messages.filter((_, idx) => idx !== i));
  const save = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  return (
    <SectionCard
      title="Announcement Bar Messages"
      subtitle="These messages scroll in the announcement bar at the top of the website."
      headerRight={
        <Box
          px={2.5}
          py={0.5}
          bg={messages.length > 0 ? T.greenLight : "#f1f5f9"}
          borderRadius="full"
          border="1px solid"
          borderColor={messages.length > 0 ? T.green : T.border}
        >
          <Text
            fontSize="11px"
            fontWeight={700}
            color={messages.length > 0 ? "#065f46" : T.muted}
          >
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </Text>
        </Box>
      }
    >
      {messages.length === 0 ? (
        <Flex
          align="center"
          gap={2}
          py={3}
          px={3}
          bg="#f8fafc"
          borderRadius="8px"
          border={`1px dashed ${T.border}`}
          mb={3}
        >
          <Text fontSize="12.5px" color={T.muted}>
            No messages yet — add one below
          </Text>
        </Flex>
      ) : (
        <VStack gap={1.5} mb={3} align="stretch">
          {messages.map((msg, i) => (
            <Flex
              key={i}
              align="center"
              gap={3}
              px={3}
              py={2}
              bg="white"
              border={`1px solid ${T.border}`}
              borderRadius="8px"
              _hover={{ borderColor: T.green }}
              transition="all 0.12s"
            >
              <Text flex={1} fontSize="13px" fontWeight={500} color={T.text}>
                {msg}
              </Text>
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
                onClick={() => remove(i)}
              >
                <X size={10} strokeWidth={2.5} />
              </Box>
            </Flex>
          ))}
        </VStack>
      )}

      <Box pt={3} borderTop={`1px solid ${T.bg}`}>
        <HStack gap={2}>
          <Box flex={1}>
            <InputField
              iconName="text"
              placeholder="e.g. FREE SHIPPING ON ORDERS ABOVE RS 2000"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && add()}
            />
          </Box>
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
            onClick={add}
            flexShrink={0}
          >
            <Plus size={13} strokeWidth={2.5} /> Add
          </Box>
        </HStack>
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
      </Box>
    </SectionCard>
  );
}

/* ─── Free Shipping Threshold Section ─── */
function FreeShippingSection({
  threshold,
  onChange,
  onSave,
}: {
  threshold: number;
  onChange: (v: number) => void;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <SectionCard title="Free Shipping Threshold">
      <Box p={3} borderTop={`1px solid ${T.border}`}>
        <Text fontSize="13px" mb={3} color={T.muted}>
          Amount in PKR above which shipping becomes free.
        </Text>
        <HStack gap={2}>
          <Box flex={1}>
            <InputField
              placeholder="e.g. 5000"
              value={threshold || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(Number(e.target.value) || 0)
              }
              type="number"
            />
          </Box>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={async () => {
              setSaving(true);
              await onSave();
              setSaving(false);
            }}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
        </HStack>
      </Box>
    </SectionCard>
  );
}

/* ─── Main Page ─── */
export default function StoreSettingsPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [sliderCfg, setSliderCfg] = useState<SliderSettings>(SLIDER_DEFAULTS);
  const [logo, setLogo] = useState("/store/images/logo/logo.jpg");
  const [shippingThreshold, setShippingThreshold] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((d) => {
        setSlides(d.hero_slides ?? []);
        setMessages(d.announcement_messages ?? []);
        setSliderCfg({ ...SLIDER_DEFAULTS, ...(d.slider_settings ?? {}) });
        if (d.store_logo) setLogo(d.store_logo);
        if (d.free_shipping_threshold !== undefined) {
          setShippingThreshold(Number(d.free_shipping_threshold) || 5000);
        }
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const saveKey = async (key: string, value: unknown) => {
    const res = await fetch("/api/settings/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
      toast.error("Failed to save");
      return;
    }
    toast.success("Saved!");
  };

  if (loading) return <AdminLoader message="Loading store settings..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader
        title="Store Appearance"
        subtitle="Manage homepage slider images and announcement bar messages"
      />

      {/* ── Full-width: Hero Slider ── */}
      <Box mb={5}>
        <SlidesSection
          slides={slides}
          onChange={setSlides}
          onSave={async (pending) => {
            const uploaded: Slide[] = [];
            for (const p of pending) {
              try {
                const fd = new FormData();
                fd.append("file", p.file);
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: fd,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? "Upload failed");
                uploaded.push({ url: data.url, link: p.link, alt: p.alt });
              } catch {
                toast.error(`Failed to upload ${p.file.name}`);
              }
            }
            const finalSlides = [...slides, ...uploaded];
            setSlides(finalSlides);
            await saveKey("hero_slides", finalSlides);
          }}
        />
      </Box>

      {/* ── 2-column grid for smaller settings ── */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
        alignItems="flex-start"
      >
        {/* Col 1 */}
        <VStack gap={4} align="stretch">
          <LogoSection
            currentUrl={logo}
            onSave={async (file, url) => {
              let finalUrl = url;
              if (file) {
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: fd,
                });
                const data = await res.json();
                if (!res.ok) {
                  toast.error("Logo upload failed");
                  return;
                }
                finalUrl = data.url;
              }
              setLogo(finalUrl);
              await saveKey("store_logo", finalUrl);
            }}
          />
          <FreeShippingSection
            threshold={shippingThreshold}
            onChange={setShippingThreshold}
            onSave={() =>
              saveKey("free_shipping_threshold", shippingThreshold)
            }
          />
        </VStack>

        {/* Col 2 */}
        <VStack gap={4} align="stretch">
          <MessagesSection
            messages={messages}
            onChange={setMessages}
            onSave={() => saveKey("announcement_messages", messages)}
          />
          <SliderSettingsSection
            settings={sliderCfg}
            onChange={setSliderCfg}
            onSave={() => saveKey("slider_settings", sliderCfg)}
          />
        </VStack>
      </Box>
    </Box>
  );
}

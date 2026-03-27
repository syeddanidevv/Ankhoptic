"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Text, HStack, Image } from "@chakra-ui/react";
import { UploadCloud, ImageIcon, X, CheckCircle2, Link2 } from "lucide-react";
import { T } from "@/components/admin/ui";

interface ImageUploadProps {
  value: string; // current saved URL (or base64)
  previewUrl: string; // local blob preview
  onChange: (url: string) => void;
  onPreview: (url: string) => void;
  /** Called when user picks a new file (deferred upload mode) */
  onFileSelect?: (file: File | null) => void;
  /** If true, immediately upload on drop.  If false (default), just preview — upload happens on form submit. */
  uploadOnSelect?: boolean;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  uploading?: boolean;
  progress?: number; // 0-100 — passed in from parent when uploadOnSelect=false
  error?: string;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  previewUrl,
  onChange,
  onPreview,
  onFileSelect,
  uploadOnSelect = false, // default: deferred
  onUploadStart,
  onUploadEnd,
  uploading = false,
  progress = 0,
  error,
  label = "Upload image",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [localError, setLocalError] = useState("");
  const [internalProgress, setInternalProgress] = useState(0);

  const effectiveProgress = uploadOnSelect ? internalProgress : progress;

  const validateFile = (file: File): string | null => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowed.includes(file.type))
      return "Invalid file type. Use JPG, PNG, WebP, GIF or SVG.";
    if (file.size > maxSizeMB * 1024 * 1024)
      return `File too large. Max ${maxSizeMB}MB.`;
    return null;
  };

  /** Deferred mode: just preview, emit the File */
  const handleDeferred = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    const blobUrl = URL.createObjectURL(file);
    onPreview(blobUrl);
    // clear old saved URL so form knows a new file is pending
    onChange("");
    onFileSelect?.(file);
  };

  /** Immediate mode: validate → preview → XHR upload */
  const handleImmediate = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError("");
    setInternalProgress(0);
    onPreview(URL.createObjectURL(file));
    onUploadStart?.();

    const fd = new FormData();
    fd.append("file", file);
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setInternalProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          onChange(JSON.parse(xhr.responseText).url);
          setInternalProgress(100);
        } catch {
          setLocalError("Upload failed. Invalid response.");
          onPreview("");
          onChange("");
        }
      } else {
        try {
          setLocalError(JSON.parse(xhr.responseText).error ?? "Upload failed.");
        } catch {
          setLocalError("Upload failed.");
        }
        onPreview("");
        onChange("");
        setInternalProgress(0);
      }
      onUploadEnd?.();
    };
    xhr.onerror = () => {
      setLocalError("Network error. Please try again.");
      onPreview("");
      onChange("");
      setInternalProgress(0);
      onUploadEnd?.();
    };
    xhr.open("POST", "/api/upload");
    xhr.send(fd);
  };

  const onDrop = (accepted: File[]) => {
    if (!accepted[0]) return;
    if (uploadOnSelect) {
      handleImmediate(accepted[0]);
    } else {
      handleDeferred(accepted[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
  });

  const displayError = error || localError;
  const hasImage = !!previewUrl;
  const borderColor = displayError
    ? T.red
    : isDragActive
      ? T.green
      : hasImage
        ? T.green
        : T.border;
  const bgColor = isDragActive ? "#f0fdf4" : hasImage ? "#f9fffe" : T.bg;

  return (
    <Box>
      <Box
        {...getRootProps()}
        border={`2px dashed ${borderColor}`}
        borderRadius="12px"
        p={4}
        bg={bgColor}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        _hover={{
          borderColor: T.green,
          bg: "#f0fdf4",
          transform: "translateY(-1px)",
        }}
        position="relative"
        minH="110px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        style={{
          animation: isDragActive ? "pulse-green 1.5s infinite" : "none",
        }}
      >
        <input {...getInputProps()} />

        {hasImage ? (
          <Box w="full" px={2} animation="fade-in 0.4s ease-out">
            <HStack gap={3} align="center">
              {/* Thumbnail */}
              <Box
                w="72px"
                h="72px"
                flexShrink={0}
                borderRadius="10px"
                border={`1px solid ${T.border}`}
                overflow="hidden"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.03)" }}
              >
                <Image
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  animation="scale-up 0.3s ease-out"
                />
                {/* Uploading overlay (only shown in immediate mode) */}
                <Box
                  position="absolute"
                  inset={0}
                  bg="rgba(255,255,255,0.7)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  opacity={uploading ? 1 : 0}
                  visibility={uploading ? "visible" : "hidden"}
                  transition="opacity 0.4s ease"
                >
                  <Text fontSize="12px" fontWeight={700} color={T.green}>
                    {effectiveProgress}%
                  </Text>
                </Box>
              </Box>

              {/* Status area */}
              <Box flex={1} minW={0} position="relative" h="40px">
                {/* Uploading indicator */}
                <Box
                  position="absolute"
                  inset={0}
                  opacity={uploading ? 1 : 0}
                  visibility={uploading ? "visible" : "hidden"}
                  transition="opacity 0.4s ease, transform 0.4s ease"
                  transform={uploading ? "translateY(0)" : "translateY(5px)"}
                >
                  <HStack gap={1.5} mb={1.5}>
                    <UploadCloud size={14} color={T.green} />
                    <Text fontSize="12.5px" color={T.green} fontWeight={600}>
                      Uploading... {effectiveProgress}%
                    </Text>
                  </HStack>
                  <Box
                    h="5px"
                    borderRadius="99px"
                    bg="#e2e8f0"
                    overflow="hidden"
                    w="full"
                  >
                    <Box
                      h="full"
                      borderRadius="99px"
                      bg={T.green}
                      style={{
                        width: `${effectiveProgress}%`,
                        transition: "width 0.3s ease-out",
                      }}
                    />
                  </Box>
                </Box>

                {/* Ready / Pending state */}
                <Box
                  position="absolute"
                  inset={0}
                  opacity={!uploading ? 1 : 0}
                  visibility={!uploading ? "visible" : "hidden"}
                  transition="opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s"
                  transform={!uploading ? "translateY(0)" : "translateY(-5px)"}
                >
                  <HStack gap={1.5} mb={1}>
                    <CheckCircle2 size={15} color={value ? T.green : T.warn} />
                    <Text
                      fontSize="12.5px"
                      color={value ? T.green : T.warn}
                      fontWeight={600}
                    >
                      {value
                        ? "Image ready"
                        : "Preview only — will upload on save"}
                    </Text>
                  </HStack>
                  <Text fontSize="11px" color={T.sub}>
                    Drop or click to replace
                  </Text>
                </Box>
              </Box>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  onPreview("");
                  onFileSelect?.(null);
                  setInternalProgress(0);
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: `1px solid ${T.border}`,
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: uploading ? 0 : 1,
                  visibility: uploading ? "hidden" : "visible",
                  transform: uploading ? "scale(0.8)" : "scale(1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff1f2";
                  e.currentTarget.style.borderColor = T.red;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                <X size={13} color={T.red} />
              </button>
            </HStack>
          </Box>
        ) : (
          <Box textAlign="center" py={2} animation="fade-in 0.3s ease-out">
            <Box
              display="flex"
              justifyContent="center"
              mb={3}
              transition="transform 0.3s ease"
              transform={isDragActive ? "translateY(-4px)" : "none"}
            >
              {isDragActive ? (
                <UploadCloud size={32} color={T.green} />
              ) : (
                <ImageIcon size={32} color="#94a3b8" />
              )}
            </Box>
            <Text fontSize="13.5px" fontWeight={600} color={T.text} mb={1}>
              {isDragActive ? "Drop to upload" : label}
            </Text>
            <Text fontSize="11.5px" color={T.sub}>
              Drag & drop or{" "}
              <span style={{ color: T.green, fontWeight: 600 }}>browse</span> ·
              JPG, PNG, WebP, SVG · max {maxSizeMB}MB
            </Text>
          </Box>
        )}
      </Box>

      {/* URL paste fallback */}
      <HStack
        gap={2}
        mt={3}
        align="center"
        opacity={hasImage ? 0.6 : 1}
        transition="opacity 0.3s"
      >
        <Link2 size={13} color={T.sub} style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onPreview(e.target.value);
            onFileSelect?.(null);
          }}
          placeholder="Or paste an image URL directly..."
          style={{
            flex: 1,
            height: 36,
            padding: "0 12px",
            fontSize: 12.5,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            background: "white",
            color: T.text,
            outline: "none",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = T.green;
            e.currentTarget.style.boxShadow = "0 0 0 2px rgba(16,185,129,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = T.border;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </HStack>

      {/* Inline error */}
      {displayError && (
        <HStack
          gap={1.5}
          mt={2}
          animation="fade-in-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <X size={12} color={T.red} />
          <Text fontSize="11.5px" color={T.red} fontWeight={500}>
            {displayError}
          </Text>
        </HStack>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
      `}</style>
    </Box>
  );
}

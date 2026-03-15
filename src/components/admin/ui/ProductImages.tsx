"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { T } from "./tokens";
import toast from "react-hot-toast";

interface ProductImagesProps {
  /** Already-uploaded Cloudinary URLs (edit mode or after save) */
  urls: string[];
  /** Locally selected files not yet uploaded */
  pendingFiles: File[];
  onChange: (urls: string[], files: File[]) => void;
}

export function ProductImages({ urls, pendingFiles, onChange }: ProductImagesProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const oversized = accepted.filter((f) => f.size > 5 * 1024 * 1024);
      if (oversized.length) {
        toast.error("Some files exceed 5 MB and were skipped.");
      }
      const valid = accepted.filter((f) => f.size <= 5 * 1024 * 1024);
      onChange(urls, [...pendingFiles, ...valid]);
    },
    [urls, pendingFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => toast.error("Only images up to 5 MB allowed."),
  });

  const removeUrl = (url: string) => onChange(urls.filter((u) => u !== url), pendingFiles);
  const removePending = (idx: number) => onChange(urls, pendingFiles.filter((_, i) => i !== idx));

  const totalCount = urls.length + pendingFiles.length;

  return (
    <Box>
      {totalCount > 0 && (
        <SimpleGrid columns={4} gap={3} mb={4}>
          {/* Uploaded URLs */}
          {urls.map((url, i) => (
            <Box
              key={url}
              position="relative"
              borderRadius="10px"
              overflow="hidden"
              border={`1.5px solid ${i === 0 && pendingFiles.length === 0 ? T.green : T.border}`}
              aspectRatio="1"
              bg={T.bg}
            >
              {i === 0 && pendingFiles.length === 0 && (
                <Box
                  position="absolute" top={1} left={1} zIndex={2}
                  bg={T.green} color="white"
                  fontSize="9px" fontWeight={700}
                  px={1.5} py={0.5} borderRadius="4px"
                  letterSpacing="0.3px"
                >
                  MAIN
                </Box>
              )}
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="120px"
              />
              <Box
                position="absolute" top={1} right={1} zIndex={2}
                bg="white" border={`1px solid ${T.border}`}
                borderRadius="full" p={0.5}
                cursor="pointer"
                display="flex" alignItems="center" justifyContent="center"
                _hover={{ bg: "#fee2e2" }}
                onClick={() => removeUrl(url)}
              >
                <X size={10} strokeWidth={2.5} color={T.red} />
              </Box>
            </Box>
          ))}

          {/* Pending local previews */}
          {pendingFiles.map((file, idx) => {
            const isFirst = urls.length === 0 && idx === 0;
            const preview = URL.createObjectURL(file);
            return (
              <Box
                key={`${file.name}-${idx}`}
                position="relative"
                borderRadius="10px"
                overflow="hidden"
                border={`1.5px solid ${isFirst ? T.green : T.border}`}
                aspectRatio="1"
                bg={T.bg}
              >
                {isFirst && (
                  <Box
                    position="absolute" top={1} left={1} zIndex={2}
                    bg={T.green} color="white"
                    fontSize="9px" fontWeight={700}
                    px={1.5} py={0.5} borderRadius="4px"
                    letterSpacing="0.3px"
                  >
                    MAIN
                  </Box>
                )}
                {/* Pending badge */}
                <Box
                  position="absolute" bottom={1} left={1} zIndex={2}
                  bg="rgba(0,0,0,0.55)" color="white"
                  fontSize="8px" fontWeight={600}
                  px={1.5} py={0.5} borderRadius="4px"
                  letterSpacing="0.2px"
                >
                  PENDING
                </Box>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={file.name}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  position="absolute" top={1} right={1} zIndex={2}
                  bg="white" border={`1px solid ${T.border}`}
                  borderRadius="full" p={0.5}
                  cursor="pointer"
                  display="flex" alignItems="center" justifyContent="center"
                  _hover={{ bg: "#fee2e2" }}
                  onClick={() => removePending(idx)}
                >
                  <X size={10} strokeWidth={2.5} color={T.red} />
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      {/* Drop zone */}
      <Box
        {...getRootProps()}
        border={`2px dashed ${isDragActive ? T.green : T.border}`}
        borderRadius="10px"
        p={8}
        textAlign="center"
        cursor="pointer"
        bg={isDragActive ? "rgba(16,185,129,0.04)" : "white"}
        transition="all 0.15s"
        _hover={{ borderColor: T.green, bg: "rgba(16,185,129,0.04)" }}
      >
        <input {...getInputProps()} />
        <Flex direction="column" align="center" gap={2}>
          <Box
            w="44px" h="44px" borderRadius="12px"
            bg={isDragActive ? "rgba(16,185,129,0.10)" : T.bg}
            display="flex" alignItems="center" justifyContent="center"
            border={`1.5px dashed ${isDragActive ? T.green : T.border}`}
            transition="all 0.15s"
          >
            <ImagePlus size={18} color={isDragActive ? T.green : T.sub} strokeWidth={1.8} />
          </Box>
          <Text fontSize="13.5px" fontWeight={500} color={T.text}>
            {isDragActive ? "Drop images here…" : "Drag & drop or click to upload"}
          </Text>
          <Text fontSize="12px" color={T.sub}>PNG, JPG, WEBP · max 5MB · uploaded when you save</Text>
        </Flex>
      </Box>

      {totalCount > 0 && (
        <Text fontSize="11.5px" color={T.sub} mt={2}>
          First image is the main product image.
          {pendingFiles.length > 0 && (
            <Box as="span" color={T.green} fontWeight={600}> {pendingFiles.length} pending — will upload on save.</Box>
          )}
        </Text>
      )}
    </Box>
  );
}

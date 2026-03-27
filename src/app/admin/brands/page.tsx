"use client";
import { useState, useEffect } from "react";
import { Box, Text, HStack, Grid, Image } from "@chakra-ui/react";
import {
  T,
  PageHeader,
  StatCard,
  TableShell,
  THead,
  TR,
  TD,
  EmptyRow,
  AdminButton,
  FormField,
  FieldError,
  InputField,
  AdminModal,
  AdminLoader,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { useBrandForm } from "@/store/brandFormStore";

interface BrandData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  _count?: { products: number };
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandData | null>(null);

  const {
    name,
    slug,
    logo,
    previewUrl,
    pendingFile,
    uploadProgress,
    errors,
    uploading,
    setName,
    setSlug,
    setLogo,
    setPreviewUrl,
    setPendingFile,
    setUploadProgress,
    setUploading,
    validate,
    reset,
    populate,
  } = useBrandForm();

  const fetchBrands = () => {
    setLoading(true);
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setBrands(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (b: BrandData) => {
    setEditingBrand(b);
    populate({ name: b.name, slug: b.slug, logo: b.logo });
    setIsModalOpen(true);
  };

  const openDeleteModal = (b: BrandData) => {
    setEditingBrand(b);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // If a pending file was selected, upload it now (with progress) before saving
      let finalLogo = logo;
      if (pendingFile) {
        setUploading(true);
        setUploadProgress(0);
        finalLogo = await new Promise<string>((resolve, reject) => {
          const fd = new FormData();
          fd.append("file", pendingFile);
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable)
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText).url);
              } catch {
                reject(new Error("Invalid upload response"));
              }
            } else {
              try {
                reject(
                  new Error(
                    JSON.parse(xhr.responseText).error ?? "Upload failed",
                  ),
                );
              } catch {
                reject(new Error("Upload failed"));
              }
            }
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.open("POST", "/api/upload");
          xhr.send(fd);
        });
        setLogo(finalLogo);
        setPendingFile(null);
        setUploading(false);
        setUploadProgress(100);
      }

      const isNew = !editingBrand;
      const endpoint = isNew ? "/api/brands" : `/api/brands/${editingBrand.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          logo: finalLogo || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save brand");
      }
      toast.success(isNew ? "Brand created!" : "Brand updated!");
      setIsModalOpen(false);
      fetchBrands();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving brand");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingBrand) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/brands/${editingBrand.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      toast.success("Brand deleted!");
      setIsDeleteModalOpen(false);
      fetchBrands();
    } catch {
      toast.error("Error deleting brand");
    } finally {
      setSubmitting(false);
    }
  };

  const totalProducts = brands.reduce(
    (s, b) => s + (b._count?.products || 0),
    0,
  );

  if (loading) return <AdminLoader message="Loading brands..." />;

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader
        title="Brands"
        subtitle="Lens manufacturers available in your store"
      >
        <AdminButton variant="primary" onClick={openAddModal}>
          Add brand
        </AdminButton>
      </PageHeader>

      <Grid templateColumns={{ base: "repeat(2,1fr)", md: "repeat(3,1fr)" }} gap={4} mb={5}>
        <StatCard label="Total Brands" value={brands.length} />
        <StatCard
          label="Total Products"
          value={totalProducts}
          color={T.green}
        />
        <StatCard
          label="Avg. Products / Brand"
          value={
            brands.length > 0 ? Math.round(totalProducts / brands.length) : 0
          }
        />
      </Grid>

      <TableShell footerText={`${brands.length} brands`} showPagination={false}>
        <THead columns={["Brand", "Logo", "Products", "Added On", ""]} />
        <tbody>
          {brands.length === 0 ? (
            <EmptyRow cols={5} message="No brands yet. Add your first brand!" />
          ) : (
            brands.map((b, i) => (
              <TR key={b.id} index={i}>
                <TD>
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    {b.name}
                  </Text>
                  <Text fontSize="11.5px" color={T.sub} mt={0.5}>
                    /{b.slug}
                  </Text>
                </TD>
                <TD>
                  {b.logo ? (
                    <Box
                      w="40px"
                      h="40px"
                      borderRadius="8px"
                      border={`1px solid ${T.border}`}
                      bg="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      <Image
                        src={b.logo}
                        alt={b.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      w="40px"
                      h="40px"
                      borderRadius="8px"
                      border={`1px solid ${T.border}`}
                      bg={T.bg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="18px">🏷️</Text>
                    </Box>
                  )}
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    {b._count?.products || 0}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="12.5px" color={T.muted}>
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                  </Text>
                </TD>
                <TD>
                  <HStack gap={1.5}>
                    <AdminButton
                      variant="secondary"
                      size="xs"
                      onClick={() => openEditModal(b)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="xs"
                      onClick={() => openDeleteModal(b)}
                    >
                      Delete
                    </AdminButton>
                  </HStack>
                </TD>
              </TR>
            ))
          )}
        </tbody>
      </TableShell>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
      >
        <Box mb={4}>
          {/* Logo Upload — professional drag-and-drop component */}
          <FormField label="Brand Logo">
            <ImageUpload
              value={logo}
              previewUrl={previewUrl}
              onChange={setLogo}
              onPreview={setPreviewUrl}
              onFileSelect={setPendingFile}
              uploadOnSelect={false}
              uploading={uploading}
              progress={uploadProgress}
              label="Drop logo here or click to browse"
            />
          </FormField>

          {/* Name — inline validation error from Zustand */}
          <FormField label="Brand Name" required>
            <InputField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bella"
              style={errors.name ? { borderColor: T.red } : undefined}
            />
            <FieldError msg={errors.name} />
          </FormField>

          <FormField label="Slug (optional)" mb={0}>
            <InputField
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. bella (auto-generated if empty)"
            />
          </FormField>
        </Box>

        <HStack justify="flex-end" gap={3}>
          <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={handleSave}
            disabled={submitting || uploading}
          >
            {uploading ? "Uploading..." : submitting ? "Saving..." : "Save"}
          </AdminButton>
        </HStack>
      </AdminModal>

      {/* DELETE MODAL */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Brand"
        titleColor={T.redText}
        maxW="md"
        description={
          <>
            Delete brand <b>{editingBrand?.name}</b>?{" "}
            {(editingBrand?._count?.products || 0) > 0
              ? `⚠️ ${editingBrand?._count?.products} products are linked to this brand.`
              : "This cannot be undone."}
          </>
        }
      >
        <HStack justify="flex-end" gap={3}>
          <AdminButton
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </AdminButton>
          <AdminButton
            variant="danger"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Confirm Delete"}
          </AdminButton>
        </HStack>
      </AdminModal>
    </Box>
  );
}

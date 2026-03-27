"use client";
import React, { useState, useEffect } from "react";
import { Box, Text, HStack, Grid } from "@chakra-ui/react";
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
  SelectField,
  AdminModal,
  AdminLoader,
} from "@/components/admin/ui";
import toast from "react-hot-toast";

interface BrandOption {
  id: string;
  name: string;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  brandId: string | null;
  brand?: { id: string; name: string } | null;
  createdAt: string;
  _count?: { products: number };
  children?: CategoryData[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [allFlat, setAllFlat] = useState<CategoryData[]>([]); // for parent dropdown
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const fetchCategories = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/categories?flat=1").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ])
      .then(([tree, flat, brandsData]) => {
        setCategories(tree.categories || []);
        setTotal(tree.total || 0);
        setAllFlat(flat.categories || []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setParentId("");
    setBrandId("");
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (c: CategoryData) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug || "");
    setParentId(c.parentId || "");
    setBrandId(c.brandId || "");
    setErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (c: CategoryData) => {
    setEditingCategory(c);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const e: { name?: string } = {};
    if (!name.trim()) e.name = "Category name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const isNew = !editingCategory;
      const endpoint = isNew
        ? "/api/categories"
        : `/api/categories/${editingCategory.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          parentId: parentId || null,
          brandId: brandId || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isNew ? "Category created!" : "Category updated!");
      setIsModalOpen(false);
      fetchCategories();
    } catch {
      toast.error("Error saving category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingCategory) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Category deleted!");
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch {
      toast.error("Error deleting category");
    } finally {
      setSubmitting(false);
    }
  };

  // Count total products across all (including children)
  const totalProducts = categories.reduce((sum, c) => {
    const childSum = (c.children || []).reduce(
      (s, ch) => s + (ch._count?.products || 0),
      0,
    );
    return sum + (c._count?.products || 0) + childSum;
  }, 0);

  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.children?.length || 0),
    0,
  );

  // Parent options for dropdown (exclude current editing category & its children)
  const parentOptions = allFlat.filter(
    (c) => !c.parentId && c.id !== editingCategory?.id,
  );

  if (loading) return <AdminLoader message="Loading categories..." />;

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories and subcategories"
      >
        <AdminButton variant="primary" onClick={openAddModal}>
          Add category
        </AdminButton>
      </PageHeader>

      <>
        <Grid templateColumns={{ base: "repeat(2,1fr)", md: "repeat(3,1fr)" }} gap={4} mb={5}>
            <StatCard label="Total Categories" value={total} />
            <StatCard
              label="Subcategories"
              value={totalSubcategories}
              color={T.blue}
            />
            <StatCard
              label="Products Attached"
              value={totalProducts}
              color={T.green}
            />
          </Grid>

          <TableShell
            footerText={`${total} parent categories, ${totalSubcategories} subcategories`}
            showPagination={false}
          >
          <THead columns={["Category", "Brand", "Type", "Products", "Created", ""]} />
          <tbody>
            {categories.length === 0 ? (
              <EmptyRow
                cols={6}
                message="No categories found. Add your first category!"
              />
            ) : (
              categories.map((cat, i) => (
                <React.Fragment key={cat.id}>
                  {/* Parent row */}
                  <TR key={cat.id} index={i}>
                    <TD>
                      <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                        {cat.name}
                      </Text>
                      <Text fontSize="11.5px" color={T.sub} mt={0.5}>
                        /{cat.slug}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="12.5px" color={cat.brand ? T.text : T.muted}>
                        {cat.brand?.name || "—"}
                      </Text>
                    </TD>
                    <TD>
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        px={2.5}
                        py={1}
                        borderRadius="6px"
                        bg={T.blueBg}
                        border={`1px solid ${T.border}`}
                      >
                        <Text fontSize="11.5px" fontWeight={600} color={T.blueText}>
                          Parent
                        </Text>
                      </Box>
                    </TD>
                    <TD>
                      <Text fontSize="13px" fontWeight={600} color={T.text}>
                        {cat._count?.products || 0}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="12.5px" color={T.sub}>
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "—"}
                      </Text>
                    </TD>
                    <TD>
                      <HStack gap={1.5}>
                        <AdminButton
                          variant="secondary"
                          size="xs"
                          onClick={() => openEditModal(cat)}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingCategory(null);
                            setName("");
                            setSlug("");
                            setParentId(cat.id);
                            setBrandId(cat.brandId || "");
                            setErrors({});
                            setIsModalOpen(true);
                          }}
                        >
                          + Sub
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          size="xs"
                          onClick={() => openDeleteModal(cat)}
                        >
                          Delete
                        </AdminButton>
                      </HStack>
                    </TD>
                  </TR>

                  {/* Child rows — indented */}
                  {(cat.children || []).map((child, ci) => (
                    <TR key={child.id} index={i * 100 + ci + 1}>
                      <TD>
                        <HStack gap={2}>
                          <Box w="16px" h="1px" bg={T.border} mt="1px" flexShrink={0} />
                          <Box>
                            <Text fontSize="13px" fontWeight={500} color={T.text}>
                              {child.name}
                            </Text>
                            <Text fontSize="11px" color={T.sub}>
                              /{child.slug}
                            </Text>
                          </Box>
                        </HStack>
                      </TD>
                      <TD>
                        <Text fontSize="12.5px" color={child.brand ? T.text : T.muted}>
                          {child.brand?.name || "—"}
                        </Text>
                      </TD>
                      <TD>
                        <Box
                          display="inline-flex"
                          alignItems="center"
                          px={2.5}
                          py={1}
                          borderRadius="6px"
                          bg={T.bg}
                          border={`1px solid ${T.border}`}
                        >
                          <Text fontSize="11.5px" fontWeight={500} color={T.sub}>
                            Sub → {cat.name}
                          </Text>
                        </Box>
                      </TD>
                      <TD>
                        <Text fontSize="13px" color={T.muted}>
                          {child._count?.products || 0}
                        </Text>
                      </TD>
                      <TD>
                        <Text fontSize="12px" color={T.sub}>
                          {child.createdAt ? new Date(child.createdAt).toLocaleDateString() : "—"}
                        </Text>
                      </TD>
                      <TD>
                        <HStack gap={1.5}>
                          <AdminButton
                            variant="secondary"
                            size="xs"
                            onClick={() => openEditModal(child)}
                          >
                            Edit
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            size="xs"
                            onClick={() => openDeleteModal(child)}
                          >
                            Delete
                          </AdminButton>
                        </HStack>
                      </TD>
                    </TR>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
          </TableShell>
        </>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <Box mb={4}>
          {/* Name */}
          <FormField label="Category Name" required>
            <InputField
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Rainbow Collection"
              style={errors.name ? { borderColor: T.red } : undefined}
            />
            <FieldError msg={errors.name} />
          </FormField>

          {/* Slug */}
          <FormField label="Slug (optional)">
            <InputField
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="rainbow-collection (auto-generated if empty)"
            />
          </FormField>

          {/* Brand */}
          <FormField label="Brand (optional)">
            <SelectField
              options={[
                { value: "", label: "— No brand —" },
                ...brands.map((b) => ({ value: b.id, label: b.name }))
              ]}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              placeholder="Select brand..."
            />
          </FormField>

          {/* Parent Category */}
          <FormField
            label="Parent Category (optional — leave empty for top-level)"
            mb={0}
          >
            <SelectField
              options={[
                { value: "", label: "— None (Top-level category) —" },
                ...parentOptions.map((p) => ({ value: p.id, label: p.name }))
              ]}
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              placeholder="Select parent category..."
            />
            <Text fontSize="11.5px" color={T.sub} mt={1.5}>
              Select a parent to make this a subcategory (e.g. &quot;Bella&quot;
              → &quot;Diamond Collection&quot;)
            </Text>
          </FormField>
        </Box>
        <HStack justify="flex-end" gap={3}>
          <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={handleSave}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </AdminButton>
        </HStack>
      </AdminModal>

      {/* DELETE MODAL */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        titleColor={T.redText}
        maxW="md"
        description={
          <>
            Delete <b>{editingCategory?.name}</b>?
            {(editingCategory as CategoryData & { children?: CategoryData[] })
              ?.children?.length
              ? " This will also remove all its subcategories!"
              : " This cannot be undone."}
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

"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
  Textarea,
  Switch,
  NativeSelect,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  T,
  PageHeader,
  SectionCard,
  FormField,
  AdminButton,
  InputField,
  AdminLoader,
} from "@/components/admin/ui";

const POWERS = [
  "0.00",
  "-0.50",
  "-0.75",
  "-1.00",
  "-1.25",
  "-1.50",
  "-1.75",
  "-2.00",
  "-2.25",
  "-2.50",
  "-2.75",
  "-3.00",
  "-3.25",
  "-3.50",
  "-3.75",
  "-4.00",
  "-4.50",
  "-5.00",
  "-5.50",
  "-6.00",
];
const LENS_COLORS = [
  "Blue",
  "Brown",
  "Golden",
  "Gray",
  "Green",
  "Hazel",
  "Purple",
  "Yellow",
  "Black",
  "Other",
];

const selectStyle = {
  size: "md" as const,
  borderRadius: "8px",
  borderColor: T.border,
  fontSize: "13.5px",
  h: "38px",
  px: "12px",
  bg: "white",
  _focus: {
    borderColor: T.green,
    boxShadow: "0 0 0 2px rgba(16,185,129,0.12)",
  },
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    color: "",
    disposability: "ONE_DAY",

    price: "",
    comparePrice: "",
    stockCount: "0",
    status: "DRAFT",
    featured: false,
    inStock: true,
    brandId: "",
    categoryId: "",
  });

  // Brands + categories fetched from DB for dropdowns
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [dbCategories, setDbCategories] = useState<
    { id: string; name: string; parentId: string | null; brandId: string | null }[]
  >([]);

  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [supportsEyesight, setSupportsEyesight] = useState(true);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const togglePower = (v: string) =>
    setSelectedPowers((p) =>
      p.includes(v) ? p.filter((x) => x !== v) : [...p, v],
    );

  const load = useCallback(async () => {
    try {
      const [res, brandsRes, catsRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch("/api/brands"),
        fetch("/api/categories?flat=1"),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Not found");
      const brandsData = await brandsRes.json();
      const catsData = await catsRes.json();
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setDbCategories(catsData.categories || []);

      setForm({
        title: data.title ?? "",
        slug: data.slug ?? "",
        description: data.description ?? "",
        color: data.color
          ? data.color.charAt(0) + data.color.slice(1).toLowerCase()
          : "",
        disposability: data.disposability ?? "ONE_DAY",
        price: String(data.price ?? ""),
        comparePrice:
          data.comparePrice != null ? String(data.comparePrice) : "",
        stockCount: String(data.stockCount ?? 0),
        status: data.status ?? "DRAFT",
        featured: data.featured ?? false,
        inStock: data.inStock ?? true,
        brandId: data.brand?.id ?? "",
        categoryId: data.categoryId ?? "",
      });

      const powers: string[] = (data.powerOptions ?? []).map(
        (p: { value: string }) => p.value,
      );
      setSelectedPowers(powers);
      setSupportsEyesight(powers.length > 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (asDraft = false) => {
    if (!form.title || !form.price) {
      setError("Title and price are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          description: form.description || null,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice
            ? parseFloat(form.comparePrice)
            : null,
          color: form.color ? form.color.toUpperCase() : null,
          disposability: form.disposability,
          inStock: form.inStock,
          stockCount: parseInt(form.stockCount || "0"),
          status: asDraft ? "DRAFT" : form.status,
          featured: form.featured,
          brandId: form.brandId || null,
          categoryId: form.categoryId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update product");
      router.push("/admin/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoader message="Loading product..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      {/* Breadcrumb */}
      <Flex align="center" gap={1.5} mb={5}>
        <NextLink href="/admin/products">
          <Text
            fontSize="13px"
            color={T.sub}
            cursor="pointer"
            _hover={{ color: T.text }}
          >
            Products
          </Text>
        </NextLink>
        <Text fontSize="13px" color="#cbd5e1">
          /
        </Text>
        <Text
          fontSize="13px"
          fontWeight={600}
          color={T.text}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          maxW="320px"
        >
          {form.title || "Edit product"}
        </Text>
      </Flex>

      {error && (
        <Box
          bg="#fff1f2"
          border="1px solid #fecdd3"
          borderRadius="8px"
          px={4}
          py={3}
          mb={4}
        >
          <Text fontSize="13px" color={T.red}>
            {error}
          </Text>
        </Box>
      )}

      <PageHeader title="Edit product">
        <AdminButton
          variant="secondary"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          Save as draft
        </AdminButton>
        <AdminButton
          variant="primary"
          px={6}
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </PageHeader>

      <Grid templateColumns="1fr 300px" gap={5}>
        {/* ── LEFT ── */}
        <GridItem>
          <VStack gap={4} align="stretch">
            <SectionCard title="Product information">
              <FormField label="Title" required>
                <InputField
                  iconName="tag"
                  placeholder="Product title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </FormField>
              <FormField label="Slug" hint="Unique URL identifier">
                <InputField
                  iconName="hash"
                  placeholder="product-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </FormField>
              <FormField label="Description" mb={0}>
                <Textarea
                  size="md"
                  borderRadius="8px"
                  borderColor={T.border}
                  rows={4}
                  fontSize="13.5px"
                  px="12px"
                  py="10px"
                  bg="white"
                  placeholder="Describe this product for customers..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  _focus={{
                    borderColor: T.green,
                    boxShadow: "0 0 0 2px rgba(16,185,129,0.12)",
                  }}
                  _placeholder={{ color: "#cbd5e1" }}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Lens details"
              subtitle="Brand, color, and wear type"
            >
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormField label="Brand">
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      {...selectStyle}
                      value={form.brandId}
                      onChange={(e) => set("brandId", e.target.value)}
                    >
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </FormField>
                <FormField label="Category">
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      {...selectStyle}
                      value={form.categoryId}
                      onChange={(e) => set("categoryId", e.target.value)}
                    >
                      <option value="">Select category</option>
                      {dbCategories
                        .filter((c) => form.brandId ? c.brandId === form.brandId : !c.brandId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.parentId ? `↳ ${c.name}` : c.name}
                          </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </FormField>
                <FormField label="Color">
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      {...selectStyle}
                      value={form.color}
                      onChange={(e) => set("color", e.target.value)}
                    >
                      <option value="">Select color</option>
                      {LENS_COLORS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </FormField>
                <FormField label="Disposability">
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      {...selectStyle}
                      value={form.disposability}
                      onChange={(e) => set("disposability", e.target.value)}
                    >
                      <option value="ONE_DAY">One Day</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </FormField>

              </Grid>
            </SectionCard>

            <SectionCard
              title="Power options"
              subtitle="Configure available powers for this lens"
            >
              <Flex align="center" gap={3} mb={4}>
                <Switch.Root
                  checked={supportsEyesight}
                  onCheckedChange={(e) => setSupportsEyesight(!!e.checked)}
                  colorPalette="green"
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
                <Text fontSize="13px" color={T.text}>
                  {supportsEyesight
                    ? "Customers can choose Plain or with power"
                    : "Plain only — no power selection"}
                </Text>
              </Flex>

              {supportsEyesight && (
                <>
                  <Box h="1px" bg={T.bg} mb={4} />
                  <Text fontSize="13px" fontWeight={600} color={T.text} mb={1}>
                    Available power values
                  </Text>
                  <Text fontSize="12px" color={T.sub} mb={3}>
                    Click to toggle:
                  </Text>
                  <Flex gap={2} flexWrap="wrap">
                    {POWERS.map((p) => {
                      const active = selectedPowers.includes(p);
                      return (
                        <Box
                          key={p}
                          onClick={() => togglePower(p)}
                          px={3}
                          py={1.5}
                          borderRadius="8px"
                          cursor="pointer"
                          fontSize="13px"
                          fontWeight={active ? 700 : 400}
                          border="1px solid"
                          borderColor={active ? T.green : T.border}
                          bg={active ? T.greenLight : "white"}
                          color={active ? "#065f46" : T.gray}
                          transition="all 0.1s"
                          userSelect="none"
                        >
                          {p}
                        </Box>
                      );
                    })}
                  </Flex>
                  <Text fontSize="12px" color={T.sub} mt={3}>
                    {selectedPowers.length} / {POWERS.length} powers selected
                  </Text>
                </>
              )}
            </SectionCard>
          </VStack>
        </GridItem>

        {/* ── RIGHT ── */}
        <GridItem>
          <VStack gap={4} align="stretch">
            <SectionCard title="Status">
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  {...selectStyle}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </SectionCard>

            <SectionCard title="Pricing">
              <FormField label="Price (PKR)" required>
                <InputField
                  prefix="PKR"
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </FormField>
              <FormField label="Compare-at price" mb={0}>
                <InputField
                  prefix="PKR"
                  type="number"
                  placeholder="0"
                  value={form.comparePrice}
                  onChange={(e) => set("comparePrice", e.target.value)}
                />
              </FormField>
            </SectionCard>

            <SectionCard title="Inventory">
              <FormField label="Stock quantity">
                <InputField
                  iconName="package"
                  type="number"
                  placeholder="0"
                  value={form.stockCount}
                  onChange={(e) => set("stockCount", e.target.value)}
                />
              </FormField>
              <Flex align="center" gap={2.5} mt={3}>
                <Switch.Root
                  checked={form.inStock}
                  onCheckedChange={(e) => set("inStock", !!e.checked)}
                  colorPalette="green"
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
                <Text fontSize="13px" color={T.text}>
                  In stock
                </Text>
              </Flex>
            </SectionCard>

            <SectionCard title="Visibility">
              <Flex align="center" justify="space-between">
                <Text fontSize="13px" color={T.text}>
                  Featured product
                </Text>
                <Switch.Root
                  checked={form.featured}
                  onCheckedChange={(e) => set("featured", !!e.checked)}
                  colorPalette="green"
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Flex>
            </SectionCard>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

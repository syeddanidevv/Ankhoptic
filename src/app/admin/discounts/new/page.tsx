"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import {
  Box, Flex, HStack, VStack, Text, RadioGroup, Checkbox,
} from "@chakra-ui/react";
import {
  T, PageHeader, SectionCard, FormField, AdminButton, InputField, AdminLoader, SelectField,
} from "@/components/admin/ui";
import toast from "react-hot-toast";

type Category = { id: string; name: string };
type Brand    = { id: string; name: string };

export default function NewDiscountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [isLoadingItem, setIsLoadingItem] = useState(!!editId);

  // Form fields
  const [title, setTitle]         = useState("");
  const [code, setCode]           = useState("");
  const [type, setType]           = useState("PERCENTAGE");
  const [value, setValue]         = useState<number | "">("");
  const [minOrder, setMinOrder]   = useState<number | "">("");
  const [startsAt, setStartsAt]   = useState("");
  const [endsAt, setEndsAt]       = useState("");
  const [active, setActive]       = useState(true);
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [appliesTo, setAppliesTo] = useState("all"); // all | categories | brands
  const [selectedCats, setSelectedCats]   = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // DB data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/categories?flat=1")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || d || []));
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || d || []));

    if (editId) {
      fetch(`/api/discounts/${editId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.discount) {
            const d = data.discount;
            setTitle(d.title);
            setCode(d.code || "");
            setType(d.type);
            setValue(d.value);
            setMinOrder(d.minOrderAmount || "");
            setStartsAt(d.startsAt ? new Date(d.startsAt).toISOString().slice(0, 16) : "");
            setEndsAt(d.endsAt ? new Date(d.endsAt).toISOString().slice(0, 16) : "");
            setActive(d.active);
            setIsAutomatic(d.isAutomatic);
            
            if (d.appliesToAll) {
              setAppliesTo("all");
            } else if (d.categories && d.categories.length > 0) {
              setAppliesTo("categories");
              setSelectedCats(d.categories.map((c: { id: string }) => c.id));
            } else if (d.brands && d.brands.length > 0) {
              setAppliesTo("brands");
              setSelectedBrands(d.brands.map((b: { id: string }) => b.id));
            } else {
              setAppliesTo("all");
            }
          }
        })
        .finally(() => setIsLoadingItem(false));
    }
  }, [editId]);

  const toggleCat = (id: string) =>
    setSelectedCats((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const toggleBrand = (id: string) =>
    setSelectedBrands((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const handleSave = async () => {
    if (!title.trim() || !value) return toast.error("Title and value required");
    setSubmitting(true);
    try {
      const endpoint = editId ? `/api/discounts/${editId}` : "/api/discounts";
      const method = editId ? "PUT" : "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, code: code || null, type, value: Number(value),
          minOrderAmount: minOrder ? Number(minOrder) : null,
          startsAt: startsAt || null, endsAt: endsAt || null,
          active, isAutomatic,
          appliesToAll: appliesTo === "all",
          categoryIds: appliesTo === "categories" ? selectedCats : [],
          brandIds:    appliesTo === "brands"     ? selectedBrands : [],
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(editId ? "Discount updated!" : "Discount created!");
      router.push("/admin/discounts");
    } catch {
      toast.error(editId ? "Failed to update discount" : "Failed to create discount");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingItem) {
    return <AdminLoader message="Loading discount details..." />;
  }


  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <Flex direction="column" gap={5}>
        <PageHeader title={editId ? "Edit Discount / Sale" : "Create Discount / Sale"} subtitle="% off or fixed amount — apply to entire store, category, or brand.">
          <NextLink href="/admin/discounts" style={{ textDecoration: "none" }}>
            <AdminButton variant="secondary">Discard</AdminButton>
          </NextLink>
          <AdminButton variant="primary" onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </AdminButton>
        </PageHeader>

        <HStack align="flex-start" gap={6} w="100%" flexWrap={{ base: "wrap", lg: "nowrap" }}>
          {/* ── MAIN COLUMN ── */}
          <VStack flex={1} gap={5} align="stretch" w="100%" minW="300px">

        {/* ── Title & Code ── */}
        <SectionCard title="Title & Code">
          <Flex direction={{ base: "column", sm: "row" }} gap={4}>
            <Box flex={1}>
              <FormField label="Title" hint="Customers see this on checkout.">
                <InputField value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Eid Sale 20%" />
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label="Promo Code (optional)" hint="Leave empty for automatic sale (no code needed).">
                <InputField value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. EID20" />
              </FormField>
            </Box>
          </Flex>
        </SectionCard>

        {/* ── Discount Type & Value ── */}
        <SectionCard title="Discount Type & Value">
          <Flex direction={{ base: "column", sm: "row" }} gap={4} align={{ base: "stretch", sm: "flex-start" }}>
            <Box flex={1}>
              <FormField label="Type">
                <SelectField
                  options={[
                    { value: "PERCENTAGE", label: "Percentage (%)" },
                    { value: "FIXED_AMOUNT", label: "Fixed Amount (Rs.)" },
                  ]}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label={type === "PERCENTAGE" ? "Discount %" : "Amount (Rs.)"}>
                <InputField type="number" value={value} onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={type === "PERCENTAGE" ? "20" : "500"} />
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label="Min Order (optional)">
                <InputField type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" />
              </FormField>
            </Box>
          </Flex>
        </SectionCard>

        {/* ── Applies To ── */}
        <SectionCard title="Applies To" subtitle="Where will this discount apply?">
          <RadioGroup.Root value={appliesTo} onValueChange={(e: { value: string | null }) => setAppliesTo(e.value || "all")}>
            <VStack align="flex-start" gap={3}>
              <RadioGroup.Item value="all">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>Entire store</RadioGroup.ItemText>
              </RadioGroup.Item>

              <RadioGroup.Item value="categories">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>Specific categories</RadioGroup.ItemText>
              </RadioGroup.Item>
              {appliesTo === "categories" && (
                <Box pl={8} w="100%">
                  <VStack align="flex-start" gap={2} bg={T.grayBg} p={4} borderRadius="8px" border={`1px solid ${T.border}`} maxH="200px" overflowY="auto">
                    {categories.length === 0 && <Text fontSize="13px" color={T.sub}>Loading...</Text>}
                    {categories.map((c) => (
                      <Checkbox.Root key={c.id} checked={selectedCats.includes(c.id)} onCheckedChange={() => toggleCat(c.id)} size="sm">
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label fontSize="13px">{c.name}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </VStack>
                </Box>
              )}

              <RadioGroup.Item value="brands">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>Specific brands</RadioGroup.ItemText>
              </RadioGroup.Item>
              {appliesTo === "brands" && (
                <Box pl={8} w="100%">
                  <VStack align="flex-start" gap={2} bg={T.grayBg} p={4} borderRadius="8px" border={`1px solid ${T.border}`}>
                    {brands.length === 0 && <Text fontSize="13px" color={T.sub}>Loading...</Text>}
                    {brands.map((b) => (
                      <Checkbox.Root key={b.id} checked={selectedBrands.includes(b.id)} onCheckedChange={() => toggleBrand(b.id)} size="sm">
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label fontSize="13px">{b.name}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </RadioGroup.Root>
        </SectionCard>

          </VStack>

          {/* ── SIDE COLUMN ── */}
          <VStack w={{ base: "100%", lg: "320px" }} flexShrink={0} gap={5} align="stretch">
            {/* ── Status ── */}
            <SectionCard title="Status">
              <VStack align="flex-start" gap={4}>
                <Checkbox.Root checked={active} onCheckedChange={(e) => setActive(!!e.checked)} size="md">
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="14px" fontWeight={500} color={T.text}>
                    Active Discount
                  </Checkbox.Label>
                </Checkbox.Root>
                <Checkbox.Root checked={isAutomatic} onCheckedChange={(e) => setIsAutomatic(!!e.checked)} size="md">
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="14px" fontWeight={500} color={T.text}>
                    Automatic (no code required)
                  </Checkbox.Label>
                </Checkbox.Root>
              </VStack>
            </SectionCard>

            {/* ── Active Dates ── */}
            <SectionCard title="Active Dates">
              <VStack align="stretch" gap={4}>
                <FormField label="Start date">
                  <InputField type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                </FormField>
                <FormField label="End date (optional)">
                  <InputField type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                </FormField>
              </VStack>
            </SectionCard>
          </VStack>
        </HStack>

        {/* ── Footer Actions ── */}
        <Flex justify="flex-end" py={4} borderTop={`1px solid ${T.border}`} mt={4}>
          <HStack gap={3}>
            <NextLink href="/admin/discounts" style={{ textDecoration: "none" }}>
              <AdminButton variant="secondary">Discard</AdminButton>
            </NextLink>
            <AdminButton variant="primary" onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : "Save Discount"}
            </AdminButton>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}

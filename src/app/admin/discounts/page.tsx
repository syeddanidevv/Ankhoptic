"use client";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { Box, Text, HStack, VStack, Checkbox } from "@chakra-ui/react";
import {
  T,
  PageHeader,
  StatCard,
  TabBar,
  FilterBar,
  BulkBar,
  TableShell,
  THead,
  TR,
  TD,
  EmptyRow,
  StatusBadge,
  AdminButton,
  FormField,
  InputField,
  AdminModal,
  AdminLoader,
} from "@/components/admin/ui";
import toast from "react-hot-toast";

type Discount = {
  id: string;
  title: string;
  code?: string | null;
  type: string;
  value: number;
  minOrderAmount?: number | null;
  maxUsage?: number | null;
  usedCount: number;
  perCustomerMax?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  active: boolean;
  isAutomatic: boolean;
  appliesToAll: boolean;
  categories?: { name: string }[];
  products?: { title: string }[];
  brands?: { name: string }[];
};

const TYPE_BG: Record<string, string> = {
  Percentage: "#f5f3ff",
  "Fixed amount": "#eff6ff",
  "Free shipping": "#f0fdf4",
};
const TYPE_CLR: Record<string, string> = {
  Percentage: T.purple,
  "Fixed amount": T.blue,
  "Free shipping": "#166534",
};

export default function DiscountsPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // Real Data States
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState(0);
  const [minOrder, setMinOrder] = useState<number | "">("");
  const [active, setActive] = useState(true);

  const fetchDiscounts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tab !== "All") params.set("status", tab.toUpperCase());

    fetch(`/api/discounts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setDiscounts(d.discounts || []);
        setTotal(d.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Fetch from our new Prisma endpoint
  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const openAddModal = () => {
    setEditingDiscount(null);
    setTitle("");
    setCode("");
    setType("PERCENTAGE");
    setValue(0);
    setMinOrder("");
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (d: Discount) => {
    setEditingDiscount(d);
    setTitle(d.title);
    setCode(d.code || "");
    setType(d.type);
    setValue(d.value);
    setMinOrder(d.minOrderAmount || "");
    setActive(d.active);
    setIsModalOpen(true);
  };

  const openDeleteModal = (d: Discount) => {
    setEditingDiscount(d);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || value <= 0)
      return toast.error("Valid title and value are required");

    setSubmitting(true);
    try {
      const isNew = !editingDiscount;
      const endpoint = isNew
        ? "/api/discounts"
        : `/api/discounts/${editingDiscount.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          code: code || null,
          type,
          value: Number(value),
          minOrderAmount: minOrder ? Number(minOrder) : null,
          active,
        }),
      });

      if (!res.ok) throw new Error("Failed to save discount");

      toast.success(isNew ? "Discount created" : "Discount updated");
      setIsModalOpen(false);
      fetchDiscounts();
    } catch (e) {
      toast.error("Error saving discount");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingDiscount) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/discounts/${editingDiscount.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete discount");
      toast.success("Discount deleted");
      setIsDeleteModalOpen(false);
      fetchDiscounts();
    } catch (e) {
      toast.error("Error deleting discount");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = discounts.filter((d) => d.active).length;
  // Endpoint handles EXPIRED logic, any returned as non-active with passed endsAt is expired
  const expiredCount = discounts.filter(
    (d) => !d.active && d.endsAt && new Date(d.endsAt) < new Date(),
  ).length;
  const totalUsed = discounts.reduce((acc, d) => acc + (d.usedCount || 0), 0);

  if (loading) return <AdminLoader message="Loading discounts..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader
        title="Discounts & Sales"
        subtitle="Manage automatic sales and promo codes"
      >
        <AdminButton variant="secondary" onClick={openAddModal}>
          Create promo code
        </AdminButton>
        <NextLink href="/admin/discounts/new" style={{ textDecoration: "none" }}>
          <AdminButton variant="primary">Create sale</AdminButton>
        </NextLink>
      </PageHeader>

      <HStack gap={4} mb={5}>
        <StatCard label="Total Sales/Codes" value={total} />
        <StatCard label="Active" value={activeCount} color={T.green} />
        <StatCard label="Expired" value={expiredCount} color={T.red} />
        <StatCard label="Total Usage" value={totalUsed} color={T.blue} />
      </HStack>

      <TableShell
        footerText={`${total} discounts found`}
        header={
          <>
            <TabBar
              tabs={["All", "Active", "Expired", "Scheduled"]}
              active={tab}
              onChange={setTab}
            />
            <FilterBar
              search={search}
              onSearch={setSearch}
              placeholder="Search sales & codes..."
            />
            <BulkBar
              count={selected.length}
              actions={[
                { label: "Deactivate" },
                { label: "Delete", danger: true },
              ]}
            />
          </>
        }
      >
        <THead
          checkboxCol
          columns={[
            "Title",
            "Type",
            "Value",
            "Applies To",
            "Usage",
            "Status",
            "Expires",
            "",
          ]}
        />
        <tbody>
          {discounts.length === 0 ? (
            <EmptyRow cols={8} message="No discounts found." />
          ) : (
            discounts.map((d, i) => {
              // Determine status badge dynamically
              const now = new Date();
              let statusLabel = "DRAFT";
              let badgeType: "green" | "red" | "blue" | "gray" = "gray";

              if (!d.active) {
                statusLabel = "Draft";
                badgeType = "gray";
              } else if (d.endsAt && new Date(d.endsAt) < now) {
                statusLabel = "Expired";
                badgeType = "red";
              } else if (d.startsAt && new Date(d.startsAt) > now) {
                statusLabel = "Scheduled";
                badgeType = "blue";
              } else {
                statusLabel = "Active";
                badgeType = "green";
              }

              // Determine applies info
              let appliesLabel = d.appliesToAll
                ? "Entire Store"
                : "Specific Items";
              if (d.brands && d.brands.length > 0) {
                appliesLabel = `Brand: ${d.brands[0].name}${d.brands.length > 1 ? ` +${d.brands.length - 1}` : ""}`;
              } else if (d.categories && d.categories.length > 0) {
                appliesLabel = `Category: ${d.categories[0].name}${d.categories.length > 1 ? ` +${d.categories.length - 1}` : ""}`;
              } else if (d.products && d.products.length > 0) {
                appliesLabel = `Product: ${d.products[0].title}${d.products.length > 1 ? ` +${d.products.length - 1}` : ""}`;
              }

              return (
                <TR key={d.id} index={i}>
                  <TD>
                    <Checkbox.Root
                      checked={selected.includes(d.id)}
                      onCheckedChange={() => toggle(d.id)}
                      size="sm"
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </TD>
                  <TD>
                    <VStack gap={0.5} align="flex-start">
                      <Text fontSize="13px" fontWeight={600} color={T.text}>
                        {d.title}
                      </Text>
                      {d.code && (
                        <Box
                          bg={T.text}
                          color="white"
                          fontSize="11px"
                          fontWeight={700}
                          px={1.5}
                          py={0.5}
                          borderRadius="4px"
                          fontFamily="mono"
                        >
                          Code: {d.code}
                        </Box>
                      )}
                    </VStack>
                  </TD>
                  <TD>
                    <Box
                      display="inline-block"
                      px={2.5}
                      py={0.5}
                      borderRadius="full"
                      bg={TYPE_BG[d.type] ?? T.grayBg}
                      color={TYPE_CLR[d.type] ?? T.gray}
                      fontSize="11px"
                      fontWeight={600}
                    >
                      {d.type}
                    </Box>
                  </TD>
                  <TD>
                    <Text fontSize="13px" fontWeight={600} color={T.green}>
                      {d.type === "PERCENTAGE"
                        ? `${d.value}% Off`
                        : d.type === "FREE_SHIPPING"
                          ? "Free Ship"
                          : `Rs. ${d.value} Off`}
                    </Text>
                  </TD>
                  <TD>
                    <Text fontSize="12.5px" color={T.sub}>
                      {appliesLabel}
                    </Text>
                  </TD>
                  <TD>
                    <Text fontSize="12.5px" color={T.sub}>
                      {d.usedCount} uses
                    </Text>
                  </TD>
                  <TD>
                    <StatusBadge variant={badgeType}>{statusLabel}</StatusBadge>
                  </TD>
                  <TD>
                    <Text fontSize="12.5px" color={T.sub}>
                      {d.endsAt
                        ? new Date(d.endsAt).toLocaleDateString()
                        : "Never ends"}
                    </Text>
                  </TD>
                  <TD>
                    <HStack gap={1.5}>
                      <AdminButton
                        variant="secondary"
                        size="xs"
                        onClick={() => openEditModal(d)}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="xs"
                        onClick={() => openDeleteModal(d)}
                      >
                        Delete
                      </AdminButton>
                    </HStack>
                  </TD>
                </TR>
              );
            })
          )}
        </tbody>
      </TableShell>

      {/* CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiscount ? "Edit Discount" : "Add Discount"}
        maxW="lg"
      >
        <Box mb={4}>
          <FormField label="Discount Title">
            <InputField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale 20%"
            />
          </FormField>
          <FormField label="Promo Code (Optional)">
            <InputField
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SUMMER20"
            />
          </FormField>
          <FormField label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${T.border}`,
                background: T.bg,
                color: T.text,
              }}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </FormField>
          <HStack gap={4}>
            <Box flex={1}>
              <FormField label="Value">
                <InputField
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                />
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label="Min Order Amount (optional)">
                <InputField
                  type="number"
                  value={minOrder}
                  onChange={(e) =>
                    setMinOrder(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </FormField>
            </Box>
          </HStack>
          <FormField label="Status" mb={2}>
            <HStack>
              <Checkbox.Root
                checked={active}
                onCheckedChange={(e) => setActive(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Active Discount</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
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
        title="Delete Discount"
        titleColor={T.redText}
        maxW="md"
        description={
          <>
            Are you sure you want to delete the discount{" "}
            <b>{editingDiscount?.title}</b>? This action cannot be undone.
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

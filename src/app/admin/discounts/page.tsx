"use client";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { Box, Text, Grid, HStack, VStack, Checkbox } from "@chakra-ui/react";
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
  AdminModal,
  AdminLoader,
} from "@/components/admin/ui";
import { useRouter } from "next/navigation";
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
  Percentage: T.purpleBg,
  "Fixed amount": T.blueBg,
  "Free shipping": T.greenBg,
};
const TYPE_CLR: Record<string, string> = {
  Percentage: T.purple,
  "Fixed amount": T.blue,
  "Free shipping": T.greenDark,
};

export default function DiscountsPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  // Real Data States
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingDiscount, setDeletingDiscount] = useState<Discount | null>(null);

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

  const openDeleteModal = (d: Discount) => {
    setDeletingDiscount(d);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDiscount) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/discounts/${deletingDiscount.id}`, {
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
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader
        title="Discounts & Sales"
        subtitle="Manage automatic sales and promo codes"
      >
        <NextLink href="/admin/discounts/new" style={{ textDecoration: "none" }}>
          <AdminButton variant="primary">Create sale / discount</AdminButton>
        </NextLink>
      </PageHeader>

      <Grid templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }} gap={4} mb={5}>
        <StatCard label="Total Sales/Codes" value={total} />
        <StatCard label="Active" value={activeCount} color={T.green} />
        <StatCard label="Expired" value={expiredCount} color={T.red} />
        <StatCard label="Total Usage" value={totalUsed} color={T.blue} />
      </Grid>

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
                        onClick={() => router.push(`/admin/discounts/new?id=${d.id}`)}
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
            <b>{deletingDiscount?.title}</b>? This action cannot be undone.
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

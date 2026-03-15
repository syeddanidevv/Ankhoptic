"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Textarea,
  NativeSelect,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  T,
  SectionCard,
  AdminButton,
  StatusBadge,
  AdminLoader,
} from "@/components/admin/ui";

type OrderItem = {
  id: string;
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
  lensType: string;
  rightEyePower: string | null;
  aftercareName: string | null;
  aftercarePrice: number;
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  customer: { id: string; name: string; email: string } | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  notes: string | null;
  trackingNumber: string | null;
  items: OrderItem[];
  createdAt: string;
};

const selectStyle = {
  size: "sm" as const,
  borderRadius: "8px",
  borderColor: T.border,
  fontSize: "13px",
  h: "34px",
  px: "10px",
  bg: "white",
  _focus: {
    borderColor: T.green,
    boxShadow: "0 0 0 2px rgba(16,185,129,0.12)",
  },
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];
const PAY_STATUSES = [
  "UNPAID",
  "PAID",
  "PARTIALLY_PAID",
  "COD_PENDING",
  "REFUNDED",
];
const FULFILL_STATUSES = [
  "UNFULFILLED",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "RESTOCKED",
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [edits, setEdits] = useState({
    status: "",
    paymentStatus: "",
    fulfillmentStatus: "",
    trackingNumber: "",
    notes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
      setEdits({
        status: data.status,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        trackingNumber: data.trackingNumber ?? "",
        notes: data.notes ?? "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edits),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const customerName = order?.customer?.name ?? order?.guestName ?? "Guest";
  const customerEmail = order?.customer?.email ?? order?.guestEmail ?? "—";
  const customerPhone = order?.guestPhone ?? "—";
  const addr = order?.shippingAddress;

  if (loading) return <AdminLoader message="Loading order..." />;

  if (!order)
    return (
      <Box bg={T.bg} minH="100%" p={6}>
        <Text color={T.red} fontSize="13px">
          {error || "Order not found"}
        </Text>
      </Box>
    );

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      {/* Breadcrumb */}
      <Flex align="center" gap={1.5} mb={5}>
        <NextLink href="/admin/orders">
          <Text
            fontSize="13px"
            color={T.sub}
            cursor="pointer"
            _hover={{ color: T.text }}
          >
            Orders
          </Text>
        </NextLink>
        <Text fontSize="13px" color="#cbd5e1">
          /
        </Text>
        <Text fontSize="13px" fontWeight={600} color={T.text}>
          #{order.orderNumber}
        </Text>
      </Flex>

      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        mb={5}
        flexWrap="wrap"
        gap={3}
      >
        <Box>
          <Text fontSize="20px" fontWeight={800} color={T.text}>
            Order #{order.orderNumber}
          </Text>
          <Text fontSize="12.5px" color={T.sub} mt={0.5}>
            {new Date(order.createdAt).toLocaleString("en-PK", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </Box>
        <HStack gap={2}>
          <StatusBadge status={order.paymentStatus}>
            {order.paymentStatus}
          </StatusBadge>
          <StatusBadge status={order.fulfillmentStatus}>
            {order.fulfillmentStatus}
          </StatusBadge>
          <AdminButton
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            px={5}
          >
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
        </HStack>
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

      <Grid templateColumns="1fr 300px" gap={5}>
        {/* ── LEFT ── */}
        <GridItem>
          <VStack gap={4} align="stretch">
            {/* Items */}
            <SectionCard title="Order items">
              <Box
                border={`1px solid ${T.border}`}
                borderRadius="8px"
                overflow="hidden"
              >
                {order.items.map((item, i) => (
                  <Flex
                    key={item.id}
                    align="flex-start"
                    gap={3}
                    p={3}
                    borderBottom={
                      i < order.items.length - 1
                        ? `1px solid ${T.border}`
                        : undefined
                    }
                  >
                    <Box
                      w="40px"
                      h="40px"
                      bg={T.bg}
                      border={`1px solid ${T.border}`}
                      borderRadius="6px"
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="18px"
                    >
                      👁
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="13px" fontWeight={600} color={T.text}>
                        {item.productTitle}
                      </Text>
                      <Text fontSize="11.5px" color={T.sub} mt={0.5}>
                        {item.lensType === "EYESIGHT"
                          ? `Power: ${item.rightEyePower ?? "—"}`
                          : "Plain"}
                        {item.aftercareName ? ` · ${item.aftercareName}` : ""}
                        {" · Qty "}
                        {item.qty}
                      </Text>
                    </Box>
                    <Text fontSize="13px" fontWeight={700} color={T.text}>
                      Rs {item.total.toLocaleString()}
                    </Text>
                  </Flex>
                ))}
              </Box>

              {/* Totals */}
              <Box mt={3}>
                {[
                  {
                    label: "Subtotal",
                    value: `Rs ${order.subtotal.toLocaleString()}`,
                  },
                  {
                    label: "Shipping",
                    value:
                      order.shippingCost === 0
                        ? "Free"
                        : `Rs ${order.shippingCost}`,
                  },
                  ...(order.discountAmount > 0
                    ? [
                        {
                          label: "Discount",
                          value: `- Rs ${order.discountAmount.toLocaleString()}`,
                        },
                      ]
                    : []),
                ].map((r) => (
                  <Flex
                    key={r.label}
                    justify="space-between"
                    py={1.5}
                    borderBottom={`1px solid ${T.border}`}
                  >
                    <Text fontSize="12.5px" color={T.sub}>
                      {r.label}
                    </Text>
                    <Text fontSize="12.5px" color={T.text}>
                      {r.value}
                    </Text>
                  </Flex>
                ))}
                <Flex justify="space-between" pt={2}>
                  <Text fontSize="14px" fontWeight={700} color={T.text}>
                    Total
                  </Text>
                  <Text fontSize="14px" fontWeight={700} color={T.text}>
                    Rs {order.total.toLocaleString()}
                  </Text>
                </Flex>
              </Box>
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Order notes">
              <Textarea
                size="md"
                borderRadius="8px"
                borderColor={T.border}
                rows={3}
                fontSize="13px"
                px="12px"
                py="10px"
                bg="white"
                placeholder="Add internal note…"
                value={edits.notes}
                onChange={(e) =>
                  setEdits((p) => ({ ...p, notes: e.target.value }))
                }
                _focus={{
                  borderColor: T.green,
                  boxShadow: "0 0 0 2px rgba(16,185,129,0.12)",
                }}
                _placeholder={{ color: "#cbd5e1" }}
              />
            </SectionCard>
          </VStack>
        </GridItem>

        {/* ── RIGHT ── */}
        <GridItem>
          <VStack gap={4} align="stretch">
            {/* Status */}
            <SectionCard title="Order status">
              <Text fontSize="12px" fontWeight={600} color={T.sub} mb={1.5}>
                Order status
              </Text>
              <NativeSelect.Root size="sm" mb={3}>
                <NativeSelect.Field
                  {...selectStyle}
                  value={edits.status}
                  onChange={(e) =>
                    setEdits((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              <Text fontSize="12px" fontWeight={600} color={T.sub} mb={1.5}>
                Payment status
              </Text>
              <NativeSelect.Root size="sm" mb={3}>
                <NativeSelect.Field
                  {...selectStyle}
                  value={edits.paymentStatus}
                  onChange={(e) =>
                    setEdits((p) => ({ ...p, paymentStatus: e.target.value }))
                  }
                >
                  {PAY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              <Text fontSize="12px" fontWeight={600} color={T.sub} mb={1.5}>
                Fulfillment status
              </Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  {...selectStyle}
                  value={edits.fulfillmentStatus}
                  onChange={(e) =>
                    setEdits((p) => ({
                      ...p,
                      fulfillmentStatus: e.target.value,
                    }))
                  }
                >
                  {FULFILL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </SectionCard>

            {/* Tracking */}
            <SectionCard title="Tracking number">
              <input
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  background: "white",
                  color: T.text,
                  fontFamily: "inherit",
                  outline: "none",
                }}
                placeholder="Enter tracking number…"
                value={edits.trackingNumber}
                onChange={(e) =>
                  setEdits((p) => ({ ...p, trackingNumber: e.target.value }))
                }
              />
            </SectionCard>

            {/* Customer */}
            <SectionCard title="Customer">
              <VStack gap={1.5} align="stretch">
                <Text fontSize="13px" fontWeight={700} color={T.text}>
                  {customerName}
                </Text>
                <Text fontSize="12.5px" color={T.sub}>
                  {customerEmail}
                </Text>
                <Text fontSize="12.5px" color={T.sub}>
                  {customerPhone}
                </Text>
                {order.customer?.id && (
                  <NextLink href={`/admin/customers`}>
                    <Text
                      fontSize="12px"
                      color={T.green}
                      cursor="pointer"
                      mt={1}
                    >
                      View customer →
                    </Text>
                  </NextLink>
                )}
              </VStack>
            </SectionCard>

            {/* Shipping address */}
            <SectionCard title="Shipping address">
              {addr ? (
                <VStack gap={1} align="stretch">
                  <Text fontSize="13px" color={T.text}>
                    {addr.address}
                  </Text>
                  <Text fontSize="13px" color={T.text}>
                    {addr.city}, {addr.province}
                  </Text>
                  {addr.postalCode && (
                    <Text fontSize="13px" color={T.sub}>
                      {addr.postalCode}
                    </Text>
                  )}
                </VStack>
              ) : (
                <Text fontSize="13px" color={T.sub}>
                  No address
                </Text>
              )}
            </SectionCard>

            {/* Payment method */}
            <SectionCard title="Payment">
              <Text fontSize="13px" color={T.text} fontWeight={600}>
                {order.paymentMethod.replace("_", " ")}
              </Text>
            </SectionCard>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

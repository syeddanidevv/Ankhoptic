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
  Separator,
} from "@chakra-ui/react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Copy,
  ChevronRight,
  MapPin,
  CreditCard,
  Package,
  User,
  Truck,
  FileText,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  T,
  StatusBadge,
  AdminLoader,
  SelectField,
  InputField,
} from "@/components/admin/ui";

type OrderItem = {
  id: string;
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
  lensType: string;
  rightEyePower: string | null;
  prescriptionUrl: string | null;
  aftercareName: string | null;
  aftercarePrice: number;
  product?: { images: string[] } | null;
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod: string;
  customer: { id: string; name: string; email: string } | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    name?: string;
    email?: string;
    phone?: string;
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

const ORDER_STATUSES = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED",
  "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED",
];
const PAY_STATUSES = [
  "UNPAID", "PAID", "PARTIALLY_PAID", "COD_PENDING",
  "CANCELLED", "REFUNDED",
];
const FULFILL_STATUSES = [
  "UNFULFILLED", "PARTIALLY_FULFILLED", "FULFILLED",
  "SHIPPED", "RESTOCKED", "CANCELLED",
];

/**
 * Centralized status dependency rules.
 * Pass what field changed + new value + previous full state → returns merged updated state.
 *
 * ORDER STATUS rules:
 *   CANCELLED   → payment = CANCELLED, fulfillment = CANCELLED
 *   REFUNDED    → payment = REFUNDED,  fulfillment = RESTOCKED
 *   COMPLETED   → payment = PAID,      fulfillment = FULFILLED
 *   DELIVERED   → fulfillment = FULFILLED (if not already)
 *   SHIPPED     → fulfillment = SHIPPED  (if not already)
 *   PROCESSING  → fulfillment = UNFULFILLED (if was CANCELLED)
 *
 * PAYMENT STATUS rules:
 *   REFUNDED    → order = REFUNDED, fulfillment = RESTOCKED
 *   CANCELLED   → order = CANCELLED, fulfillment = CANCELLED
 *   PAID        → if fulfillment = FULFILLED → order = COMPLETED
 *               → else if order = PENDING/CONFIRMED → order = PROCESSING
 *
 * FULFILLMENT STATUS rules:
 *   CANCELLED   → payment = CANCELLED (if not PAID), order = CANCELLED
 *   RESTOCKED   → order = REFUNDED (if not already)
 *   FULFILLED   → if payment = COD_PENDING → payment = PAID
 *               → order = COMPLETED
 *   SHIPPED     → if order = PENDING/CONFIRMED → order = PROCESSING
 *               → fulfillment mirrors as SHIPPED on order
 */
type Edits = {
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string;
  notes: string;
};

function applyStatusDeps(
  field: "status" | "paymentStatus" | "fulfillmentStatus",
  newValue: string,
  prev: Edits,
): Edits {
  const next: Edits = { ...prev, [field]: newValue };

  if (field === "status") {
    switch (newValue) {
      case "CANCELLED":
        next.paymentStatus = prev.paymentStatus === "PAID" ? "REFUNDED" : "CANCELLED";
        next.fulfillmentStatus = ["SHIPPED", "FULFILLED"].includes(prev.fulfillmentStatus) ? "RESTOCKED" : "CANCELLED";
        break;
      case "REFUNDED":
        next.paymentStatus = "REFUNDED";
        next.fulfillmentStatus = "RESTOCKED";
        break;
      case "COMPLETED":
        next.paymentStatus = "PAID";
        next.fulfillmentStatus = "FULFILLED";
        break;
      case "DELIVERED":
        next.fulfillmentStatus = "FULFILLED";
        break;
      case "SHIPPED":
        next.fulfillmentStatus = "SHIPPED";
        break;
      case "PROCESSING":
        if (["CANCELLED", "RESTOCKED"].includes(prev.fulfillmentStatus)) next.fulfillmentStatus = "UNFULFILLED";
        if (["CANCELLED", "REFUNDED"].includes(prev.paymentStatus)) next.paymentStatus = "UNPAID";
        break;
    }
  }

  if (field === "paymentStatus") {
    switch (newValue) {
      case "REFUNDED":
        next.status = "REFUNDED";
        next.fulfillmentStatus = "RESTOCKED";
        break;
      case "CANCELLED":
        next.status = "CANCELLED";
        next.fulfillmentStatus = "CANCELLED";
        break;
      case "PAID":
        if (prev.fulfillmentStatus === "FULFILLED") next.status = "COMPLETED";
        else if (["PENDING", "CONFIRMED"].includes(prev.status)) next.status = "PROCESSING";
        break;
    }
  }

  if (field === "fulfillmentStatus") {
    switch (newValue) {
      case "CANCELLED":
        if (prev.paymentStatus !== "PAID") next.paymentStatus = "CANCELLED";
        next.status = "CANCELLED";
        break;
      case "RESTOCKED":
        next.status = "REFUNDED";
        next.paymentStatus = "REFUNDED";
        break;
      case "FULFILLED":
        if (prev.paymentStatus === "COD_PENDING") next.paymentStatus = "PAID";
        if (next.paymentStatus === "PAID" || prev.paymentStatus === "PAID") next.status = "COMPLETED";
        else next.status = "DELIVERED";
        break;
      case "SHIPPED":
        next.status = "SHIPPED";
        break;
      case "UNFULFILLED":
      case "PARTIALLY_FULFILLED":
        if (["COMPLETED", "DELIVERED", "SHIPPED", "CANCELLED", "REFUNDED"].includes(prev.status)) 
            next.status = "PROCESSING";
        break;
    }
  }

  return next;
}

/**
 * Returns a list of human-readable hint strings describing which OTHER
 * fields will be auto-updated when `field` changes to `newValue`.
 */
function getStatusHints(
  field: "status" | "paymentStatus" | "fulfillmentStatus",
  newValue: string,
  current: Edits,
): string[] {
  if (!newValue) return [];
  const next = applyStatusDeps(field, newValue, current);
  const hints: string[] = [];
  if (field !== "status" && next.status !== current.status)
    hints.push(`Order → ${next.status.replace(/_/g, " ")}`);
  if (field !== "paymentStatus" && next.paymentStatus !== current.paymentStatus)
    hints.push(`Payment → ${next.paymentStatus.replace(/_/g, " ")}`);
  if (field !== "fulfillmentStatus" && next.fulfillmentStatus !== current.fulfillmentStatus)
    hints.push(`Fulfillment → ${next.fulfillmentStatus.replace(/_/g, " ")}`);
  return hints;
}

/* ─── small helpers ─── */
function InfoRow({ label, value, children }: { label: string; value?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="11px" fontWeight={600} color={T.sub} textTransform="uppercase" letterSpacing="0.4px" mb={1}>
        {label}
      </Text>
      <Text fontSize="13.5px" fontWeight={500} color={T.text}>
        {children ?? value ?? "—"}
      </Text>
    </Box>
  );
}

function PriceLine({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <Flex justify="space-between" align="center">
      <Text fontSize={bold ? "14px" : "13px"} fontWeight={bold ? 700 : 400} color={bold ? T.text : T.sub}>
        {label}
      </Text>
      <Text fontSize={bold ? "15px" : "13px"} fontWeight={bold ? 800 : 600} color={color ?? (bold ? T.green : T.text)}>
        {value}
      </Text>
    </Flex>
  );
}

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
      const base = {
        status: data.status,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        trackingNumber: data.trackingNumber ?? "",
        notes: data.notes ?? "",
      };
      // Reconcile cascade rules on load so dropdowns start consistent
      setEdits(applyStatusDeps("status", base.status, base));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

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
      toast.success("Order updated successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  let addr: any = null;
  if (order?.shippingAddress) {
    try {
      addr = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
    } catch(e) {}
  }

  const customerName = order?.customer?.name ?? (addr ? addr.name : "Guest");
  const customerEmail = order?.customer?.email ?? (addr ? addr.email : "—");
  const customerPhone = addr ? addr.phone : "—";

  if (loading) return <AdminLoader message="Loading order..." />;
  if (!order)
    return (
      <Box bg={T.bg} minH="100%" p={6}>
        <Text color={T.red} fontSize="13px">{error || "Order not found"}</Text>
      </Box>
    );

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>

      {/* ── Header banner card ── */}
      <Box
        bg="white"
        border={`1px solid ${T.border}`}
        borderRadius="14px"
        overflow="hidden"
        mb={5}
        boxShadow="0 1px 4px rgba(0,0,0,0.05)"
      >
        {/* Green top accent strip */}
        <Box h="3px" bgGradient="to-r" gradientFrom={T.green} gradientTo={T.greenDark} />

        <Box px={{ base: 4, md: 6 }} pt={5} pb={5}>
          {/* Breadcrumb */}
          <HStack gap={1.5} mb={4}>
            <NextLink href="/admin/orders">
              <Text fontSize="12.5px" color={T.sub} cursor="pointer" _hover={{ color: T.green }}
                transition="color 0.15s"
              >
                Orders
              </Text>
            </NextLink>
            <ChevronRight size={13} color={T.border} />
            <Text fontSize="12.5px" fontWeight={600} color={T.text}>
              #{1000 + order.orderNumber}
            </Text>
          </HStack>

          {/* Order title row */}
          <Flex align="flex-start" justify="space-between" flexWrap="wrap" gap={4}>
            <Box>
              <HStack gap={3} mb={2} align="center">
                <Text
                  fontSize={{ base: "20px", md: "28px" }}
                  fontWeight={900}
                  color={T.text}
                  letterSpacing="-0.5px"
                  lineHeight={1.2}
                >
                  Order #{1000 + order.orderNumber}
                </Text>
                <Box
                  as="button"
                  display="inline-flex"
                  alignItems="center"
                  gap="4px"
                  px={2.5} py={1}
                  bg={T.bg}
                  border={`1px solid ${T.border}`}
                  borderRadius="6px"
                  fontSize="11px"
                  fontWeight={600}
                  color={T.sub}
                  cursor="pointer"
                  _hover={{ bg: T.greenBg, color: T.greenDark, borderColor: T.green }}
                  transition="all 0.15s"
                  onClick={() => {
                    navigator.clipboard.writeText(String(1000 + order.orderNumber));
                    toast.success("Order # copied");
                  }}
                >
                  <Copy size={11} />
                  Copy
                </Box>
              </HStack>

              <Text fontSize="13px" color={T.sub}>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleString("en-PK", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </Text>

              {/* DB Order ID */}
              <HStack gap={2} mt={2}>
                <Text fontSize="11.5px" color={T.sub}>ID:</Text>
                <Text
                  fontSize="11.5px"
                  fontFamily="mono"
                  color={T.muted}
                  bg={T.bg}
                  px={2} py={0.5}
                  borderRadius="4px"
                  border={`1px solid ${T.border}`}
                  letterSpacing="0.3px"
                  maxW={{ base: "160px", sm: "260px", md: "none" }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {order.id}
                </Text>
                <Box
                  as="button"
                  display="inline-flex"
                  alignItems="center"
                  cursor="pointer"
                  color={T.sub}
                  _hover={{ color: T.green }}
                  transition="color 0.15s"
                  onClick={() => {
                    navigator.clipboard.writeText(order.id);
                    toast.success("Order ID copied");
                  }}
                >
                  <Copy size={12} />
                </Box>
              </HStack>
            </Box>

            {/* Action button — hidden on mobile (moved below) */}
            <Box display={{ base: "none", md: "inline-flex" }}>
              <Box
                as="button"
                px={5} py={2.5}
                bg={T.green}
                color="white"
                borderRadius="8px"
                fontSize="13.5px"
                fontWeight={700}
                cursor={saving ? "not-allowed" : "pointer"}
                opacity={saving ? 0.7 : 1}
                _hover={{ bg: T.greenDark }}
                transition="background 0.15s"
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save changes"}
              </Box>
            </Box>
          </Flex>

          {/* Save button — full width on mobile */}
          <Box display={{ base: "block", md: "none" }} mt={4}>
            <Box
              as="button"
              w="full"
              py={3}
              bg={T.green}
              color="white"
              borderRadius="8px"
              fontSize="13.5px"
              fontWeight={700}
              cursor={saving ? "not-allowed" : "pointer"}
              opacity={saving ? 0.7 : 1}
              _hover={{ bg: T.greenDark }}
              transition="background 0.15s"
              onClick={handleSave}
            >
              {saving ? "Saving…" : "Save changes"}
            </Box>
          </Box>

          {/* Divider */}
          <Box h="1px" bg={T.border} my={4} />

          {/* Status chips row */}
          <HStack gap={6} flexWrap="wrap">
            {[
              { label: "Order status", status: order.status },
              { label: "Payment", status: order.paymentStatus },
              { label: "Fulfillment", status: order.fulfillmentStatus },
            ].map((s) => (
              <Box key={s.label}>
                <Text fontSize="10.5px" fontWeight={700} color={T.sub} textTransform="uppercase"
                  letterSpacing="0.5px" mb={1.5}
                >
                  {s.label}
                </Text>
                <StatusBadge status={s.status}>
                  {s.status.replace(/_/g, " ")}
                </StatusBadge>
              </Box>
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Error alert */}
      {error && (
        <Box bg={T.redBg} border={`1px solid ${T.border}`} borderRadius="8px" px={4} py={3} mb={5}>
          <Text fontSize="13px" color={T.red}>{error}</Text>
        </Box>
      )}

      {/* ── Two-column layout ── */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap={5}>

        {/* ── MAIN ── */}
        <GridItem>
          <VStack gap={4} align="stretch">

            {/* Order items card */}
            <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              {/* Card header */}
              <Flex align="center" justify="space-between" px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                <HStack gap={2}>
                  <Package size={15} color={T.green} />
                  <Text fontSize="14px" fontWeight={700} color={T.text}>
                    Order items
                  </Text>
                </HStack>
                <Text fontSize="12px" color={T.sub}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </Text>
              </Flex>

              <Box px={{ base: 3, md: 5 }}>
                {order.items.map((item, i) => {
                  let parsedImages: string[] = [];
                  if (item.product?.images) {
                    try {
                      parsedImages = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images;
                    } catch(e) {}
                  }
                  const firstImg = parsedImages[0];
                  
                  return (
                  <Box
                    key={item.id}
                    py={4}
                    borderBottom={i < order.items.length - 1 ? `1px solid ${T.border}` : "none"}
                  >
                    <Flex align="flex-start" gap={{ base: 3, md: 4 }} flexWrap={{ base: "wrap", sm: "nowrap" }}>
                      {/* Thumbnail */}
                      <Box
                        w="52px" h="52px"
                        bg={T.grayBg}
                        border={`1px solid ${T.border}`}
                        borderRadius="8px"
                        flexShrink={0}
                        overflow="hidden"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="22px"
                      >
                        {firstImg ? (
                          <img
                            src={firstImg.startsWith('http') || firstImg.startsWith('/') ? firstImg : `/${firstImg}`}
                            alt={item.productTitle}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : "👁️"}
                      </Box>

                      {/* Details */}
                      <Box flex={1} minW={0}>
                        <Text fontSize="14px" fontWeight={700} color={T.text} mb={1.5}>
                          {item.productTitle}
                        </Text>
                        <HStack gap={3} flexWrap="wrap">
                          {item.lensType === "PLAIN" && (
                            <Text fontSize="12px" color={T.sub}>
                              Lens: <Box as="span" fontWeight={600} color={T.muted}>Plain</Box>
                            </Text>
                          )}
                          {item.aftercareName && (
                            <Text fontSize="12px" color={T.sub}>
                              Add-on: <Box as="span" fontWeight={600} color={T.muted}>{item.aftercareName}</Box>
                            </Text>
                          )}
                          <Text fontSize="12px" color={T.sub}>
                            Qty: <Box as="span" fontWeight={600} color={T.muted}>{item.qty}</Box>
                          </Text>
                        </HStack>

                        {/* Prescription details & files */}
                        {item.lensType === "EYESIGHT" && (item.rightEyePower || item.prescriptionUrl) && (
                          <VStack gap={2} mt={3} align="stretch">
                            {/* Rx Power row */}
                            {item.rightEyePower && (
                              <Flex
                                align="center"
                                justify="space-between"
                                px={3} py={2.5}
                                bg="#f8fafc"
                                border="1px solid #e2e8f0"
                                borderRadius="8px"
                                gap={3}
                              >
                                <Box>
                                  <Text fontSize="9.5px" fontWeight={700} color="#64748b" textTransform="uppercase" letterSpacing="0.5px">
                                    Prescription / Rx
                                  </Text>
                                  <Text fontSize="13px" fontWeight={800} color="#0f172a" letterSpacing="0.5px" fontFamily="mono" mt={0.5}>
                                    {item.rightEyePower}
                                  </Text>
                                </Box>
                                <Box
                                  as="button"
                                  flexShrink={0}
                                  px={2.5} py={1}
                                  bg="white"
                                  border="1px solid #cbd5e1"
                                  borderRadius="5px"
                                  fontSize="10px"
                                  fontWeight={600}
                                  color="#475569"
                                  cursor="pointer"
                                  _hover={{ bg: "#f1f5f9" }}
                                  transition="all 0.15s"
                                  display="flex"
                                  alignItems="center"
                                  gap="4px"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.rightEyePower ?? "");
                                    toast.success("Prescription copied!");
                                  }}
                                >
                                  <Copy size={11} />
                                  Copy
                                </Box>
                              </Flex>
                            )}

                            {/* Uploaded File row */}
                            {item.prescriptionUrl && (
                              <Flex
                                align="center"
                                justify="space-between"
                                px={3} py={2.5}
                                bg="#f8fafc"
                                border="1px solid #e2e8f0"
                                borderRadius="8px"
                                gap={3}
                                flexWrap="wrap"
                              >
                                <HStack gap={1.5}>
                                  <FileText size={13} color="#4f46e5" />
                                  <Box>
                                    <Text fontSize="9.5px" fontWeight={700} color="#64748b" textTransform="uppercase" letterSpacing="0.5px">
                                      Uploaded File
                                    </Text>
                                    <Text fontSize="12px" fontWeight={600} color="#0f172a">
                                      {item.prescriptionUrl.includes(".pdf") || item.prescriptionUrl.includes("/raw/") ? "PDF Document" : "Image File"}
                                    </Text>
                                  </Box>
                                </HStack>
                                <HStack gap={2} flexShrink={0}>
                                  <a
                                    href={item.prescriptionUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: "4px",
                                      padding: "4px 10px", background: "white",
                                      border: "1px solid #cbd5e1", borderRadius: "5px",
                                      fontSize: "10.5px", fontWeight: 600, color: "#475569",
                                      textDecoration: "none",
                                    }}
                                  >
                                    View
                                  </a>
                                  <Box
                                    as="button"
                                    px={2.5} py={1}
                                    bg="#4f46e5"
                                    border="1px solid #4338ca"
                                    borderRadius="5px"
                                    fontSize="10px"
                                    fontWeight={600}
                                    color="white"
                                    cursor="pointer"
                                    _hover={{ bg: "#4338ca" }}
                                    transition="all 0.15s"
                                    display="flex"
                                    alignItems="center"
                                    gap="4px"
                                    onClick={() => {
                                      const isPdf = item.prescriptionUrl!.includes(".pdf") || item.prescriptionUrl!.includes("/raw/");
                                      const filename = `prescription-order-${order?.orderNumber ? 1000 + order.orderNumber : "unknown"}.${isPdf ? "pdf" : "jpg"}`;
                                      const proxyUrl = `/api/admin/download-file?url=${encodeURIComponent(item.prescriptionUrl!)}&filename=${encodeURIComponent(filename)}`;
                                      const a = document.createElement("a");
                                      a.href = proxyUrl;
                                      a.download = filename;
                                      document.body.appendChild(a);
                                      a.click();
                                      a.remove();
                                    }}
                                  >
                                    <Download size={11} />
                                    Download
                                  </Box>
                                </HStack>
                              </Flex>
                            )}
                          </VStack>
                        )}

                        {/* Eyesight — no power recorded */}
                        {item.lensType === "EYESIGHT" && !item.rightEyePower && (
                          <Box mt={1.5}>
                            <Text fontSize="11px" color={T.warn} fontWeight={600}>⚠ Eyesight lens — no prescription recorded</Text>
                          </Box>
                        )}
                      </Box>

                      {/* Price */}
                      <VStack align="flex-end" gap={0.5} flexShrink={0}>
                        <Text fontSize="14px" fontWeight={700} color={T.text}>
                          Rs {item.total.toLocaleString()}
                        </Text>
                        <Text fontSize="11px" color={T.sub}>
                          Rs {item.unitPrice}/unit
                        </Text>
                      </VStack>
                    </Flex>
                  </Box>
                  );
                })}
              </Box>

              {/* Pricing summary */}
              <Box px={{ base: 3, md: 5 }} py={4} bg={T.bg} borderTop={`1px solid ${T.border}`}>
                <VStack gap={2.5} align="stretch">
                  <PriceLine label="Subtotal" value={`Rs ${order.subtotal.toLocaleString()}`} />
                  <PriceLine
                    label="Shipping"
                    value={order.shippingCost === 0 ? "Free" : `Rs ${order.shippingCost.toLocaleString()}`}
                    color={order.shippingCost === 0 ? T.green : undefined}
                  />
                  {order.discountAmount > 0 && (
                    <PriceLine
                      label="Discount"
                      value={`- Rs ${order.discountAmount.toLocaleString()}`}
                      color={T.red}
                    />
                  )}
                  <Separator />
                  <PriceLine label="Total" value={`Rs ${order.total.toLocaleString()}`} bold />
                </VStack>
              </Box>
            </Box>

            {/* Shipping + Payment side by side */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              {/* Shipping address */}
              <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
                <Flex align="center" gap={2} px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                  <MapPin size={14} color={T.green} />
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    Shipping address
                  </Text>
                </Flex>
                <Box px={{ base: 3, md: 5 }} py={4}>
                  {addr ? (
                    <VStack gap={3} align="stretch">
                      <InfoRow label="Name" value={addr.name} />
                      <InfoRow label="Address" value={addr.address} />
                      <InfoRow label="City / Province" value={`${addr.city}, ${addr.province}`} />
                      {addr.postalCode && <InfoRow label="Postal Code" value={addr.postalCode} />}
                      {addr.phone && <InfoRow label="Phone" value={addr.phone} />}
                    </VStack>
                  ) : (
                    <Text fontSize="13px" color={T.sub}>No address provided</Text>
                  )}
                </Box>
              </Box>

              {/* Payment info */}
              <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
                <Flex align="center" gap={2} px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                  <CreditCard size={14} color={T.green} />
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    Payment info
                  </Text>
                </Flex>
                <Box px={{ base: 3, md: 5 }} py={4}>
                  <VStack gap={3} align="stretch">
                    <InfoRow
                      label="Method"
                      value={
                        <Box
                          as="span"
                          px={2.5} py={1}
                          bg={T.blueBg}
                          borderRadius="5px"
                          fontSize="12.5px"
                          fontWeight={600}
                          color={T.blueText}
                          display="inline-block"
                        >
                          {order.paymentMethod.replace(/_/g, " ")}
                        </Box>
                      }
                    />
                    <InfoRow label="Status">
                      <StatusBadge status={order.paymentStatus}>
                        {order.paymentStatus.replace(/_/g, " ")}
                      </StatusBadge>
                    </InfoRow>
                    <InfoRow label="Amount" value={`Rs ${order.total.toLocaleString()}`} />
                  </VStack>
                </Box>
              </Box>
            </Grid>

            {/* Internal notes */}
            <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              <Box px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                <Text fontSize="13.5px" fontWeight={700} color={T.text}>Internal notes</Text>
                <Text fontSize="12px" color={T.sub} mt={0.5}>Visible only to your team</Text>
              </Box>
              <Box px={5} py={4}>
                <Textarea
                  size="md"
                  borderRadius="8px"
                  borderColor={T.border}
                  rows={4}
                  fontSize="13px"
                  px="12px"
                  py="10px"
                  bg="white"
                  placeholder="Add internal notes for your team…"
                  value={edits.notes}
                  onChange={(e) => setEdits((p) => ({ ...p, notes: e.target.value }))}
                  _focus={{ borderColor: T.green, boxShadow: "0 0 0 2px rgba(16,185,129,0.12)" }}
                  _placeholder={{ color: T.placeholder }}
                />
              </Box>
            </Box>
          </VStack>
        </GridItem>

        {/* ── SIDEBAR ── */}
        <GridItem>
          <VStack gap={4} align="stretch">

            {/* Manage order */}
            <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              <Box px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                <Text fontSize="13.5px" fontWeight={700} color={T.text}>Manage order</Text>
                <Text fontSize="12px" color={T.sub} mt={0.5}>Update status &amp; fulfillment</Text>
              </Box>
              <Box px={5} py={4}>
                <VStack gap={4} align="stretch">

                  {/* Order status */}
                  <Box>
                    <Text fontSize="11.5px" fontWeight={600} color={T.sub} textTransform="uppercase" letterSpacing="0.4px" mb={1.5}>
                      Order status
                    </Text>
                    <SelectField
                      options={ORDER_STATUSES}
                      value={edits.status}
                      onChange={(e) =>
                        setEdits((p) => applyStatusDeps("status", e.target.value, p))
                      }
                      placeholder="Select order status"
                    />
                    {getStatusHints("status", edits.status, edits).length > 0 && (
                      <HStack gap={1.5} mt={2} flexWrap="wrap">
                        {getStatusHints("status", edits.status, edits).map((h) => (
                          <Box
                            key={h}
                            as="button"
                            px={2} py={0.5}
                            bg={T.greenBg}
                            border={`1px solid ${T.green}40`}
                            borderRadius="5px"
                            fontSize="10.5px"
                            fontWeight={600}
                            color={T.greenDark}
                            cursor="pointer"
                            _hover={{ bg: T.green, color: "white", borderColor: T.green }}
                            transition="all 0.15s"
                            onClick={() => setEdits((p) => applyStatusDeps("status", p.status, p))}
                          >
                            ↪ {h}
                          </Box>
                        ))}
                      </HStack>
                    )}
                  </Box>

                  {/* Payment status */}
                  <Box>
                    <Text fontSize="11.5px" fontWeight={600} color={T.sub} textTransform="uppercase" letterSpacing="0.4px" mb={1.5}>
                      Payment status
                    </Text>
                    <SelectField
                      options={PAY_STATUSES}
                      value={edits.paymentStatus}
                      onChange={(e) =>
                        setEdits((p) => applyStatusDeps("paymentStatus", e.target.value, p))
                      }
                      placeholder="Select payment status"
                    />
                    {getStatusHints("paymentStatus", edits.paymentStatus, edits).length > 0 && (
                      <HStack gap={1.5} mt={2} flexWrap="wrap">
                        {getStatusHints("paymentStatus", edits.paymentStatus, edits).map((h) => (
                          <Box
                            key={h}
                            as="button"
                            px={2} py={0.5}
                            bg={T.greenBg}
                            border={`1px solid ${T.green}40`}
                            borderRadius="5px"
                            fontSize="10.5px"
                            fontWeight={600}
                            color={T.greenDark}
                            cursor="pointer"
                            _hover={{ bg: T.green, color: "white", borderColor: T.green }}
                            transition="all 0.15s"
                            onClick={() => setEdits((p) => applyStatusDeps("paymentStatus", p.paymentStatus, p))}
                          >
                            ↪ {h}
                          </Box>
                        ))}
                      </HStack>
                    )}
                  </Box>

                  {/* Fulfillment status */}
                  <Box>
                    <Text fontSize="11.5px" fontWeight={600} color={T.sub} textTransform="uppercase" letterSpacing="0.4px" mb={1.5}>
                      Fulfillment status
                    </Text>
                    <SelectField
                      options={FULFILL_STATUSES}
                      value={edits.fulfillmentStatus}
                      onChange={(e) =>
                        setEdits((p) => applyStatusDeps("fulfillmentStatus", e.target.value, p))
                      }
                      placeholder="Select fulfillment status"
                    />
                    {getStatusHints("fulfillmentStatus", edits.fulfillmentStatus, edits).length > 0 && (
                      <HStack gap={1.5} mt={2} flexWrap="wrap">
                        {getStatusHints("fulfillmentStatus", edits.fulfillmentStatus, edits).map((h) => (
                          <Box
                            key={h}
                            as="button"
                            px={2} py={0.5}
                            bg={T.greenBg}
                            border={`1px solid ${T.green}40`}
                            borderRadius="5px"
                            fontSize="10.5px"
                            fontWeight={600}
                            color={T.greenDark}
                            cursor="pointer"
                            _hover={{ bg: T.green, color: "white", borderColor: T.green }}
                            transition="all 0.15s"
                            onClick={() => setEdits((p) => applyStatusDeps("fulfillmentStatus", p.fulfillmentStatus, p))}
                          >
                            ↪ {h}
                          </Box>
                        ))}
                      </HStack>
                    )}
                  </Box>

                </VStack>
              </Box>
            </Box>

            {/* Tracking */}
            <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              <Flex align="center" gap={2} px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                <Truck size={14} color={T.green} />
                <Text fontSize="13.5px" fontWeight={700} color={T.text}>Tracking</Text>
              </Flex>
              <Box px={5} py={4}>
                <InputField
                  iconName="package"
                  placeholder="e.g. TRK123456789"
                  value={edits.trackingNumber}
                  onChange={(e) =>
                    setEdits((p) => ({ ...p, trackingNumber: e.target.value }))
                  }
                />
              </Box>
            </Box>

            {/* Customer */}
            <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              <Flex align="center" gap={2} px={5} py={4} borderBottom={`1px solid ${T.border}`}>
                <User size={14} color={T.green} />
                <Text fontSize="13.5px" fontWeight={700} color={T.text}>Customer</Text>
              </Flex>
              <Box px={5} py={4}>
                <VStack gap={3} align="stretch">
                  {/* Avatar + name row */}
                  <Flex align="center" gap={3}>
                    <Box
                      w="38px" h="38px"
                      bg={T.greenBg}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="15px"
                      fontWeight={700}
                      color={T.greenDark}
                      flexShrink={0}
                    >
                      {customerName.charAt(0).toUpperCase()}
                    </Box>
                    <Box>
                      <Text fontSize="14px" fontWeight={700} color={T.text}>
                        {customerName}
                      </Text>
                      <Text fontSize="11.5px" color={T.sub}>
                        {customerEmail}
                      </Text>
                    </Box>
                  </Flex>

                  {customerPhone !== "—" && (
                    <InfoRow label="Phone" value={customerPhone} />
                  )}

                  {order.customer?.id && (
                    <NextLink href="/admin/customers">
                      <HStack
                        gap={1}
                        fontSize="12.5px"
                        color={T.green}
                        cursor="pointer"
                        _hover={{ gap: 1.5 }}
                        transition="all 0.15s"
                        pt={1}
                      >
                        <Text fontWeight={600}>View full profile</Text>
                        <ChevronRight size={13} />
                      </HStack>
                    </NextLink>
                  )}
                </VStack>
              </Box>
            </Box>

          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}

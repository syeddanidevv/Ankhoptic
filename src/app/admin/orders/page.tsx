"use client";
import { useState, useEffect } from "react";
import { Box, Text, Grid, Checkbox, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowUpRight, Package, CreditCard, Clock } from "lucide-react";
import {
  T,
  PageHeader,
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
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  customer: { name: string; email: string } | null;
  shippingAddress?: { name?: string; email?: string };
  total: number;
  items: OrderItem[];
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrdersPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchOrders() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tab === "Unfulfilled") params.set("fulfillment", "UNFULFILLED");
      if (tab === "Unpaid") params.set("payment", "UNPAID");
      try {
        const r = await fetch(`/api/orders?${params}`);
        const d = await r.json();
        if (!cancelled) {
          setOrders(d.orders ?? []);
          setTotal(d.total ?? 0);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOrders();
    return () => { cancelled = true; };
  }, [tab, search]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const customerName = (o: Order) =>
    o.customer?.name ?? o.shippingAddress?.name ?? "Guest";
  const customerEmail = (o: Order) =>
    o.customer?.email ?? o.shippingAddress?.email ?? "";

  const unfulfilled = orders.filter((o) => o.fulfillmentStatus === "UNFULFILLED").length;
  const codPending = orders.filter((o) => o.paymentStatus === "COD_PENDING").length;
  const unpaid = orders.filter((o) => o.paymentStatus === "UNPAID").length;

  if (loading) return <AdminLoader message="Loading orders..." />;

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader title="Orders" subtitle={`${total} orders total`}>
        <AdminButton variant="secondary">Export</AdminButton>
      </PageHeader>

      {/* KPI Cards */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={6}
      >
        {[
          {
            label: "Total Orders",
            value: total,
            icon: <Package size={16} />,
            color: T.green,
            bg: T.greenBg,
          },
          {
            label: "Unfulfilled",
            value: unfulfilled,
            icon: <Clock size={16} />,
            color: T.warn,
            bg: T.warnBg,
          },
          {
            label: "COD Pending",
            value: codPending,
            icon: <CreditCard size={16} />,
            color: T.purple,
            bg: T.purpleBg,
          },
          {
            label: "Unpaid",
            value: unpaid,
            icon: <CreditCard size={16} />,
            color: T.red,
            bg: T.redBg,
          },
        ].map((stat) => (
          <Box
            key={stat.label}
            flex={1}
            bg="white"
            border={`1px solid ${T.border}`}
            borderRadius="12px"
            px={4}
            py={4}
            boxShadow="0 1px 3px rgba(0,0,0,0.04)"
          >
            <Flex align="center" justify="space-between" mb={3}>
              <Text fontSize="12px" fontWeight={600} color={T.sub} textTransform="uppercase" letterSpacing="0.5px">
                {stat.label}
              </Text>
              <Box
                w="30px"
                h="30px"
                bg={stat.bg}
                borderRadius="8px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={stat.color}
              >
                {stat.icon}
              </Box>
            </Flex>
            <Text fontSize="26px" fontWeight={800} color={T.text} lineHeight={1}>
              {stat.value}
            </Text>
          </Box>
        ))}
      </Grid>

      <TableShell
        footerText={`Showing ${orders.length} of ${total} orders`}
        header={
          <>
            <TabBar
              tabs={["All", "Unfulfilled", "Unpaid", "Open", "Archived"]}
              active={tab}
              onChange={setTab}
            />
            <FilterBar
              search={search}
              onSearch={setSearch}
              placeholder="Search by customer or order #..."
              filters={["Status", "Payment", "Channel"]}
            />
            <BulkBar
              count={selected.length}
              actions={[
                { label: "Mark fulfilled" },
                { label: "Print slip" },
                { label: "Cancel", danger: true },
              ]}
            />
          </>
        }
      >
        <THead
          checkboxCol
          columns={[
            "Order",
            "Customer",
            "Products",
            "Date",
            "Total",
            "Payment",
            "Fulfillment",
            "",
          ]}
        />
        <tbody>
          {orders.length === 0 ? (
            <EmptyRow cols={9} message="No orders match your search." />
          ) : (
            orders.map((o, i) => (
              <TR key={o.id} index={i}>
                <TD>
                  <Checkbox.Root
                    checked={selected.includes(o.id)}
                    onCheckedChange={() => toggle(o.id)}
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </TD>

                {/* Order # */}
                <TD>
                  <NextLink href={`/admin/orders/${o.id}`}>
                    <Box display="inline-block" cursor="pointer" _hover={{ "& .order-id": { color: T.greenDark } }}>
                      <Text
                        className="order-id"
                        fontSize="13.5px"
                        fontWeight={700}
                        color={T.green}
                        transition="all 0.15s"
                      >
                        #{1000 + o.orderNumber}
                      </Text>
                    </Box>
                  </NextLink>
                  <div style={{ marginTop: '6px' }}>
                    <StatusBadge status={o.status}
                    variant={
                      o.status === "CANCELLED" ? "red"
                        : o.status === "COMPLETED" ? "green"
                        : o.status === "PROCESSING" || o.status === "SHIPPED" ? "blue"
                        : "gray"
                    }
                  >
                    {o.status}
                  </StatusBadge>
                  </div>
                </TD>

                {/* Customer */}
                <TD>
                  <Text fontSize="13.5px" fontWeight={600} color={T.text}>
                    {customerName(o)}
                  </Text>
                  <Text fontSize="11.5px" color={T.sub}>
                    {customerEmail(o)}
                  </Text>
                </TD>

                {/* Products */}
                <TD>
                  <Text
                    fontSize="12.5px"
                    color={T.muted}
                    maxW="180px"
                    whiteSpace="normal"
                    lineHeight={1.4}
                  >
                    {o.items.map((item) => item.productTitle).join(", ")}
                  </Text>
                  {o.items.some((it) => it.lensType === "EYESIGHT" && it.rightEyePower) && (
                    <Box
                      as="span"
                      display="inline-block"
                      mt={1}
                      px={1.5}
                      py={0.5}
                      bg={T.purpleBg}
                      border={`1px solid ${T.purpleText}30`}
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      color={T.purpleText}
                      letterSpacing="0.3px"
                    >
                      Rx
                    </Box>
                  )}
                </TD>

                {/* Date */}
                <TD>
                  <Text fontSize="12.5px" color={T.sub}>
                    {fmtDate(o.createdAt)}
                  </Text>
                </TD>

                {/* Total */}
                <TD>
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    Rs {o.total.toLocaleString()}
                  </Text>
                </TD>

                {/* Payment */}
                <TD>
                  <StatusBadge status={o.paymentStatus}>
                    {o.paymentStatus === "COD_PENDING"
                      ? "COD"
                      : o.paymentStatus === "PARTIALLY_PAID"
                      ? "Partial"
                      : o.paymentStatus.charAt(0) + o.paymentStatus.slice(1).toLowerCase()}
                  </StatusBadge>
                </TD>

                {/* Fulfillment */}
                <TD>
                  <StatusBadge status={o.fulfillmentStatus}>
                    {o.fulfillmentStatus === "PARTIALLY_FULFILLED"
                      ? "Partial"
                      : o.fulfillmentStatus.charAt(0) + o.fulfillmentStatus.slice(1).toLowerCase()}
                  </StatusBadge>
                </TD>

                {/* Action */}
                <TD>
                  <NextLink href={`/admin/orders/${o.id}`}>
                    <Box
                      display="inline-flex"
                      alignItems="center"
                      gap="4px"
                      px={3}
                      py={1.5}
                      bg={T.bg}
                      border={`1px solid ${T.border}`}
                      borderRadius="6px"
                      fontSize="12px"
                      fontWeight={600}
                      color={T.muted}
                      cursor="pointer"
                      _hover={{ bg: T.green, color: "white", borderColor: T.green }}
                      transition="all 0.15s"
                    >
                      View
                      <ArrowUpRight size={12} />
                    </Box>
                  </NextLink>
                </TD>
              </TR>
            ))
          )}
        </tbody>
      </TableShell>
    </Box>
  );
}

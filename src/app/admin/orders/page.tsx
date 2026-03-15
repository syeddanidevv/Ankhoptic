"use client";
import { useState, useEffect } from "react";
import { Box, Text, HStack, Checkbox } from "@chakra-ui/react";
import NextLink from "next/link";
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
  TodayStrip,
  StatusBadge,
  AdminButton,
  AdminLoader,
} from "@/components/admin/ui";

type Order = {
  id: string;
  orderNumber: number;
  customer: { name: string; email: string } | null;
  guestName: string | null;
  guestEmail: string | null;
  total: number;
  items: { id: string }[];
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};

const PAY_LABEL: Record<string, string> = {
  PAID: "Paid",
  COD_PENDING: "COD",
  UNPAID: "Unpaid",
  REFUNDED: "Refunded",
};
const FUL_LABEL: Record<string, string> = {
  FULFILLED: "Fulfilled",
  UNFULFILLED: "Unfulfilled",
  RESTOCKED: "Restocked",
  PARTIALLY_FULFILLED: "Partial",
};

const PAY_STATUS: Record<string, string> = {
  PAID: "green",
  COD_PENDING: "yellow",
  UNPAID: "red",
  REFUNDED: "orange",
};
const FUL_STATUS: Record<string, string> = {
  FULFILLED: "green",
  UNFULFILLED: "orange",
  RESTOCKED: "gray",
  PARTIALLY_FULFILLED: "blue",
};

export default function OrdersPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tab === "Unfulfilled") params.set("fulfillment", "UNFULFILLED");
    if (tab === "Unpaid") params.set("payment", "UNPAID");
    fetch(`/api/orders?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setOrders(d.orders ?? []);
          setTotal(d.total ?? 0);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, search]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const customerName = (o: Order) => o.customer?.name ?? o.guestName ?? "Guest";
  const customerEmail = (o: Order) => o.customer?.email ?? o.guestEmail ?? "";
  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <AdminLoader message="Loading orders..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Orders" subtitle={`${total} orders total`}>
        <NextLink href="/admin/orders/drafts">
          <AdminButton variant="secondary">Drafts</AdminButton>
        </NextLink>
        <NextLink href="/admin/orders/abandoned">
          <AdminButton variant="secondary">Abandoned</AdminButton>
        </NextLink>
        <AdminButton variant="primary">Export</AdminButton>
      </PageHeader>

      {/* Stats row */}
      <HStack gap={4} mb={5}>
        <StatCard label="Total Orders" value={total} color={T.green} />
        <StatCard
          label="Unfulfilled"
          value={
            orders.filter((o) => o.fulfillmentStatus === "UNFULFILLED").length
          }
          color={T.warn}
        />
        <StatCard
          label="COD pending"
          value={orders.filter((o) => o.paymentStatus === "COD_PENDING").length}
          color={T.purple}
        />
        <StatCard
          label="Unpaid"
          value={orders.filter((o) => o.paymentStatus === "UNPAID").length}
          color={T.red}
        />
      </HStack>

      <TodayStrip
        items={[
          { label: "Orders loaded", value: String(orders.length) },
          {
            label: "Unfulfilled",
            value: String(
              orders.filter((o) => o.fulfillmentStatus === "UNFULFILLED")
                .length,
            ),
          },
          {
            label: "COD",
            value: String(
              orders.filter((o) => o.paymentStatus === "COD_PENDING").length,
            ),
          },
          {
            label: "Paid",
            value: String(
              orders.filter((o) => o.paymentStatus === "PAID").length,
            ),
          },
        ]}
      />

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
            "Date",
            "Items",
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
                <TD>
                  <NextLink href={`/admin/orders/${o.id}`}>
                    <Text
                      fontSize="13.5px"
                      fontWeight={700}
                      color={T.green}
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      #{o.orderNumber}
                    </Text>
                  </NextLink>
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={500} color={T.text}>
                    {customerName(o)}
                  </Text>
                  <Text fontSize="11.5px" color={T.sub}>
                    {customerEmail(o)}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="12.5px" color={T.sub}>
                    {fmtDate(o.createdAt)}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="13px" color={T.muted}>
                    {o.items.length}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={600} color={T.text}>
                    Rs {o.total.toLocaleString()}
                  </Text>
                </TD>
                <TD>
                  <StatusBadge status={PAY_STATUS[o.paymentStatus]}>
                    {PAY_LABEL[o.paymentStatus] ?? o.paymentStatus}
                  </StatusBadge>
                </TD>
                <TD>
                  <StatusBadge status={FUL_STATUS[o.fulfillmentStatus]}>
                    {FUL_LABEL[o.fulfillmentStatus] ?? o.fulfillmentStatus}
                  </StatusBadge>
                </TD>
                <TD>
                  <NextLink href={`/admin/orders/${o.id}`}>
                    <AdminButton variant="secondary" size="xs">
                      View
                    </AdminButton>
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

"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  T,
  PageHeader,
  StatCard,
  TodayStrip,
  TableShell,
  THead,
  TR,
  TD,
  StatusBadge,
  AdminButton,
  EmptyRow,
  AdminLoader,
} from "@/components/admin/ui";

interface DashboardData {
  revenue: number;
  todayRevenue: number;
  orders: number;
  todayOrders: number;
  customers: number;
  avgOrderValue: number;
  unfulfilled: number;
  codPending: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    total: string;
    items: number;
    status: string;
    pay: string;
    date: string;
  }>;
  revenueChart: number[];
  ordersChart: number[];
  customersChart: number[];
  avgValueChart: number[];
}

const PAY_STATUS: Record<string, string> = {
  Paid: "green",
  COD: "yellow",
  Unpaid: "red",
  Refunded: "orange",
};
const FUL_STATUS: Record<string, string> = {
  Fulfilled: "green",
  Unfulfilled: "orange",
  Restocked: "gray",
};

const QUICK_LINKS = [
  {
    label: "Products",
    href: "/admin/products",
    desc: "View & manage products",
  },
  { label: "Orders", href: "/admin/orders", desc: "Manage incoming orders" },
  {
    label: "Customers",
    href: "/admin/customers",
    desc: "Browse customer list",
  },
  { label: "Discounts", href: "/admin/discounts", desc: "Promo codes" },
  { label: "Inventory", href: "/admin/inventory", desc: "Stock levels" },
  { label: "Analytics", href: "/admin/analytics", desc: "Store performance" },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled && !d.error) setData(d);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <AdminLoader message="Loading dashboard..." />;
  }

  const STATS = [
    {
      label: "Total Revenue",
      value: `Rs ${data.revenue.toLocaleString()}`,
      sub: "All time",
      up: true,
      color: T.green,
      sparkline: data.revenueChart.some(v => v > 0) ? data.revenueChart : [0],
    },
    {
      label: "Orders",
      value: data.orders.toString(),
      sub: "Total",
      up: true,
      color: T.blue,
      sparkline: data.ordersChart.some(v => v > 0) ? data.ordersChart : [0],
    },
    {
      label: "Customers",
      value: data.customers.toString(),
      sub: "All time total",
      up: true,
      color: T.purple,
      sparkline: data.customersChart.some(v => v > 0) ? data.customersChart : [0],
    },
    {
      label: "Avg Order Value",
      value: `Rs ${data.avgOrderValue.toLocaleString()}`,
      sub: "per order",
      up: false,
      color: T.warn,
      sparkline: data.avgValueChart.some(v => v > 0) ? data.avgValueChart : [0],
    },
  ];

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader
        title="Ankhoptics Admin"
        subtitle="Welcome back — here is your store at a glance"
      >
        <NextLink href="/admin/products/new">
          <AdminButton variant="primary" px={5}>
            Add product
          </AdminButton>
        </NextLink>
      </PageHeader>

      {/* Today strip */}
      <TodayStrip
        items={[
          { label: "Orders today", value: data.todayOrders.toString() },
          {
            label: "Revenue today",
            value: `Rs ${data.todayRevenue.toLocaleString()}`,
          },
          { label: "Unfulfilled", value: data.unfulfilled.toString() },
          { label: "COD pending", value: data.codPending.toString() },
        ]}
      />

      {/* Stat cards — responsive wrapping */}
      <Grid
        templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={5}
      >
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            sub={s.sub}
            up={s.up}
            color={s.color}
            sparkline={s.sparkline}
          />
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 300px" }} gap={4}>
        {/* Recent orders table */}
        <GridItem>
          <TableShell
            footerText="Last 5 orders"
            showPagination={false}
            header={
              <Flex
                justify="space-between"
                align="center"
                px={4}
                py={3.5}
                borderBottom={`1px solid ${T.divider}`}
              >
                <Text fontSize="14px" fontWeight={600} color={T.text}>
                  Recent Orders
                </Text>
                <NextLink href="/admin/orders">
                  <AdminButton variant="ghost" size="xs">
                    View all
                  </AdminButton>
                </NextLink>
              </Flex>
            }
          >
            <THead
              columns={[
                "Order",
                "Customer",
                "Date",
                "Items",
                "Total",
                "Payment",
                "Status",
              ]}
            />
            <tbody>
              {data.recentOrders.length === 0 ? (
                <EmptyRow cols={7} message="No orders yet." />
              ) : (
                data.recentOrders.map((o, i) => (
                  <TR key={o.id} index={i}>
                    <TD>
                      <Text fontSize="13px" fontWeight={700} color={T.green}>
                        {o.id}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="13.5px" fontWeight={500} color={T.text}>
                        {o.customer}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="12px" color={T.sub}>
                        {o.date}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="13px" color={T.muted}>
                        {o.items}
                      </Text>
                    </TD>
                    <TD>
                      <Text fontSize="13.5px" fontWeight={600} color={T.text}>
                        {o.total}
                      </Text>
                    </TD>
                    <TD>
                      <StatusBadge status={PAY_STATUS[o.pay]}>
                        {o.pay}
                      </StatusBadge>
                    </TD>
                    <TD>
                      <StatusBadge status={FUL_STATUS[o.status]}>
                        {o.status}
                      </StatusBadge>
                    </TD>
                  </TR>
                ))
              )}
            </tbody>
          </TableShell>
        </GridItem>

        {/* Quick links */}
        <GridItem>
          <Box
            bg="white"
            border={`1px solid ${T.border}`}
            borderRadius="12px"
            overflow="hidden"
            shadow="sm"
          >
            <Flex
              align="center"
              px={5}
              py={3.5}
              borderBottom={`1px solid #f8fafc`}
            >
              <Text fontSize="14px" fontWeight={600} color={T.text}>
                Quick Links
              </Text>
            </Flex>
            <VStack gap={0} align="stretch" p={2}>
              {QUICK_LINKS.map((q) => (
                <NextLink
                  key={q.label}
                  href={q.href}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    px={3}
                    py={3}
                    borderRadius="8px"
                    cursor="pointer"
                    _hover={{ bg: T.bg }}
                    transition="background 0.1s"
                  >
                    <Text fontSize="13.5px" fontWeight={600} color={T.text}>
                      {q.label}
                    </Text>
                    <Text fontSize="12px" color={T.sub} mt={0.5}>
                      {q.desc}
                    </Text>
                  </Box>
                </NextLink>
              ))}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

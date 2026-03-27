"use client";
import { useState, useEffect } from "react";
import { Box, Text, Grid, HStack, VStack, Checkbox, Avatar } from "@chakra-ui/react";
import {
  T,
  PageHeader,
  StatCard,
  FilterBar,
  BulkBar,
  TableShell,
  THead,
  TR,
  TD,
  EmptyRow,
  AdminButton,
  AdminLoader,
} from "@/components/admin/ui";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
};

const AV_COLORS = [T.green, T.blue, T.purple, T.warn, "#ec4899"];
const INITIALS = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MONTH_AGO = new Date(Date.now() - THIRTY_DAYS_MS);

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/customers?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setCustomers(d.customers ?? []);
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
  }, [search]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <AdminLoader message="Loading customers..." />;

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader title="Customers" subtitle={`${total} total customers`}>
        <AdminButton variant="secondary">Export</AdminButton>
        <AdminButton variant="primary">Add customer</AdminButton>
      </PageHeader>

      {/* Stat cards */}
      <Grid templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }} gap={4} mb={5}>
        <StatCard label="Total Customers" value={total} />
        <StatCard
          label="Total Revenue"
          value={`Rs ${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`}
          color={T.green}
        />
        <StatCard
          label="Repeat Buyers"
          value={customers.filter((c) => c.ordersCount > 1).length}
          color={T.purple}
        />
        <StatCard
          label="New this month"
          value={
            customers.filter((c) => new Date(c.createdAt) > MONTH_AGO).length
          }
          color={T.blue}
        />
      </Grid>

      <TableShell
        footerText={`Showing ${customers.length} of ${total} customers`}
        header={
          <>
            <FilterBar
              search={search}
              onSearch={setSearch}
              placeholder="Search by name or email..."
              filters={["Location", "Orders"]}
            />
            <BulkBar
              count={selected.length}
              actions={[
                { label: "Send email" },
                { label: "Delete", danger: true },
              ]}
            />
          </>
        }
      >
        <THead
          checkboxCol
          columns={["Customer", "Phone", "Orders", "Total Spent", "Joined", ""]}
        />
        <tbody>
          {customers.length === 0 ? (
            <EmptyRow cols={7} message="No customers found." />
          ) : (
            customers.map((c, i) => (
              <TR key={c.id} index={i}>
                <TD>
                  <Checkbox.Root
                    checked={selected.includes(c.id)}
                    onCheckedChange={() => toggle(c.id)}
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </TD>
                <TD>
                  <HStack gap={3}>
                    <Avatar.Root
                      size="sm"
                      style={{ background: AV_COLORS[i % AV_COLORS.length] }}
                    >
                      <Avatar.Fallback
                        color="white"
                        fontSize="11px"
                        fontWeight={700}
                      >
                        {INITIALS(c.name)}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <VStack gap={0} align="flex-start">
                      <Text fontSize="13.5px" fontWeight={600} color={T.text}>
                        {c.name}
                      </Text>
                      <Text fontSize="11.5px" color={T.sub}>
                        {c.email}
                      </Text>
                    </VStack>
                  </HStack>
                </TD>
                <TD>
                  <Text fontSize="13px" color={T.muted}>
                    {c.phone ?? "—"}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={700} color={T.text}>
                    {c.ordersCount}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={600} color={T.green}>
                    Rs {c.totalSpent.toLocaleString()}
                  </Text>
                </TD>
                <TD>
                  <Text fontSize="12.5px" color={T.sub}>
                    {fmtDate(c.createdAt)}
                  </Text>
                </TD>
                <TD>
                  <AdminButton variant="secondary" size="xs">
                    View
                  </AdminButton>
                </TD>
              </TR>
            ))
          )}
        </tbody>
      </TableShell>
    </Box>
  );
}

"use client";
import { Box, Text } from "@chakra-ui/react";
import {
  T, PageHeader, StatCard, TableShell, THead, TR, TD,
  StatusBadge, AdminButton,
} from "@/components/admin/ui";
import { HStack } from "@chakra-ui/react";

const DRAFTS = [
  { id: "#D-012", customer: "Unnamed customer", items: 2, total: "Rs 3,960", created: "Mar 5, 2026", status: "Open"    },
  { id: "#D-011", customer: "Bilal Ahmed",       items: 1, total: "Rs 1,980", created: "Mar 4, 2026", status: "Open"    },
  { id: "#D-010", customer: "Unnamed customer",  items: 3, total: "Rs 7,500", created: "Mar 3, 2026", status: "Invoice" },
  { id: "#D-009", customer: "Sara Khan",          items: 2, total: "Rs 4,000", created: "Mar 2, 2026", status: "Open"    },
];

export default function DraftsPage() {
  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Draft Orders" subtitle="Orders saved but not yet placed">
        <AdminButton variant="primary">Create draft order</AdminButton>
      </PageHeader>

      <HStack gap={4} mb={5}>
        <StatCard label="Total Drafts" value={DRAFTS.length}                                       />
        <StatCard label="Open"         value={DRAFTS.filter(d => d.status === "Open").length}    color={T.blue} />
        <StatCard label="Invoiced"     value={DRAFTS.filter(d => d.status === "Invoice").length} color={T.purple} />
        <StatCard label="Draft Value"  value="Rs 17,440"                                         color={T.green} />
      </HStack>

      <TableShell footerText={`${DRAFTS.length} draft orders`} showPagination={false}>
        <THead columns={["Draft","Customer","Items","Total","Created","Status",""]} />
        <tbody>
          {DRAFTS.map((d, i) => (
            <TR key={d.id} index={i}>
              <TD><Text fontSize="13.5px" fontWeight={700} color={T.green}>{d.id}</Text></TD>
              <TD><Text fontSize="13.5px" color={T.text}>{d.customer}</Text></TD>
              <TD><Text fontSize="13px" color={T.muted}>{d.items}</Text></TD>
              <TD><Text fontSize="13.5px" fontWeight={600} color={T.text}>{d.total}</Text></TD>
              <TD><Text fontSize="12.5px" color={T.sub}>{d.created}</Text></TD>
              <TD>
                <StatusBadge status={d.status}>{d.status}</StatusBadge>
              </TD>
              <TD>
                <HStack gap={1.5}>
                  <AdminButton variant="secondary" size="xs">Edit</AdminButton>
                  <AdminButton variant="primary" size="xs">Convert</AdminButton>
                </HStack>
              </TD>
            </TR>
          ))}
        </tbody>
      </TableShell>
    </Box>
  );
}


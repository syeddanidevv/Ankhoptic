"use client";
import { Box, Text } from "@chakra-ui/react";
import {
  T, PageHeader, StatCard, TableShell, THead, TR, TD,
  StatusBadge, AdminButton,
} from "@/components/admin/ui";
import { HStack } from "@chakra-ui/react";

const ABANDONED = [
  { id: "#A-089", customer: "Ali Hassan",   email: "ali@email.com",   items: 2, value: "Rs 3,960", date: "Mar 5, 3:42 PM",  recovered: false },
  { id: "#A-088", customer: "Nadia Malik",  email: "nadia@email.com", items: 1, value: "Rs 1,980", date: "Mar 4, 11:20 AM", recovered: true  },
  { id: "#A-087", customer: "Unnamed",      email: "—",               items: 3, value: "Rs 5,940", date: "Mar 3, 7:05 PM",  recovered: false },
  { id: "#A-086", customer: "Hamza Sheikh", email: "hamza@email.com", items: 2, value: "Rs 3,960", date: "Mar 2, 2:18 PM",  recovered: false },
  { id: "#A-085", customer: "Sana Qureshi", email: "sana@email.com",  items: 1, value: "Rs 2,500", date: "Mar 1, 9:55 AM",  recovered: true  },
];

export default function AbandonedCheckoutsPage() {
  const recovered    = ABANDONED.filter(a => a.recovered).length;
  const recoveryRate = Math.round((recovered / ABANDONED.length) * 100);

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Abandoned Checkouts" subtitle="Customers who didn't complete their purchase">
        <AdminButton variant="secondary">Export</AdminButton>
      </PageHeader>

      <HStack gap={4} mb={5}>
        <StatCard label="Abandoned"     value={ABANDONED.length} />
        <StatCard label="Recovered"     value={recovered}        color={T.green}  />
        <StatCard label="Recovery Rate" value={`${recoveryRate}%`} color={T.blue} />
        <StatCard label="Lost Revenue"  value="Rs 18,340"        color={T.red}    />
      </HStack>

      {/* Info tip */}
      <Box bg={T.greenBg} border="1px solid #bbf7d0" borderRadius="10px" px={4} py={3} mb={4}>
        <Text fontSize="13px" color="#166534" fontWeight={500}>
          Tip: Send a recovery email to customers who abandoned their cart to win them back.
          Recovery emails can increase conversions by up to 15%.
        </Text>
      </Box>

      <TableShell footerText={`${ABANDONED.length} abandoned checkouts`} showPagination={false}>
        <THead columns={["ID","Customer","Email","Items","Cart Value","Abandoned At","Status",""]} />
        <tbody>
          {ABANDONED.map((a, i) => (
            <TR key={a.id} index={i}>
              <TD><Text fontSize="13px" fontWeight={700} color={T.gray}>{a.id}</Text></TD>
              <TD><Text fontSize="13.5px" fontWeight={500} color={T.text}>{a.customer}</Text></TD>
              <TD><Text fontSize="12.5px" color={T.sub}>{a.email}</Text></TD>
              <TD><Text fontSize="13px" color={T.muted}>{a.items}</Text></TD>
              <TD><Text fontSize="13.5px" fontWeight={600} color={T.text}>{a.value}</Text></TD>
              <TD><Text fontSize="12.5px" color={T.sub}>{a.date}</Text></TD>
              <TD>
                <StatusBadge status={a.recovered ? "Recovered" : "Abandoned"}>
                  {a.recovered ? "Recovered" : "Abandoned"}
                </StatusBadge>
              </TD>
              <TD>
                {!a.recovered && (
                  <AdminButton variant="primary" size="xs">Send email</AdminButton>
                )}
              </TD>
            </TR>
          ))}
        </tbody>
      </TableShell>
    </Box>
  );
}


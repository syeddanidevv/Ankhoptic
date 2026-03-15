"use client";
import { Box, Text, VStack, Flex, Grid, GridItem } from "@chakra-ui/react";
import { T, PageHeader, StatCard, SectionCard, AdminButton, StatusBadge } from "@/components/admin/ui";
import { HStack } from "@chakra-ui/react";

const CAMPAIGNS = [
  { name: "Ramadan Sale 2026",    status: "Active",    type: "Email",     reach: "1,482", sent: "Mar 1, 2026" },
  { name: "Eid Pre-Sale Teaser",  status: "Scheduled", type: "WhatsApp",  reach: "—",     sent: "Mar 20, 2026 (scheduled)" },
  { name: "Welcome Email Series", status: "Active",    type: "Email",     reach: "342",   sent: "Feb 14, 2026" },
  { name: "Abandoned Cart Recovery","status":"Active", type: "Email",     reach: "87",    sent: "Ongoing" },
  { name: "Flash Sale Jan 2026",  status: "Expired",   type: "SMS",       reach: "920",   sent: "Jan 18, 2026" },
];

export default function MarketingPage() {
  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Marketing" subtitle="Campaigns and customer outreach">
        <AdminButton variant="secondary">View reports</AdminButton>
        <AdminButton variant="primary">Create campaign</AdminButton>
      </PageHeader>

      <HStack gap={4} mb={5}>
        <StatCard label="Active Campaigns"  value={CAMPAIGNS.filter(c => c.status === "Active").length} color={T.green} />
        <StatCard label="Scheduled"         value={CAMPAIGNS.filter(c => c.status === "Scheduled").length} color={T.blue} />
        <StatCard label="Total Reach"       value="2,831"  color={T.purple} />
        <StatCard label="Email Open Rate"   value="32.4%"  color={T.warn} sub="+2.1% vs last month" up />
      </HStack>

      <Grid templateColumns="2fr 1fr" gap={4}>
        {/* Campaigns list */}
        <GridItem>
          <SectionCard title="Campaigns">
            <VStack gap={2} align="stretch">
              {CAMPAIGNS.map(c => (
                <Flex
                  key={c.name} justify="space-between" align="center"
                  p={3.5} bg="#f8fafc" borderRadius="9px" border={`1px solid ${T.border}`}
                >
                  <Box>
                    <Text fontSize="13.5px" fontWeight={600} color={T.text}>{c.name}</Text>
                    <Text fontSize="12px" color={T.sub} mt={0.5}>{c.type} · {c.sent}</Text>
                  </Box>
                  <HStack gap={3}>
                    {c.reach !== "—" && (
                      <Text fontSize="12.5px" color={T.gray}>{c.reach} reached</Text>
                    )}
                    <StatusBadge status={c.status}>{c.status}</StatusBadge>
                    <AdminButton variant="secondary" size="xs">View</AdminButton>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </SectionCard>
        </GridItem>

        {/* Quick tips */}
        <GridItem>
          <SectionCard title="Quick tips">
            <VStack gap={3} align="stretch">
              {[
                { tip: "Try WhatsApp campaigns — 98% open rate vs 20% for email" },
                { tip: "Abandoned cart emails sent within 1hr recover 3x more orders" },
                { tip: "Add a referral programme to grow organically" },
                { tip: "Segment customers by location for Eid campaigns" },
              ].map((t, i) => (
                <Box key={i} p={3} bg={T.greenBg} borderRadius="8px" borderLeft={`3px solid ${T.green}`}>
                  <Text fontSize="12.5px" color="#166534">{t.tip}</Text>
                </Box>
              ))}
            </VStack>
          </SectionCard>
        </GridItem>
      </Grid>
    </Box>
  );
}


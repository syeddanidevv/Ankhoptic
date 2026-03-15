"use client";
import { Box, Grid, GridItem, Text, VStack, Flex } from "@chakra-ui/react";
import { T, PageHeader, StatCard, AdminButton } from "@/components/admin/ui";

const METRIC_ROWS = [
  { label: "Total Sessions",        value: "2,841",      change: "+12.4%", up: true  },
  { label: "Unique Visitors",       value: "1,923",      change: "+8.7%",  up: true  },
  { label: "Bounce Rate",           value: "42.1%",      change: "-3.2%",  up: true  },
  { label: "Avg. Session Duration", value: "2m 14s",     change: "+0.3%",  up: true  },
  { label: "Conversion Rate",       value: "1.8%",       change: "+0.4%",  up: true  },
  { label: "Revenue",               value: "Rs 19,100",  change: "+22.1%", up: true  },
];

const TRAFFIC = [
  { source: "Direct",        sessions: 940, pct: 100, color: T.green   },
  { source: "Google Search", sessions: 680, pct: 72,  color: T.blue    },
  { source: "Facebook",      sessions: 420, pct: 45,  color: T.purple  },
  { source: "Instagram",     sessions: 380, pct: 40,  color: T.warn    },
  { source: "WhatsApp",      sessions: 270, pct: 29,  color: T.red     },
  { source: "Referral",      sessions: 151, pct: 16,  color: T.gray    },
];

const BAR_VALS   = [18,24,16,30,22,38,28,42,35,46,40,52];
const BAR_LABELS = ["F22","F23","F24","F25","F26","F27","F28","M1","M2","M3","M4","M5"];

export default function AnalyticsPage() {
  const maxBar = Math.max(...BAR_VALS);
  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Analytics" subtitle="Store performance overview">
        <Box
          as="select" fontSize="12.5px" color={T.text} bg="white"
          border={`1px solid ${T.border}`} borderRadius="8px" px={3} h="34px" cursor="pointer"
        >
          <option>Last 14 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </Box>
        <AdminButton variant="secondary">Export</AdminButton>
      </PageHeader>

      {/* Metric cards */}
      <Grid templateColumns="repeat(3,1fr)" gap={4} mb={5}>
        {METRIC_ROWS.map(m => (
          <StatCard
            key={m.label}
            label={m.label}
            value={m.value}
            sub={`${m.change} vs prev period`}
            up={m.up}
          />
        ))}
      </Grid>

      <Grid templateColumns="2fr 1fr" gap={4}>
        {/* Revenue bar chart */}
        <GridItem>
          <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" p={5} shadow="sm">
            <Text fontSize="14px" fontWeight={600} color={T.text} mb={1}>Daily Revenue</Text>
            <Text fontSize="12px" color={T.sub} mb={5}>Last 12 days</Text>
            <Flex align="flex-end" gap={2} h="140px">
              {BAR_VALS.map((v, i) => (
                <VStack key={i} gap={1} flex={1} align="center" justify="flex-end" h="full">
                  <Box
                    w="full" bg={T.green} borderRadius="4px 4px 0 0"
                    h={`${Math.round((v / maxBar) * 130)}px`}
                    opacity={0.65 + (i / BAR_VALS.length) * 0.35}
                    _hover={{ opacity: 1 }} transition="opacity 0.1s"
                    cursor="pointer"
                  />
                </VStack>
              ))}
            </Flex>
            <Flex mt={2} gap={2}>
              {BAR_LABELS.map((l, i) => (
                <Text key={i} flex={1} fontSize="9px" color={T.sub} textAlign="center">{l}</Text>
              ))}
            </Flex>
          </Box>
        </GridItem>

        {/* Traffic sources */}
        <GridItem>
          <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" p={5} shadow="sm">
            <Text fontSize="14px" fontWeight={600} color={T.text} mb={1}>Traffic Sources</Text>
            <Text fontSize="12px" color={T.sub} mb={4}>Sessions by channel</Text>
            <VStack gap={3} align="stretch">
              {TRAFFIC.map(t => (
                <Box key={t.source}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="12.5px" fontWeight={500} color={T.text}>{t.source}</Text>
                    <Text fontSize="12.5px" fontWeight={600} color={T.text}>{t.sessions.toLocaleString()}</Text>
                  </Flex>
                  <Box bg={T.grayBg} h="6px" borderRadius="full">
                    <Box w={`${t.pct}%`} h="6px" bg={t.color} borderRadius="full" transition="width 0.3s" />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}


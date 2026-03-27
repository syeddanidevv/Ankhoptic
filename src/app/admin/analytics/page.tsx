"use client";
import {
  Box, Grid, Text, VStack, Flex, HStack, Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import {
  T, PageHeader, StatCard, AdminButton,
} from "@/components/admin/ui";
import { RefreshCw, CalendarDays } from "lucide-react";

interface PeriodStats {
  orders: number;
  dispatched: number;
  cancelled: number;
  revenue: number;
}

interface ChartDay {
  label: string;
  orders: number;
  revenue: number;
}

interface Analytics {
  range: PeriodStats;
  allTime: PeriodStats;
  chart: ChartDay[];
  from: string;
  to: string;
}

function fmt(n: number) {
  return `Rs ${Number(n).toLocaleString("en-PK")}`;
}

// yyyy-mm-dd string for <input type="date">
function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Preset ranges
type Preset = "today" | "yesterday" | "7d" | "30d" | "thisMonth" | "lastMonth" | "thisYear" | "allTime";

function getPresetRange(preset: Preset): { from: Date; to: Date; label: string } {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  switch (preset) {
    case "today":
      return { from: today, to: todayEnd, label: "Today" };
    case "yesterday": {
      const yd = new Date(today); yd.setDate(yd.getDate() - 1);
      const ydEnd = new Date(yd); ydEnd.setHours(23, 59, 59, 999);
      return { from: yd, to: ydEnd, label: "Yesterday" };
    }
    case "7d": {
      const f = new Date(today); f.setDate(f.getDate() - 6);
      return { from: f, to: todayEnd, label: "Last 7 days" };
    }
    case "30d": {
      const f = new Date(today); f.setDate(f.getDate() - 29);
      return { from: f, to: todayEnd, label: "Last 30 days" };
    }
    case "thisMonth": {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: f, to: todayEnd, label: "This month" };
    }
    case "lastMonth": {
      const f = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const t = new Date(now.getFullYear(), now.getMonth(), 0);
      t.setHours(23, 59, 59, 999);
      return { from: f, to: t, label: "Last month" };
    }
    case "thisYear": {
      const f = new Date(now.getFullYear(), 0, 1);
      return { from: f, to: todayEnd, label: "This year" };
    }
    case "allTime": {
      const f = new Date("2020-01-01");
      return { from: f, to: todayEnd, label: "All time" };
    }
  }
}

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "thisMonth", label: "This month" },
  { key: "lastMonth", label: "Last month" },
  { key: "thisYear", label: "This year" },
  { key: "allTime", label: "All time" },
];

export default function AnalyticsPage() {
  const defaultRange = getPresetRange("30d");
  const [fromDate, setFromDate] = useState(toDateInput(defaultRange.from));
  const [toDate, setToDate] = useState(toDateInput(defaultRange.to));
  const [activePreset, setActivePreset] = useState<Preset | null>("30d");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState<"orders" | "revenue">("orders");

  const fetchData = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
      const d = await res.json();
      setData(d);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, [fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

  function applyRange() {
    setActivePreset(null);
    fetchData(fromDate, toDate);
  }

  function applyPreset(key: Preset) {
    const r = getPresetRange(key);
    const f = toDateInput(r.from);
    const t = toDateInput(r.to);
    setFromDate(f);
    setToDate(t);
    setActivePreset(key);
    fetchData(f, t);
  }

  const stats = data?.range ?? { orders: 0, dispatched: 0, cancelled: 0, revenue: 0 };
  const chart = data?.chart ?? [];
  const maxVal = Math.max(...chart.map((d) => chartMode === "orders" ? d.orders : d.revenue), 1);

  const dispatchRate = stats.orders > 0 ? ((stats.dispatched / stats.orders) * 100).toFixed(1) : "0.0";

  // Format the selected date range for display
  const rangeLabel = activePreset
    ? getPresetRange(activePreset).label
    : `${fromDate} → ${toDate}`;

  return (
    <Box bg={T.bg} minH="100%" p={{ base: 4, md: 6 }}>
      <PageHeader title="Analytics" subtitle={`Showing: ${rangeLabel}`}>
        <AdminButton variant="secondary" onClick={() => fetchData(fromDate, toDate)}>
          <RefreshCw size={14} />
          Refresh
        </AdminButton>
      </PageHeader>

      {/* ── Date range controls ── */}
      <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" p={4} mb={5}>
        <Flex gap={3} flexWrap="wrap" align="center">
          {/* Preset buttons */}
          <Flex gap={2} flexWrap="wrap">
            {PRESETS.map((p) => (
              <Box
                key={p.key}
                as="button"
                px={3} py={1.5}
                borderRadius="6px"
                fontSize="12px"
                fontWeight={600}
                bg={activePreset === p.key ? T.green : T.bg}
                color={activePreset === p.key ? "white" : T.sub}
                border={`1px solid ${activePreset === p.key ? T.green : T.border}`}
                cursor="pointer"
                onClick={() => applyPreset(p.key)}
                transition="all 0.15s"
                _hover={{ borderColor: T.green, color: T.green }}
              >
                {p.label}
              </Box>
            ))}
          </Flex>

          {/* Separator */}
          <Box w="1px" h="24px" bg={T.border} display={{ base: "none", md: "block" }} />

          {/* Custom date inputs */}
          <Flex gap={2} align="center" flexWrap="wrap">
            <HStack gap={1}>
              <CalendarDays size={14} color={T.sub} />
              <Text fontSize="12px" color={T.sub} fontWeight={500}>Custom:</Text>
            </HStack>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setActivePreset(null); }}
              style={{
                border: `1px solid ${T.border}`, borderRadius: 6,
                padding: "4px 8px", fontSize: 12, color: T.text,
                background: T.bg, outline: "none",
              }}
            />
            <Text fontSize="12px" color={T.sub}>to</Text>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setActivePreset(null); }}
              style={{
                border: `1px solid ${T.border}`, borderRadius: 6,
                padding: "4px 8px", fontSize: 12, color: T.text,
                background: T.bg, outline: "none",
              }}
            />
            <Box
              as="button"
              px={3} py={1.5}
              bg={T.green} color="white"
              borderRadius="6px" fontSize="12px" fontWeight={700}
              cursor="pointer"
              _hover={{ bg: T.greenDark }}
              transition="background 0.15s"
              onClick={applyRange}
            >
              Apply
            </Box>
          </Flex>
        </Flex>
      </Box>

      {loading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="lg" color={T.green} />
        </Flex>
      ) : (
        <>
          {/* KPI cards */}
          <Grid templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} mb={5}>
            <StatCard
              label="Orders received"
              value={String(stats.orders)}
              sub="Total placed"
              color={T.green}
            />
            <StatCard
              label="Dispatched"
              value={String(stats.dispatched)}
              sub="Shipped + Fulfilled"
              color={T.blue}
            />
            <StatCard
              label="Revenue"
              value={stats.revenue > 0 ? fmt(stats.revenue) : "Rs 0"}
              sub="Non-cancelled orders"
              color={T.green}
            />
            <StatCard
              label="Dispatch rate"
              value={`${dispatchRate}%`}
              sub={`${stats.cancelled} cancelled`}
              color="#6366f1"
            />
          </Grid>

          {/* Bar chart */}
          <Box bg="white" border={`1px solid ${T.border}`} borderRadius="12px" p={5} shadow="sm">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Text fontSize="14px" fontWeight={700} color={T.text}>
                  {rangeLabel} — Daily Breakdown
                </Text>
                <Text fontSize="12px" color={T.sub}>{chart.length} days shown</Text>
              </Box>
              <HStack gap={2}>
                {(["orders", "revenue"] as const).map((m) => (
                  <Box
                    key={m}
                    as="button"
                    px={3} py={1.5}
                    borderRadius="6px"
                    fontSize="12px"
                    fontWeight={600}
                    bg={chartMode === m ? T.green : T.bg}
                    color={chartMode === m ? "white" : T.sub}
                    border={`1px solid ${chartMode === m ? T.green : T.border}`}
                    cursor="pointer"
                    onClick={() => setChartMode(m)}
                    transition="all 0.15s"
                    textTransform="capitalize"
                  >
                    {m}
                  </Box>
                ))}
              </HStack>
            </Flex>

            {chart.length === 0 ? (
              <Text fontSize="13px" color={T.sub} textAlign="center" py={8}>No data in this range</Text>
            ) : (
              <>
                <Box overflowX="auto">
                  <Flex align="flex-end" gap="2px" h="160px" minW={`${chart.length * 24}px`}>
                    {chart.map((day, i) => {
                      const val = chartMode === "orders" ? day.orders : day.revenue;
                      const pct = maxVal > 0 ? (val / maxVal) * 150 : 0;
                      return (
                        <VStack key={i} gap={0} flex="1 0 20px" align="center" justify="flex-end" h="full" position="relative" title={`${day.label}: ${chartMode === "orders" ? val + " orders" : fmt(val)}`}>
                          <Box
                            w="full"
                            bg={val > 0 ? T.green : T.grayBg}
                            borderRadius="3px 3px 0 0"
                            h={`${Math.max(pct, val > 0 ? 4 : 2)}px`}
                            opacity={0.7 + (i / chart.length) * 0.3}
                            _hover={{ opacity: 1, transform: "scaleY(1.02)" }}
                            transition="all 0.1s"
                            cursor="pointer"
                          />
                        </VStack>
                      );
                    })}
                  </Flex>
                </Box>
                {/* X-axis labels — show max 14 */}
                {chart.length <= 35 && (
                  <Flex mt={2} gap="2px" overflow="hidden">
                    {chart.map((day, i) => (
                      <Text key={i} flex="1 0 20px" fontSize="9px" color={T.sub} textAlign="center" truncate>
                        {chart.length > 20 && i % 2 !== 0 ? "" : day.label}
                      </Text>
                    ))}
                  </Flex>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

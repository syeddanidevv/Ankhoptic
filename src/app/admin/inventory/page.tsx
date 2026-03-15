"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Text, HStack, Flex,
} from "@chakra-ui/react";
import {
  T, PageHeader, StatCard, TabBar, FilterBar,
  TableShell, THead, TR, TD, EmptyRow, AdminButton,
} from "@/components/admin/ui";
import Image from "next/image";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

/* ─── Types ─── */
interface InventoryItem {
  id: string;
  title: string;
  slug: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  status: string;
  stockStatus: "ok" | "low" | "out";
  brand:    { name: string } | null;
  category: { name: string } | null;
}

interface Stats {
  total: number;
  totalUnits: number;
  low: number;
  out: number;
}

/* ─── Inline stock edit row ─── */
function StockEditCell({
  item,
  onSaved,
}: {
  item: InventoryItem;
  onSaved: (id: string, stockCount: number, inStock: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(item.stockCount.toString());
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    const n = parseInt(val);
    if (isNaN(n) || n < 0) { toast.error("Enter a valid number"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, stockCount: n, inStock: n > 0 }),
      });
      if (!res.ok) throw new Error();
      onSaved(item.id, n, n > 0);
      toast.success("Stock updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <AdminButton variant="ghost" size="xs" onClick={() => setEditing(true)}>
        Edit qty
      </AdminButton>
    );
  }

  return (
    <HStack gap={1}>
      <input
        type="number"
        min={0}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        autoFocus
        style={{
          width: "64px",
          height: "30px",
          padding: "0 8px",
          fontSize: "13px",
          border: `1px solid ${T.green}`,
          borderRadius: "6px",
          outline: "none",
        }}
      />
      <AdminButton variant="primary" size="xs" onClick={save} disabled={saving}>
        {saving ? "…" : "Save"}
      </AdminButton>
      <AdminButton variant="ghost" size="xs" onClick={() => { setEditing(false); setVal(item.stockCount.toString()); }}>
        ✕
      </AdminButton>
    </HStack>
  );
}

/* ─── Stock Badge ─── */
function StockBadge({ status, qty }: { status: "ok" | "low" | "out"; qty: number }) {
  const cfg = {
    ok:  { bg: "#dcfce7", color: "#166534", label: "In Stock"     },
    low: { bg: "#fef9c3", color: "#713f12", label: "Low Stock"    },
    out: { bg: "#fee2e2", color: "#991b1b", label: "Out of Stock" },
  }[status];

  return (
    <Flex align="center" gap={1.5}>
      <Box
        px={2.5} py={0.5}
        bg={cfg.bg} color={cfg.color}
        borderRadius="full"
        fontSize="11.5px" fontWeight={600}
      >
        {cfg.label}
      </Box>
      <Text fontSize="13px" fontWeight={700} color={status === "out" ? T.red : status === "low" ? "#ca8a04" : T.text}>
        {qty}
      </Text>
    </Flex>
  );
}

/* ─── Main Page ─── */
export default function InventoryPage() {
  const [items,   setItems]   = useState<InventoryItem[]>([]);
  const [stats,   setStats]   = useState<Stats>({ total: 0, totalUnits: 0, low: 0, out: 0 });
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("All");
  const [search,  setSearch]  = useState("");

  const stockParam = { All: "all", "In Stock": "ok", "Low Stock": "low", "Out of Stock": "out" }[tab] ?? "all";

  const fetch_ = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ stock: stockParam, ...(search ? { search } : {}) });
    fetch(`/api/inventory?${q}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        if (d.stats) setStats(d.stats);
      })
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, [stockParam, search]);

  useEffect(() => {
    const q = new URLSearchParams({ stock: stockParam, ...(search ? { search } : {}) });
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch(`/api/inventory?${q}`);
        const d = await r.json();
        if (!active) return;
        setItems(d.items ?? []);
        if (d.stats) setStats(d.stats);
      } catch {
        if (active) toast.error("Failed to load inventory");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [stockParam, search]);

  const handleSaved = (id: string, stockCount: number, inStock: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item, stockCount, inStock,
              stockStatus: stockCount === 0 ? "out" : stockCount <= 10 ? "low" : "ok",
            }
          : item
      )
    );
  };


  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader title="Inventory" subtitle="Track and manage product stock levels in real-time">
        <AdminButton variant="secondary" size="sm" onClick={fetch_}>Refresh</AdminButton>
      </PageHeader>

      {/* Stats */}
      <HStack gap={4} mb={5} flexWrap="wrap">
        <StatCard label="Total Products"  value={stats.total}      />
        <StatCard label="Total Units"     value={stats.totalUnits} />
        <StatCard label="Low Stock"       value={stats.low}  color={T.warn} />
        <StatCard label="Out of Stock"    value={stats.out}  color={T.red}  />
      </HStack>

      {loading ? (
        <Flex justify="center" py={20} direction="column" align="center" gap={3}>
          <Box
            w="38px"
            h="38px"
            borderRadius="full"
            border="3px solid"
            borderColor={T.border}
            borderTopColor={T.green}
            style={{ animation: "spin 0.75s linear infinite" }}
          />
          <Text fontSize="13px" color={T.sub} fontWeight={500}>
            Loading inventory...
          </Text>
        </Flex>
      ) : (
        <TableShell
          footerText={`Showing ${items.length} of ${stats.total} products`}
          header={
            <>
              <TabBar
                tabs={["All", "In Stock", "Low Stock", "Out of Stock"]}
                active={tab}
                onChange={setTab}
              />
              <FilterBar
                search={search}
                onSearch={setSearch}
                placeholder="Search by product name..."
              />
            </>
          }
        >
          <THead columns={["Product", "Brand", "Category", "Stock", "Status", "Actions"]} />
          <tbody>
            {items.length === 0
              ? <EmptyRow cols={6} message="No products match your filter." />
              : items.map((item, i) => {
                  const thumb = Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0] as string : null;

                  return (
                    <TR key={item.id} index={i}>
                      {/* Product */}
                      <TD>
                        <Flex align="center" gap={3}>
                          <Box
                            w="38px" h="38px" borderRadius="8px" flexShrink={0}
                            overflow="hidden" border={`1px solid ${T.border}`}
                            bg={T.bg} position="relative"
                          >
                            {thumb ? (
                              <Image src={thumb} alt={item.title} fill style={{ objectFit: "cover" }} sizes="38px" />
                            ) : (
                              <Flex w="full" h="full" align="center" justify="center">
                                <Package size={14} color={T.muted} />
                              </Flex>
                            )}
                          </Box>
                          <Box>
                            <Text fontSize="13.5px" fontWeight={600} color={T.text} lineClamp={1}>
                              {item.title}
                            </Text>
                            <Text fontSize="11.5px" color={T.muted} fontFamily="mono">
                              {item.slug}
                            </Text>
                          </Box>
                        </Flex>
                      </TD>

                      {/* Brand */}
                      <TD>
                        <Text fontSize="13px" color={T.sub}>
                          {item.brand?.name ?? "—"}
                        </Text>
                      </TD>

                      {/* Category */}
                      <TD>
                        <Text fontSize="13px" color={T.sub}>
                          {item.category?.name ?? "—"}
                        </Text>
                      </TD>

                      {/* Stock count */}
                      <TD>
                        <StockBadge status={item.stockStatus} qty={item.stockCount} />
                      </TD>

                      {/* Product status */}
                      <TD>
                        <Box
                          px={2} py={0.5} display="inline-block"
                          borderRadius="full"
                          fontSize="11px" fontWeight={600}
                          bg={
                            item.status === "ACTIVE"   ? "#dcfce7" :
                            item.status === "ARCHIVED" ? "#f1f5f9" : "#fef9c3"
                          }
                          color={
                            item.status === "ACTIVE"   ? "#166534" :
                            item.status === "ARCHIVED" ? T.muted   : "#713f12"
                          }
                        >
                          {item.status}
                        </Box>
                      </TD>

                      {/* Edit qty */}
                      <TD>
                        <StockEditCell item={item} onSaved={handleSaved} />
                      </TD>
                    </TR>
                  );
                })
            }
          </tbody>
        </TableShell>
      )}
    </Box>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const search      = searchParams.get("search") ?? "";
    const stockFilter = searchParams.get("stock") ?? "all"; // all | ok | low | out

    const products = await prisma.product.findMany({
      where: {
        ...(search ? {
          OR: [
            { title: { contains: search } },
            { slug:  { contains: search } },
          ],
        } : {}),
      },
      select: {
        id:         true,
        title:      true,
        slug:       true,
        images:     true,
        inStock:    true,
        stockCount: true,
        status:     true,
        brand:      { select: { name: true } },
        category:   { select: { name: true } },
        updatedAt:  true,
      },
      orderBy: { stockCount: "asc" }, // low stock first
    });

    // Compute stock status
    const items = products.map((p) => ({
      ...p,
      stockStatus:
        p.stockCount === 0 ? "out" :
        p.stockCount <= 10  ? "low" : "ok",
    }));

    // Client-side filter by stock status
    const filtered = stockFilter === "all"
      ? items
      : items.filter((i) => i.stockStatus === stockFilter);

    const stats = {
      total:     products.length,
      totalUnits: products.reduce((s, p) => s + p.stockCount, 0),
      low:       items.filter((i) => i.stockStatus === "low").length,
      out:       items.filter((i) => i.stockStatus === "out").length,
    };

    return NextResponse.json({ items: filtered, stats });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// PATCH — update stock count for a product
export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const { id, stockCount } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(stockCount !== undefined && { stockCount: parseInt(stockCount) }),
        inStock: true, // Always true for now as requested
      },
      select: { id: true, stockCount: true, inStock: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}

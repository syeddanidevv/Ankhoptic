import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandSlug = searchParams.get("brand");
    const color     = searchParams.get("color");
    const disposability = searchParams.get("disposability");
    const search    = searchParams.get("search");
    const featured  = searchParams.get("featured");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "24");
    const skip      = (page - 1) * limit;

    const where = {
      status: "ACTIVE" as const,
      ...(color    ? { color: color as "BLUE"|"BROWN"|"GOLDEN"|"GRAY"|"GREEN"|"HAZEL"|"PURPLE"|"YELLOW"|"BLACK"|"OTHER" } : {}),
      ...(disposability ? { disposability } : {}),
      ...(featured ? { featured: true } : {}),
      ...(brandSlug ? { brand: { slug: brandSlug } } : {}),
      ...(search ? {
        OR: [
          { title:       { contains: search } },
          { description: { contains: search } },
          { brand: { name: { contains: search } } },
        ],
      } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand:    { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
          _count:   { select: { reviews: true } },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (err) {
    console.error("[GET /api/store/products]", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

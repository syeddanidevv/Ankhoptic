import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      include: {
        brand:        { select: { name: true, slug: true } },
        category:     { select: { name: true, slug: true } },
        powerOptions: { orderBy: { position: "asc" } },
        reviews: {
          where:   { approved: true },
          select:  { id: true, name: true, rating: true, comment: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take:    10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error("[GET /api/store/products/[slug]]", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

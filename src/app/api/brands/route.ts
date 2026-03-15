import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET() {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(brands);
  } catch {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { name, slug, logo } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const brand = await prisma.brand.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        logo: logo || null,
      },
    });
    return NextResponse.json(brand, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

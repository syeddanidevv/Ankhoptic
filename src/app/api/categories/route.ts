import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const flat = searchParams.get("flat") === "1"; // ?flat=1 for dropdown lists

    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search };

    if (flat) {
      // Lightweight flat list for dropdowns (products form etc.)
      const categories = await prisma.category.findMany({
        where,
        select: { id: true, name: true, parentId: true, brandId: true },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ categories, total: categories.length });
    }

    // Full nested tree: only fetch root-level (parentId = null), include children
    const categories = await prisma.category.findMany({
      where: { ...where, parentId: null },
      orderBy: { position: "asc" },
      include: {
        brand: { select: { id: true, name: true } },
        _count: { select: { products: true } },
        children: {
          orderBy: { position: "asc" },
          include: {
            brand: { select: { id: true, name: true } },
            _count: { select: { products: true } },
          },
        },
      },
    });

    const total = await prisma.category.count({ where });

    return NextResponse.json({ categories, total });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug, image, parentId, brandId } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    let finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Ensure uniqueness of the slug
    const slugExists = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (slugExists) {
      const suffix = Math.random().toString(36).substring(2, 6);
      finalSlug = `${finalSlug}-${suffix}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        image: image || null,
        parentId: parentId || null,
        brandId: brandId || null,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A category with this name or slug already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

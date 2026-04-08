import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "LENS" | "GLASSES" | "ACCESSORY" | null;

    const brands = await prisma.brand.findMany({
      where: type
        ? {
            products: {
              some: { productType: type },
            },
          }
        : undefined,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        categories: {
          // Only include categories that have at least one product of the requested type
          where: type
            ? {
                products: {
                  some: { productType: type },
                },
              }
            : undefined,
          select: { id: true, name: true, slug: true },
          orderBy: { position: "asc" },
        },
      },
    });
    const unbrandedCategories = await prisma.category.findMany({
      where: {
        brandId: null,
        products: type ? { some: { productType: type, status: "ACTIVE" } } : { some: { status: "ACTIVE" } },
      },
      select: { id: true, name: true, slug: true },
      orderBy: { position: "asc" },
    });

    // We also want to check if there are unbranded products with no category at all
    const unbrandedProductsCount = await prisma.product.count({
      where: {
        brandId: null,
        productType: type || undefined,
        status: "ACTIVE"
      }
    });

    if (unbrandedProductsCount > 0) {
      const pseudoBrandName = type === "GLASSES" ? "Other Glasses" : type === "LENS" ? "Other Lenses" : "Other Products";
      brands.push({
        id: "unbranded",
        name: pseudoBrandName,
        slug: "unbranded",
        logo: null,
        categories: unbrandedCategories,
      } as any);
    }

    return NextResponse.json(brands);
  } catch (err) {
    console.error("[GET /api/store/brands]", err);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

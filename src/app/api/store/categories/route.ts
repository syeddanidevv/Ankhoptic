import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      brand: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(categories);
}

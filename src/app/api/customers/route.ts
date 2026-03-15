import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page   = parseInt(searchParams.get("page") ?? "1");
    const limit  = parseInt(searchParams.get("limit") ?? "20");
    const skip   = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name:  { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ],
    } : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id:          true,
          name:        true,
          email:       true,
          phone:       true,
          totalSpent:  true,
          ordersCount: true,
          createdAt:   true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({ customers, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

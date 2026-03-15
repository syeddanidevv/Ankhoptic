import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!customer) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const { searchParams } = new URL(req.url);
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where:   { customerId: customer.id },
        include: { items: { select: { id: true, productTitle: true, qty: true, unitPrice: true, lensType: true, rightEyePower: true, aftercareName: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { customerId: customer.id } }),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch (err) {
    console.error("[GET /api/store/orders]", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

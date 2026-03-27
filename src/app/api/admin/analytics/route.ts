import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

async function getStats(from: Date, to: Date) {
  const [
    totalOrders,
    dispatchedOrders,
    cancelledOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: from, lte: to } },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: from, lte: to },
        fulfillmentStatus: { in: ["SHIPPED", "FULFILLED"] },
      },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: from, lte: to },
        status: { in: ["CANCELLED", "REFUNDED"] },
      },
    }),
    // Revenue = sum of ALL non-cancelled order totals (includes COD pending)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: from, lte: to },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      _sum: { total: true },
    }),
  ]);

  return {
    orders: totalOrders,
    dispatched: dispatchedOrders,
    cancelled: cancelledOrders,
    revenue: revenueResult._sum.total ?? 0,
  };
}

// Build daily chart data for a given date range
async function getDailyChart(from: Date, to: Date) {
  const result = [];
  const current = new Date(from);
  current.setHours(0, 0, 0, 0);

  while (current <= to) {
    const dayStart = new Date(current);
    const dayEnd = new Date(current);
    dayEnd.setHours(23, 59, 59, 999);

    const [orders, revenue] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: dayStart, lte: dayEnd },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { total: true },
      }),
    ]);

    result.push({
      label: dayStart.toLocaleDateString("en-PK", { day: "2-digit", month: "short" }),
      orders,
      revenue: revenue._sum.total ?? 0,
    });

    current.setDate(current.getDate() + 1);
  }
  return result;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const now = new Date();

  // Default: last 30 days
  let from = new Date(now);
  from.setDate(from.getDate() - 29);
  from.setHours(0, 0, 0, 0);

  let to = new Date(now);
  to.setHours(23, 59, 59, 999);

  if (fromParam) {
    const d = new Date(fromParam);
    if (!isNaN(d.getTime())) { from = d; from.setHours(0, 0, 0, 0); }
  }
  if (toParam) {
    const d = new Date(toParam);
    if (!isNaN(d.getTime())) { to = d; to.setHours(23, 59, 59, 999); }
  }

  // Cap chart to 90 days to avoid too many queries
  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  const chartFrom = daysDiff > 90
    ? new Date(to.getTime() - 89 * 24 * 60 * 60 * 1000)
    : from;

  const [rangeStats, chart] = await Promise.all([
    getStats(from, to),
    getDailyChart(chartFrom, to),
  ]);

  // Also get all-time total for comparison
  const allTime = await getStats(new Date("2020-01-01"), to);

  return NextResponse.json({
    range: rangeStats,
    allTime,
    chart,
    from: from.toISOString(),
    to: to.toISOString(),
  });
}

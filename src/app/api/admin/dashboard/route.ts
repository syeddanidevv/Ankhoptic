/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total valid orders
    const validOrdersWhere = { status: { not: "CANCELLED" as any } };
    const allOrders = await prisma.order.findMany({
      where: validOrdersWhere,
      select: { total: true, createdAt: true },
    });
    
    // Revenue calculations
    let totalRevenue = 0;
    let todayRevenue = 0;
    let todayOrdersCount = 0;
    
    for (const o of allOrders) {
      totalRevenue += o.total;
      if (o.createdAt >= today) {
        todayRevenue += o.total;
        todayOrdersCount++;
      }
    }

    const totalOrders = allOrders.length;
    
    // Customers (from customer table + guest emails?) We'll just count customers.
    const totalCustomers = await prisma.customer.count();

    // Pending Unfulfilled
    const unfulfilledCount = await prisma.order.count({
      where: { fulfillmentStatus: "UNFULFILLED" as any }
    });
    
    // COD pending
    const codPendingCount = await prisma.order.count({
      where: { 
        paymentMethod: "COD" as any,
        paymentStatus: "UNPAID" as any
      }
    });

    // Recent 5 orders
    const recentOrdersRaw = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true } },
        items: { select: { id: true } }
      }
    });

    const recentOrders = recentOrdersRaw.map(o => ({
      id: `#${o.orderNumber}`,
      customer: o.customer?.name || o.guestName || "Guest",
      total: `Rs ${o.total.toLocaleString()}`,
      items: o.items.length,
      status: o.fulfillmentStatus,
      pay: o.paymentStatus,
      date: new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    // Construct response
    return NextResponse.json({
      revenue: totalRevenue,
      todayRevenue: todayRevenue,
      orders: totalOrders,
      todayOrders: todayOrdersCount,
      customers: totalCustomers,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      unfulfilled: unfulfilledCount,
      codPending: codPendingCount,
      recentOrders
    });

  } catch (error) {
    console.error("Dashboard api error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

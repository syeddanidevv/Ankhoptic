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
    
    // For sparkline data (last 12 days)
    const dateArray = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (11 - i));
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const revenueChart = new Array(12).fill(0);
    const ordersChart = new Array(12).fill(0);

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
      
      const odrDate = new Date(o.createdAt).setHours(0, 0, 0, 0);
      const idx = dateArray.indexOf(odrDate);
      if (idx !== -1) {
        revenueChart[idx] += o.total;
        ordersChart[idx] += 1;
      }
    }

    const totalOrders = allOrders.length;
    
    // Customers (from customer table + guest emails?) We'll just count customers.
    const allCustomers = await prisma.customer.findMany({ select: { createdAt: true } });
    const totalCustomers = allCustomers.length;
    
    const customersChart = new Array(12).fill(0);
    for (const c of allCustomers) {
      const cDate = new Date(c.createdAt).setHours(0, 0, 0, 0);
      const idx = dateArray.indexOf(cDate);
      if (idx !== -1) {
        customersChart[idx] += 1;
      }
    }
    
    const avgValueChart = revenueChart.map((r, i) => ordersChart[i] > 0 ? Math.round(r / ordersChart[i]) : 0);

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
      id: `#${1000 + o.orderNumber}`,
      customer: o.customer?.name || (o.shippingAddress as any)?.name || "Guest",
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
      recentOrders,
      revenueChart,
      ordersChart,
      customersChart,
      avgValueChart,
    });

  } catch (error) {
    console.error("Dashboard api error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

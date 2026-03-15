import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { searchParams } = new URL(req.url);
    const status      = searchParams.get("status");
    const payment     = searchParams.get("payment") ?? searchParams.get("paymentStatus");
    const fulfillment = searchParams.get("fulfillment") ?? searchParams.get("fulfillmentStatus");
    const search      = searchParams.get("search");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const limit     = parseInt(searchParams.get("limit") ?? "20");
    const skip      = (page - 1) * limit;

    const where = {
      ...(status      ? { status:            status      as "PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED"|"REFUNDED" } : {}),
      ...(payment     ? { paymentStatus:     payment     as "UNPAID"|"PAID"|"PARTIALLY_PAID"|"REFUNDED"|"COD_PENDING" } : {}),
      ...(fulfillment ? { fulfillmentStatus: fulfillment as "UNFULFILLED"|"PARTIALLY_FULFILLED"|"FULFILLED"|"RESTOCKED" } : {}),
      ...(search  ? {
        OR: [
          { guestName:  { contains: search } },
          { guestEmail: { contains: search } },
          { guestPhone: { contains: search } },
          { customer: { name: { contains: search } } },
          { orderNumber: isNaN(parseInt(search)) ? undefined : parseInt(search) },
        ].filter(Boolean),
      } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, email: true } },
          items:    { select: { id: true, productTitle: true, qty: true, unitPrice: true, total: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

const PAY_METHOD_MAP: Record<string, string> = {
  COD: "COD", EASYPAISA: "EASYPAISA", JAZZCASH: "JAZZCASH",
  BANK: "BANK_TRANSFER", CARD: "CARD",
};

export async function POST(req: NextRequest) {
  // Note: POST orders is public — storefront places orders without admin auth
  try {
    const body = await req.json();
    const {
      guestName, guestEmail, guestPhone,
      address, city, province, postalCode, notes,
      paymentMethod, items, customerId,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const subtotal = (items as { unitPrice: number; addonPrice: number; qty: number }[])
      .reduce((s, i) => s + (i.unitPrice + i.addonPrice) * i.qty, 0);
    const shippingCost   = subtotal >= 2000 ? 0 : 200;
    const total          = subtotal + shippingCost;
    const mappedMethod   = PAY_METHOD_MAP[paymentMethod] ?? "COD";
    const paymentStatus  = mappedMethod === "COD" ? "COD_PENDING" : "UNPAID";

    const order = await prisma.order.create({
      data: {
        ...(customerId ? { customerId } : {}),
        guestName:   customerId ? null : guestName,
        guestEmail:  customerId ? null : guestEmail,
        guestPhone:  customerId ? null : guestPhone,
        paymentMethod: mappedMethod as "COD"|"EASYPAISA"|"JAZZCASH"|"CARD"|"BANK_TRANSFER",
        paymentStatus: paymentStatus as "COD_PENDING"|"UNPAID",
        subtotal,
        shippingCost,
        total,
        notes: notes || null,
        shippingAddress: { address, city, province, postalCode: postalCode || "" },
        items: {
          create: (items as {
            slug: string; title: string; lensType: string;
            power: string | null; addonName: string; addonPrice: number;
            unitPrice: number; qty: number;
          }[]).map(it => ({
            productTitle:  it.title,
            lensType:      (it.lensType === "EYESIGHT" ? "EYESIGHT" : "PLAIN") as "PLAIN"|"EYESIGHT",
            rightEyePower: it.lensType === "EYESIGHT" ? (it.power ?? null) : null,
            aftercareName: it.addonName !== "No aftercare" ? it.addonName : null,
            aftercarePrice: it.addonPrice,
            qty:            it.qty,
            unitPrice:      it.unitPrice,
            total:          (it.unitPrice + it.addonPrice) * it.qty,
          })),
        },
      },
      select: { id: true, orderNumber: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              select: { images: true },
            },
          },
        },
        discount: true,
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const body  = await req.json();

    // Validate allowed enum values to avoid Prisma crashes
    const VALID_ORDER   = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","COMPLETED","CANCELLED","REFUNDED"];
    const VALID_PAYMENT = ["UNPAID","PAID","PARTIALLY_PAID","COD_PENDING","CANCELLED","REFUNDED"];
    const VALID_FULFILL = ["UNFULFILLED","PARTIALLY_FULFILLED","FULFILLED","SHIPPED","RETURNED","RESTOCKED","CANCELLED"];

    if (body.status            && !VALID_ORDER.includes(body.status))
      return NextResponse.json({ error: `Invalid order status: ${body.status}` }, { status: 400 });
    if (body.paymentStatus     && !VALID_PAYMENT.includes(body.paymentStatus))
      return NextResponse.json({ error: `Invalid payment status: ${body.paymentStatus}` }, { status: 400 });
    if (body.fulfillmentStatus && !VALID_FULFILL.includes(body.fulfillmentStatus))
      return NextResponse.json({ error: `Invalid fulfillment status: ${body.fulfillmentStatus}` }, { status: 400 });

    const updateData: Record<string, string | null> = {
      trackingNumber: body.trackingNumber ?? null,
      notes:          body.notes          ?? null,
    };

    if (body.status)            updateData.status            = body.status;
    if (body.paymentStatus)     updateData.paymentStatus     = body.paymentStatus;
    if (body.fulfillmentStatus) updateData.fulfillmentStatus = body.fulfillmentStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: {
          include: {
            product: { select: { images: true } },
          },
        },
      },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error("[PATCH /api/orders/:id]", err);
    const msg = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

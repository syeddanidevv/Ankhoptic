import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Extract the public_id from a Cloudinary secure_url */
function extractPublicId(url: string): string | null {
  try {
    // e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/filename.jpg
    //   or https://res.cloudinary.com/demo/raw/upload/v123/folder/filename.pdf
    const match = url.match(/\/(?:image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

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
          items:    { select: { id: true, productTitle: true, qty: true, unitPrice: true, total: true, lensType: true, rightEyePower: true } },
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
      name, email, phone,
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

    // Fetch products to get original IDs
    const slugs = Array.from(new Set((items as { slug: string }[]).map(i => i.slug)));
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    const productMap = Object.fromEntries(products.map(p => [p.slug, p.id]));

    // Verify customerId actually exists in Customer table (session could have AdminUser id or stale data)
    let validCustomerId: string | null = null;
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true },
      });
      validCustomerId = customer?.id ?? null;
    }

    const order = await prisma.order.create({
      data: {
        ...(validCustomerId ? { customerId: validCustomerId } : {}),
        paymentMethod: mappedMethod as "COD"|"EASYPAISA"|"JAZZCASH"|"CARD"|"BANK_TRANSFER",
        paymentStatus: paymentStatus as "COD_PENDING"|"UNPAID",
        subtotal,
        shippingCost,
        total,
        notes: notes || null,
        shippingAddress: JSON.stringify({ 
          name, 
          email, 
          phone, 
          address, 
          city, 
          province, 
          postalCode: postalCode || "" 
        }),
        items: {
          create: (items as {
            slug: string; title: string; lensType: string;
            power: string | null; addonName: string; addonPrice: number;
            unitPrice: number; qty: number; prescriptionUrl: string | null;
          }[]).map(it => ({
            productId:       productMap[it.slug] || null,
            productTitle:    it.title,
            lensType:        (it.lensType === "EYESIGHT" ? "EYESIGHT" : "PLAIN") as "PLAIN"|"EYESIGHT",
            rightEyePower:   it.lensType === "EYESIGHT" ? (it.power ?? null) : null,
            prescriptionUrl: it.prescriptionUrl ?? null,
            aftercareName:   it.addonName !== "No aftercare" ? it.addonName : null,
            aftercarePrice:  it.addonPrice,
            qty:             it.qty,
            unitPrice:       it.unitPrice,
            total:           (it.unitPrice + it.addonPrice) * it.qty,
          })),
        },
      },
      select: { id: true, orderNumber: true },
    });

    // Rename prescription files on Cloudinary to include the order number
    const prescriptionUrls = (items as { prescriptionUrl?: string | null }[])
      .map(it => it.prescriptionUrl)
      .filter((u): u is string => !!u);

    const renamedUrls: Record<string, string> = {};
    await Promise.all(
      prescriptionUrls.map(async (url, idx) => {
        const publicId = extractPublicId(url);
        if (!publicId) return;
        const isRaw = url.includes("/raw/");
        const newPublicId = `ankhoptics-prescriptions/prescription-order-${1000 + order.orderNumber}${idx > 0 ? `-${idx}` : ""}`;
        try {
          const result = await cloudinary.uploader.rename(
            publicId, newPublicId,
            { resource_type: isRaw ? "raw" : "image", overwrite: true }
          ) as { secure_url: string };
          renamedUrls[url] = result.secure_url;
        } catch (e) {
          console.warn("[orders] Cloudinary rename failed for", publicId, e);
        }
      })
    );

    // Update order items with the renamed URLs if any
    if (Object.keys(renamedUrls).length > 0) {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        select: { items: { select: { id: true, prescriptionUrl: true } } },
      });
      await Promise.all(
        (fullOrder?.items ?? []).map(item => {
          const newUrl = item.prescriptionUrl ? renamedUrls[item.prescriptionUrl] : null;
          if (!newUrl) return;
          return prisma.orderItem.update({ where: { id: item.id }, data: { prescriptionUrl: newUrl } });
        })
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/orders]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

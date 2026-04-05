import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

async function getCustomerId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; userType?: string } | undefined;
  if (!user?.id || user.userType !== "customer") return null;
  return user.id;
}

// GET /api/account/orders
export async function GET() {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { images: true } } },
      },
    },
  });

  const result = orders.map((o) => {
    // Resolve first product image: use snapshot first, fallback to live product.images[0]
    const firstItem = o.items[0];
    let firstImage: string | null = firstItem?.productImage ?? null;
    if (!firstImage && firstItem?.product) {
      let imgs: unknown = firstItem.product.images;
      if (typeof imgs === "string") {
        try {
          imgs = JSON.parse(imgs || "[]");
        } catch {
          imgs = imgs ? [imgs] : [];
        }
      }
      firstImage = Array.isArray(imgs) && imgs.length > 0 ? (imgs[0] as string) : null;
    }

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      total: o.total,
      itemCount: o.items.reduce((s, i) => s + i.qty, 0),
      createdAt: o.createdAt,
      // First item details for order list preview
      firstImage,
      firstItemTitle: firstItem?.productTitle ?? null,
      items: o.items.map((item) => ({
        productTitle: item.productTitle,
        qty: item.qty,
      })),
    };
  });

  return NextResponse.json(result);
}

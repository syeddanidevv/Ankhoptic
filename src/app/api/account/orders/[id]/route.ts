import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

async function getCustomerId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; userType?: string } | undefined;
  if (!user?.id || user.userType !== "customer") return null;
  return user.id;
}

// GET /api/account/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          // Include product relation to get images as fallback
          product: { select: { images: true } },
        },
      },
    },
  });

  if (!order || order.customerId !== customerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Normalize items: resolve productImage from snapshot OR live product.images[0]
  const normalized = {
    ...order,
    items: order.items.map((item) => {
      let image = item.productImage ?? null;
      if (!image && item.product) {
        let imgs: unknown = item.product.images;
        if (typeof imgs === "string") {
          try {
            imgs = JSON.parse(imgs || "[]");
          } catch {
            imgs = imgs ? [imgs] : [];
          }
        }
        image = Array.isArray(imgs) && imgs.length > 0 ? (imgs[0] as string) : null;
      }
      return {
        id: item.id,
        productTitle: item.productTitle,
        productImage: image,
        lensType: item.lensType,
        rightEyePower: item.rightEyePower,
        leftEyePower: item.leftEyePower,
        aftercareName: item.aftercareName,
        aftercarePrice: item.aftercarePrice,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.total,
      };
    }),
  };

  return NextResponse.json(normalized);
}

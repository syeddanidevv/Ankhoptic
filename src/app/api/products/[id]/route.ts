import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";
import { deleteImage }   from "@/lib/cloudinary";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand:        true,
        category:     true,
        powerOptions: { orderBy: { position: "asc" } },
        reviews:      {
          where:   { approved: true },
          include: { customer: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take:    10,
        },
      },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    return NextResponse.json(parsedProduct);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
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
    const body = await req.json();

    // Type corrections logic similar to POST if needed, but for now just handle what's needed:
    if (body.enableAddons !== undefined) {
      body.enableAddons = Boolean(body.enableAddons);
    }
    
    // Enforce inStock = true as requested
    body.inStock = true;

    if (body.images !== undefined) {
      body.images = JSON.stringify(body.images);
    }

    const product = await prisma.product.update({
      where: { id },
      data:  body,
      include: { brand: true, category: true },
    });
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };
    return NextResponse.json(parsedProduct);
  } catch (e) {
    console.error("Failed to update product:", e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    // Delete all images associated with the product from Cloudinary
    if (product.images) {
      try {
        const imagesArray = JSON.parse(product.images);
        if (Array.isArray(imagesArray)) {
          await Promise.all(
            imagesArray.map((img: unknown) =>
              typeof img === "string" ? deleteImage(img) : Promise.resolve()
            )
          );
        }
      } catch (err) {
        console.error("Failed to parse product images during delete", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

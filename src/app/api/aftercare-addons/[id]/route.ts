import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteImage } from "@/lib/cloudinary";

// PATCH /api/aftercare-addons/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  const { id } = await params;
  try {
    const { name, extraCharge, retailPrice, description, active, image, appliesTo } = await req.json();

    // If image is being replaced, delete the old one from Cloudinary
    if (image !== undefined) {
      const existing = await prisma.aftercareAddon.findUnique({ where: { id }, select: { image: true } });
      if (existing?.image && existing.image !== image) {
        await deleteImage(existing.image);
      }
    }

    const addon = await prisma.aftercareAddon.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(extraCharge !== undefined && { extraCharge: parseFloat(extraCharge) }),
        ...(retailPrice !== undefined && { retailPrice: parseFloat(retailPrice) }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(active !== undefined && { active }),
        ...(image !== undefined && { image: image || null }),
        ...(appliesTo !== undefined && { appliesTo }),
      },
    });
    return NextResponse.json(addon);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update addon" }, { status: 500 });
  }
}

// DELETE /api/aftercare-addons/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  const { id } = await params;
  try {
    const addon = await prisma.aftercareAddon.findUnique({ where: { id } });
    if (!addon) return NextResponse.json({ error: "Addon not found" }, { status: 404 });

    await prisma.aftercareAddon.delete({ where: { id } });

    // Delete image from Cloudinary if it exists
    if (addon.image) {
      await deleteImage(addon.image);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete addon" }, { status: 500 });
  }
}


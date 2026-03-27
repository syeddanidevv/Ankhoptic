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

// PUT /api/account/addresses/[id] — update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.customerId !== customerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name, phone, line1, line2, city, province, isDefault } = await req.json();

  if (isDefault) {
    await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: { name, phone, line1, line2, city, province, isDefault: !!isDefault },
  });
  return NextResponse.json(updated);
}

// PATCH /api/account/addresses/[id] — set as default
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.customerId !== customerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
  const updated = await prisma.address.update({ where: { id }, data: { isDefault: true } });
  return NextResponse.json(updated);
}

// DELETE /api/account/addresses/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.customerId !== customerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

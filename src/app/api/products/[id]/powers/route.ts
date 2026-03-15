import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const { value, label, position } = await req.json();
    if (!value) return NextResponse.json({ error: "value required" }, { status: 400 });

    const power = await prisma.productPowerOption.create({
      data: {
        productId: id,
        value,
        label: label ?? value,
        position: position ?? 0,
      },
    });
    return NextResponse.json(power, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create power option" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const powers = await prisma.productPowerOption.findMany({
      where:   { productId: id },
      orderBy: { position: "asc" },
    });
    return NextResponse.json(powers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch power options" }, { status: 500 });
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
    await prisma.productPowerOption.deleteMany({ where: { productId: id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete power options" }, { status: 500 });
  }
}

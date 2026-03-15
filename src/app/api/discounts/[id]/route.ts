/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const {
      title, code, type, value,
      minOrderAmount, startsAt, endsAt, active,
      appliesToAll, categoryIds, brandIds,
    } = await req.json();
    const { id } = await params;

    const data: any = {
      title,
      code: code || null,
      type,
      value: Number(value),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt:   endsAt   ? new Date(endsAt)   : null,
      active:   active   ?? true,
      appliesToAll: appliesToAll ?? true,
      categories: { set: categoryIds?.map((i: string) => ({ id: i })) ?? [] },
      brands:     { set: brandIds?.map((i: string) => ({ id: i })) ?? [] },
    };

    const discount = await prisma.discount.update({ where: { id }, data });
    return NextResponse.json(discount);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update discount" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    await prisma.discount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete discount" }, { status: 500 });
  }
}

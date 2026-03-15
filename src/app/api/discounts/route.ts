/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const now = new Date();
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { code: { contains: search } },
      ];
    }

    if (status === "ACTIVE") {
      where.active = true;
      where.AND = [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null },   { endsAt:   { gte: now } }] },
      ];
    } else if (status === "SCHEDULED") {
      where.startsAt = { gt: now };
    } else if (status === "EXPIRED") {
      where.endsAt = { lt: now };
    } else if (status === "DRAFT") {
      where.active = false;
    }

    // typed as any so brands relation works before/after migration
    const includeQuery: any = {
      categories: { select: { id: true, name: true } },
      products:   { select: { id: true, title: true } },
      brands:     { select: { id: true, name: true } },
    };

    const [discounts, total] = await Promise.all([
      prisma.discount.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: includeQuery,
      }),
      prisma.discount.count({ where }),
    ]);

    return NextResponse.json({ discounts, total });
  } catch {
    return NextResponse.json({ error: "Failed to fetch discounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      title, code, type, value,
      minOrderAmount, maxUsage, perCustomerMax,
      startsAt, endsAt, active, isAutomatic,
      appliesToAll, categoryIds, brandIds,
    } = await req.json();

    const data: any = {
      title,
      code: code || null,
      type,
      value: Number(value),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
      maxUsage:       maxUsage ? Number(maxUsage) : null,
      perCustomerMax: perCustomerMax ? Number(perCustomerMax) : null,
      startsAt:       startsAt ? new Date(startsAt) : null,
      endsAt:         endsAt   ? new Date(endsAt)   : null,
      active:         active   ?? true,
      isAutomatic:    isAutomatic ?? false,
      appliesToAll:   appliesToAll ?? true,
      categories: categoryIds?.length
        ? { connect: categoryIds.map((id: string) => ({ id })) }
        : undefined,
      brands: brandIds?.length
        ? { connect: brandIds.map((id: string) => ({ id })) }
        : undefined,
    };

    const discount = await prisma.discount.create({ data });
    return NextResponse.json(discount, { status: 201 });
  } catch (err) {
    console.error("Error creating discount:", err);
    return NextResponse.json({ error: "Failed to create discount" }, { status: 500 });
  }
}

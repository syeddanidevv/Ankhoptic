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

// GET /api/account/addresses
export async function GET() {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { customerId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(addresses);
}

// POST /api/account/addresses
export async function POST(req: NextRequest) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, line1, line2, city, province, isDefault } = body;

  if (!name || !phone || !line1 || !city || !province) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // If setting as default, clear other defaults first
    if (isDefault) {
      await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: { customerId, name, phone, line1, line2, city, province, isDefault: !!isDefault },
    });
    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

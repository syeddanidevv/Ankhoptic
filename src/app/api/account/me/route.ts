import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function getCustomerId() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; userType?: string } | undefined;
  if (!user?.id || user.userType !== "customer") return null;
  return user.id;
}

// GET /api/account/me
export async function GET() {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [customer, ordersData] = await Promise.all([
    prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    }),
    prisma.order.aggregate({
      where: { customerId, status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _count: { id: true },
      _sum: { total: true },
    }),
  ]);

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...customer,
    ordersCount: ordersData._count.id,
    totalSpent: ordersData._sum.total ?? 0,
  });
}

// PUT /api/account/me — update name, email, phone
export async function PUT(req: NextRequest) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email, phone } = body;

  try {
    // check email uniqueness if changing
    if (email) {
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing && existing.id !== customerId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: { name, email, phone },
      select: { id: true, name: true, email: true, phone: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// PATCH /api/account/me — change password
export async function PATCH(req: NextRequest) {
  const customerId = await getCustomerId();
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both passwords required" }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer?.password) return NextResponse.json({ error: "No password set" }, { status: 400 });

  const valid = await bcrypt.compare(currentPassword, customer.password);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.customer.update({ where: { id: customerId }, data: { password: hashed } });
  return NextResponse.json({ success: true });
}

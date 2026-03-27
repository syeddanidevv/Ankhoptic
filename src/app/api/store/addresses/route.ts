import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

// GET /api/store/addresses — fetch saved addresses for logged-in customer
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const customerId = (session?.user as { id?: string })?.id;

    if (!customerId) {
      return NextResponse.json({ addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("GET /api/store/addresses error:", error);
    return NextResponse.json({ addresses: [] });
  }
}

// POST /api/store/addresses — save a new address for a customer
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const customerId = (session?.user as { id?: string })?.id;

    if (!customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, line1, city, province, isDefault } = body;

    if (!name || !phone || !line1 || !city || !province) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If this is set as default, unset other defaults first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        customerId,
        name,
        phone,
        line1,
        city,
        province: province || "Pakistan",
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("POST /api/store/addresses error:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}

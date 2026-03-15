import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/aftercare-addons
export async function GET() {
  try {
    const addons = await prisma.aftercareAddon.findMany({
      orderBy: { position: "asc" },
    });
    return NextResponse.json(addons);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch addons" }, { status: 500 });
  }
}

// POST /api/aftercare-addons
export async function POST(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { name, extraCharge, retailPrice, description } = await req.json();
    if (!name || extraCharge == null || retailPrice == null) {
      return NextResponse.json({ error: "name, extraCharge and retailPrice are required" }, { status: 400 });
    }
    const count = await prisma.aftercareAddon.count();
    const addon = await prisma.aftercareAddon.create({
      data: {
        name: name.trim(),
        extraCharge: parseFloat(extraCharge),
        retailPrice: parseFloat(retailPrice),
        description: description?.trim() || null,
        position: count,
      },
    });
    return NextResponse.json(addon, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create addon" }, { status: 500 });
  }
}

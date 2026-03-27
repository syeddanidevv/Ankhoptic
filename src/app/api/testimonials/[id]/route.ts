import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("GET Testimonial Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const data = await req.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...data,
        rating: data.rating ? Number(data.rating) : undefined
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("PUT Testimonial Error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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
    await prisma.testimonial.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("DELETE Testimonial Error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}

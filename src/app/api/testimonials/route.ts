import { NextRequest, NextResponse } from "next/server";
import { prisma }        from "@/lib/db";
import { requireAdmin }  from "@/lib/requireAdmin";

export async function GET() {
  // Storefront needs to fetch testimonials too, so we check if it's an admin request or public.
  // For simplicity since it's a small project, we can just allow public GET if needed, 
  // but usually admin/storefront use different endpoints.
  // Let's make this one public for storefront as well, or create a separate one.
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET Testimonials Error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const { rating, heading, text, authorName, authorMeta, image, productName, productLink } = data;

    if (!heading || !text || !authorName) {
      return NextResponse.json({ error: "Heading, text, and author name are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        rating: Number(rating) || 5,
        heading,
        text,
        authorName,
        authorMeta,
        image, // Base64 string
        productName,
        productLink,
        isActive: true
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("POST Testimonial Error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

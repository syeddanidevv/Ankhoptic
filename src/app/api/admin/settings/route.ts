import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteImage } from "@/lib/cloudinary";

// GET all store settings
export async function GET() {
  const adminRes = await requireAdmin();
  if (adminRes) return adminRes;

  try {
    const settings = await prisma.storeSetting.findMany();
    // Convert array of {key, value} into an object { [key]: value }
    const settingsMap = settings.reduce((acc, current) => {
      acc[current.key] = current.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST to update settings
// Expects body: { [key: string]: string }
export async function POST(request: Request) {
  const adminRes = await requireAdmin();
  if (adminRes) return adminRes;

  try {
    const body = await request.json();
    
    // Process each setting in the body
    for (const key of Object.keys(body)) {
      const value = String(body[key]);
      
      // If it's an image setting, check if we need to delete the old image
      if (key === "heroBanner" || key === "adBanner" || key === "adBanner2") {
        const existing = await prisma.storeSetting.findUnique({ where: { key } });
        if (existing && existing.value && existing.value !== value) {
          // It's being replaced with a new image, delete the old one
          await deleteImage(existing.value);
        }
      }

      await prisma.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

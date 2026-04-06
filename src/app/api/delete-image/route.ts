import { NextRequest, NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
    await deleteImage(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("delete-image error:", e);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

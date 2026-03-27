import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

/**
 * GET /api/admin/download-file?url=<cloudinary_url>&filename=<name>
 * Server-side proxy: fetches the file from Cloudinary and streams it back
 * to the browser as an attachment, bypassing CORS restrictions.
 */
export async function GET(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  const { searchParams } = new URL(req.url);
  const fileUrl  = searchParams.get("url");
  const filename = searchParams.get("filename") ?? "prescription.pdf";

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  // Only allow Cloudinary URLs for security
  if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const upstream = await fetch(fileUrl);
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":        contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length":      String(buffer.byteLength),
      },
    });
  } catch (err) {
    console.error("[download-file]", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

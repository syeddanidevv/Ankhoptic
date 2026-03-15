import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Papa from "papaparse";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Upload a File buffer to Cloudinary and return the secure URL */
async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ankhoptics-uploads" },
      (error, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error("Unknown upload error"));
      }
    );
    stream.end(buffer);
  });
}

interface BulkProductRow {
  title?: string;
  slug?: string;
  description?: string;
  price?: string;
  compareAtPrice?: string;
  color?: string;
  /** Lens disposability type (e.g. ONE_DAY, MONTHLY) */
  disposability?: string;
  stockCount?: string;
  status?: string;
  featured?: string;
  brandId?: string;
  categoryId?: string;
  /** Comma-separated filenames matching the uploaded image files */
  imageFilenames?: string;
  [key: string]: string | undefined;
}

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const formData = await req.formData();

    // ── CSV File ──────────────────────────────────────────────────────────
    const csvFile = formData.get("file") as File | null;
    if (!csvFile) {
      return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
    }

    const csvText = await csvFile.text();
    const parsed = Papa.parse<BulkProductRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: "CSV parse error", details: parsed.errors },
        { status: 400 }
      );
    }

    // ── Image Files map: filename → File ──────────────────────────────────
    const imageMap = new Map<string, File>();
    const rawImages = formData.getAll("images");
    for (const entry of rawImages) {
      if (entry instanceof File) {
        imageMap.set(entry.name, entry);
      }
    }

    // ── Process rows ──────────────────────────────────────────────────────
    let successCount = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const rowNum = i + 2; // spreadsheet row (1-indexed + header)

      try {
        // Validate required fields
        if (!row.title?.trim()) {
          errors.push({ row: rowNum, message: "Missing required field: title" });
          continue;
        }
        const priceNum = parseFloat(row.price ?? "");
        if (isNaN(priceNum)) {
          errors.push({ row: rowNum, message: "Invalid or missing price" });
          continue;
        }

        // Generate slug if not provided
        const slug =
          row.slug?.trim() ||
          row.title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
            "-" +
            Date.now();

        // ── Upload images for this row ─────────────────────────────────
        const imageUrls: string[] = [];
        const filenames = (row.imageFilenames ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

        for (const fname of filenames) {
          const imgFile = imageMap.get(fname);
          if (!imgFile) {
            errors.push({
              row: rowNum,
              message: `Image file not found: ${fname}. Make sure the filename exactly matches the uploaded file.`,
            });
            continue;
          }
          const buf = Buffer.from(await imgFile.arrayBuffer());
          const url = await uploadToCloudinary(buf);
          imageUrls.push(url);
        }

        // ── Insert product ─────────────────────────────────────────────
        await prisma.product.create({
          data: {
            title: row.title.trim(),
            slug,
            description: row.description?.trim() ?? null,
            price: priceNum,
            comparePrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : null,
            color: row.color?.trim() ?? null,
            disposability: row.disposability?.trim() || "ONE_DAY",
            inStock: true,
            stockCount: parseInt(row.stockCount ?? "0") || 0,
            images: imageUrls,
            status: (row.status?.trim() as "ACTIVE" | "DRAFT" | "ARCHIVED") ?? "DRAFT",
            featured: row.featured?.toLowerCase() === "true",
            brandId: row.brandId?.trim() || null,
            categoryId: row.categoryId?.trim() || null,
          },
        });

        successCount++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push({ row: rowNum, message: msg });
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: errors.length,
      errors,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 });
  }
}

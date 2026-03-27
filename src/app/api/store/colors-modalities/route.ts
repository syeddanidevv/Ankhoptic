import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: { in: ["lens_colors", "modality_options"] },
      },
    });

    let colors: string[] = [];
    let disposabilities: {label: string, value: string}[] = [];

    for (const setting of settings) {
      if (setting.key === "lens_colors") {
        try {
          colors = JSON.parse(setting.value);
        } catch {
          console.error("Failed to parse lens_colors setting");
        }
      }
      if (setting.key === "modality_options") {
        try {
          const parsed = JSON.parse(setting.value);
          if (Array.isArray(parsed)) {
            // modality_options contains objects like { label: "Yearly Disposable", value: "1_YEAR" }
            disposabilities = parsed.map((item: { label: string; value: string }) => ({ label: item.label, value: item.value }));
          }
        } catch {
          console.error("Failed to parse modality_options setting");
        }
      }
    }

    return NextResponse.json({
      colors,
      disposabilities,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[GET /api/store/colors-modalities] Error:", errorMsg);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

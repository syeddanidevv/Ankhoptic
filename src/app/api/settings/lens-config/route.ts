import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

const VALID_KEYS = ["lens_colors", "modality_options", "power_options"];

// Generate -0.25 to -10.00 and +0.25 to +10.00 in 0.25 steps
function defaultPowerOptions(): string[] {
  const opts: string[] = [];
  // Positive: +0.25 → +10.00
  for (let i = 0.25; i <= 10.00 + 0.001; i = Math.round((i + 0.25) * 100) / 100) {
    opts.push(`+${i.toFixed(2)}`);
  }
  // Plano (0)
  opts.push("0.00");
  // Negative: -0.25 → -10.00
  for (let i = 0.25; i <= 10.00 + 0.001; i = Math.round((i + 0.25) * 100) / 100) {
    opts.push(`-${i.toFixed(2)}`);
  }
  return opts;
}

async function getSetting(key: string) {
  const row = await prisma.storeSetting.findUnique({ where: { key } });
  if (!row) return key === "power_options" ? defaultPowerOptions() : [];
  const parsed = JSON.parse(row.value);
  if (key === "power_options" && (!Array.isArray(parsed) || parsed.length === 0)) {
    return defaultPowerOptions();
  }
  return parsed;
}

export async function GET() {
  try {
    const [lens_colors, modality_options, power_options] = await Promise.all([
      getSetting("lens_colors"),
      getSetting("modality_options"),
      getSetting("power_options"),
    ]);
    return NextResponse.json({ lens_colors, modality_options, power_options });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch lens config" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { key, value } = await req.json();
    if (!VALID_KEYS.includes(key)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }
    const updated = await prisma.storeSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    return NextResponse.json({ key: updated.key, value: JSON.parse(updated.value) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

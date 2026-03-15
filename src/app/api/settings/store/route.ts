import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

const DEFAULTS = {
  hero_slides: JSON.stringify([]),
  announcement_messages: JSON.stringify([
    "FREE SHIPPING AND RETURNS",
    "NEW SEASON, NEW STYLES: FASHION SALE YOU CAN'T MISS",
    "LIMITED TIME OFFER: FASHION SALE YOU CAN'T RESIST",
  ]),
  slider_settings: JSON.stringify({
    preview: 3,
    tablet: 1,
    mobile: 1,
    centered: false,
    space: 10,
    loop: true,
    autoPlay: true,
    delay: 2000,
    speed: 1000,
  }),
  store_logo: JSON.stringify("/store/images/logo/logo.jpg"),
};

export async function GET() {
  try {
    const keys = Object.keys(DEFAULTS);
    const rows = await prisma.storeSetting.findMany({ where: { key: { in: keys } } });

    const result: Record<string, unknown> = {};
    for (const key of keys) {
      const row = rows.find((r) => r.key === key);
      let parsedValue = DEFAULTS[key as keyof typeof DEFAULTS];
      
      if (row?.value) {
        try {
          // If the stored string itself is a JSON representation (like "[...]" or "{...}"), parse it
          parsedValue = JSON.parse(row.value);
        } catch {
          // If the parse fails, it means it's just a raw string, we can use it directly
          parsedValue = row.value;
        }
      } else {
         // Default values are stringified in DEFAULTS, so we must parse them
         parsedValue = JSON.parse(parsedValue as string);
      }
      
      result[key] = parsedValue;
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;
  try {
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

    await prisma.storeSetting.upsert({
      where:  { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}

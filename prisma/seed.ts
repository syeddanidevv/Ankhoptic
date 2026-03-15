import * as mysql from "mysql2/promise";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DATABASE_URL || "mysql://root:@localhost:3306/ankhoptics";

async function main() {
  const connection = await mysql.createConnection(DB_URL);
  console.log("✅ Connected to MySQL");

  // ── Admin User ──────────────────────────────────────────────
  const hashedPw = await bcrypt.hash("admin123", 10);
  const adminId = "admin_001";
  await connection.execute(
    `INSERT INTO admin_users (id, email, name, password, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 'OWNER', NOW(), NOW())
     ON DUPLICATE KEY UPDATE name=name`,
    [adminId, "admin@ankhoptics.com", "Ankhoptics Admin", hashedPw]
  );
  console.log("✅ Admin user ready: admin@ankhoptics.com / admin123");

  // ── Categories ──────────────────────────────────────────────
  const categories = [
    // [id, name, slug, parentId]
    ["cat_contact", "Contact Lenses", "contact-lenses", null],
    ["cat_daily", "Daily Lenses", "daily-lenses", "cat_contact"],
    ["cat_monthly", "Monthly Lenses", "monthly-lenses", "cat_contact"],
    ["cat_colored", "Colored Lenses", "colored-lenses", "cat_contact"],
    ["cat_prosthetic", "Prosthetic / IRIS Lenses", "prosthetic-iris-lenses", "cat_contact"],
    ["cat_color_blue", "Blue", "blue", "cat_colored"],
    ["cat_color_brown", "Brown", "brown", "cat_colored"],
    ["cat_color_golden", "Golden", "golden", "cat_colored"],
    ["cat_color_gray", "Gray", "gray", "cat_colored"],
    ["cat_color_green", "Green", "green", "cat_colored"],
    ["cat_color_hazel", "Hazel", "hazel", "cat_colored"],
    ["cat_color_purple", "Purple", "purple", "cat_colored"],
    ["cat_solutions", "Lens Solutions", "lens-solutions", null],
    ["cat_accessories", "Accessories", "accessories", null],
  ];

  for (const [id, name, slug, parentId] of categories) {
    await connection.execute(
      `INSERT INTO categories (id, name, slug, parentId, position, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 0, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name=name`,
      [id, name, slug, parentId]
    );
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // ── Brands ──────────────────────────────────────────────────
  const brands = [
    ["brand_bella", "Bella", "bella"],
    ["brand_comfort", "Comfort Lens", "comfort-lens"],
    ["brand_optiano", "Optiano", "optiano"],
    ["brand_usvision", "US Vision", "us-vision"],
    ["brand_freshlook", "FreshLook", "freshlook"],
    ["brand_magiceye", "Magic Eye", "magic-eye"],
    ["brand_drss", "Dress Your Eye", "dress-your-eye"],
    ["brand_joli", "Joli", "joli"],
    ["brand_freshkon", "Freshkon", "freshkon"],
    ["brand_venicol", "Venicol", "venicol"],
  ];

  for (const [id, name, slug] of brands) {
    await connection.execute(
      `INSERT INTO brands (id, name, slug)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name=name`,
      [id, name, slug]
    );
  }
  console.log(`✅ ${brands.length} brands seeded`);

  // ── Aftercare Addons ─────────────────────────────────────────
  const addons = [
    ["addon_none", "None", 0, 0, "No aftercare solution", 0],
    ["addon_starter", "Starter Kit", 280, 500, "Lens solution starter kit (500ml)", 1],
    ["addon_comfort", "Starter Kit + Comfort Drops", 400, 750, "Starter kit + comfort eye drops", 2],
  ];

  for (const [id, name, extraCharge, retailPrice, description, position] of addons) {
    await connection.execute(
      `INSERT INTO aftercare_addons (id, name, extraCharge, retailPrice, description, position, active)
       VALUES (?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name=name`,
      [id, name, extraCharge, retailPrice, description, position]
    );
  }
  console.log("✅ Aftercare add-ons seeded");

  // ── Sample Discounts ─────────────────────────────────────────
  const discounts = [
    ["disc_eid", "EID10", "Eid ul Adha Sale", "PERCENTAGE", 10, 0, null],
    ["disc_new", "WELCOME15", "Welcome New Customer", "PERCENTAGE", 15, 0, null],
    ["disc_flat", "FLAT200", "Flat Rs200 Off", "FIXED_AMOUNT", 200, 1000, null],
    ["disc_ship", "FREESHIP", "Free Shipping", "FREE_SHIPPING", 0, 500, null],
  ];

  for (const [id, code, title, type, value, minOrder, maxUsage] of discounts) {
    await connection.execute(
      `INSERT INTO discounts (id, code, title, type, value, minOrderAmount, maxUsage, usedCount, active, appliesToAll, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE code=code`,
      [id, code, title, type, value, minOrder, maxUsage]
    );
  }
  console.log("✅ Sample discount codes seeded");

  // ── Store Settings ───────────────────────────────────────────
  const settings: [string, string][] = [
    ["store_name", "Ankhoptics"],
    ["store_email", "info@ankhoptics.com"],
    ["store_phone", "03001234567"],
    ["store_address", "Lahore, Pakistan"],
    ["currency", "PKR"],
    ["shipping_flat_rate", "150"],
    ["shipping_free_above", "2000"],
    ["whatsapp_number", "923001234567"],
  ];

  for (const [key, value] of settings) {
    await connection.execute(
      `INSERT INTO store_settings (id, \`key\`, value)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE value=VALUES(value)`,
      [`setting_${key}`, key, value]
    );
  }
  console.log("✅ Store settings seeded");

  await connection.end();
  console.log("\n🚀 Ankhoptics database seeded successfully!");
  console.log("   Admin: admin@ankhoptics.com / admin123");
  console.log("   Discount codes: EID10, WELCOME15, FLAT200, FREESHIP");
}

main().catch(e => {
  console.error("❌ Seed error:", e.message);
  process.exit(1);
});

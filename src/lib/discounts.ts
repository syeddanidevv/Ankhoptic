import { prisma } from "@/lib/db";

// Fetch all active discounts that visually apply to products (brand/category/all scoped).
// We include non-automatic (coupon) discounts too so they show as badges on the storefront.
export async function getActiveAutomaticDiscounts() {
  const now = new Date();
  return prisma.discount.findMany({
    where: {
      active: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    include: {
      brands: { select: { id: true } },
      categories: { select: { id: true } },
      products: { select: { id: true } },
    },
  });
}

// Apply discounts to a product
export function applyDiscountToProduct(
  product: {
    id: string;
    price: number;
    comparePrice?: number | null;
    discountPercent?: number | null;
    brand?: { id: string; name: string; slug: string } | null;
    category?: { id: string; name: string; slug: string } | null;
    [key: string]: unknown;
  },
  activeDiscounts: {
    title: string;
    type: string;
    value: number;
    appliesToAll: boolean;
    products?: { id: string }[];
    brands?: { id: string }[];
    categories?: { id: string }[];
  }[]
) {
  let bestDiscountAmount = 0;
  let bestDiscountTitle = "Sale";

  // Determine the base "original" price. 
  const originalPrice = product.comparePrice && product.comparePrice > product.price 
    ? product.comparePrice 
    : product.price;

  for (const disc of activeDiscounts) {
    const hits =
      disc.appliesToAll ||
      (disc.products && disc.products.some((dp) => dp.id === product.id)) ||
      (product.brand && disc.brands && disc.brands.some((db) => db.id === product.brand?.id)) ||
      (product.category && disc.categories && disc.categories.some((dc) => dc.id === product.category?.id));

    if (hits) {
      let discountAmt = 0;
      if (disc.type === "PERCENTAGE") {
        discountAmt = originalPrice * (disc.value / 100);
      } else if (disc.type === "FIXED_AMOUNT") {
        discountAmt = disc.value;
      }

      if (discountAmt > bestDiscountAmount) {
        bestDiscountAmount = discountAmt;
        bestDiscountTitle = disc.title;
      }
    }
  }

  let adminSetDiscountAmt = 0;
  if (product.comparePrice && product.comparePrice > product.price) {
    adminSetDiscountAmt = product.comparePrice - product.price;
  } else if (product.discountPercent && product.discountPercent > 0) {
    adminSetDiscountAmt = product.price * (product.discountPercent / 100);
  }

  const finalDiscountAmount = Math.max(bestDiscountAmount, adminSetDiscountAmt);
  const finalDiscountTitle = bestDiscountAmount >= adminSetDiscountAmt && bestDiscountAmount > 0 
    ? bestDiscountTitle 
    : "Sale";

  if (finalDiscountAmount > 0) {
    const newPrice = Math.max(0, originalPrice - finalDiscountAmount);
    
    return {
      ...product,
      price: newPrice,
      comparePrice: originalPrice > newPrice ? originalPrice : null,
      discountTitle: finalDiscountTitle,
      brand: product.brand ? { name: product.brand.name, slug: product.brand.slug } : null,
      category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
    };
  }

  return {
    ...product,
    brand: product.brand ? { name: product.brand.name, slug: product.brand.slug } : null,
    category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
  };
}

import ProductPage from "@/components/store/ProductPage";

export const metadata = {
  title: "Product details — Ankhoptics",
  description: "View product details and add to cart.",
};

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}

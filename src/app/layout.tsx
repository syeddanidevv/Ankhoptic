import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
// Base styling including theme fonts (Jost, custom icons)
import "../../public/store/fonts/fonts.css";
import { Toaster } from "react-hot-toast";
import MetaPixel from "@/components/MetaPixel";
import { prisma } from "@/lib/db";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Ankhoptics - Premium Eye Lenses",
  description:
    "Shop premium contact lenses and eyewear. Free delivery on orders above PKR 1500.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let pixelSetting = null;
  try {
    pixelSetting = await prisma.storeSetting.findUnique({
      where: { key: "META_PIXEL_ID" },
    });
  } catch {
    // DB may be unavailable — app still loads, pixel just won't fire
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextTopLoader
          color="#ffffff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
          zIndex={1600000000}
        />
        <MetaPixel pixelId={pixelSetting?.value} />
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

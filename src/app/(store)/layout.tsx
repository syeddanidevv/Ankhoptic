import type { Metadata } from "next";

import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import AnnouncementBar from "@/components/store/AnnouncementBar";
import ToolbarBottom from "@/components/store/ToolbarBottom";
import CanvasSearch from "@/components/store/CanvasSearch";
import Cart from "@/components/store/modals/CartModal";
import Login from "@/components/store/modals/Login";
import StoreProvider from "@/components/store/StoreProvider";
import QuickAdd from "@/components/store/modals/QuickAdd";
import WhatsAppFloat from "@/components/store/WhatsAppFloat";
import TemplateScripts from "@/components/TemplateScripts";

export const metadata: Metadata = {
  title: "Ankhoptics — Premium Contact Lenses Pakistan",
  description:
    "Pakistan's #1 contact lens store. Shop daily, monthly & colored lenses from top brands.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      {/* ── Bootstrap Template CSS ── */}
      {/* eslint-disable @next/next/no-css-tags */}
      <link rel="stylesheet" href="/store/fonts/fonts.css" />
      <link rel="stylesheet" href="/store/fonts/font-icons.css" />
      <link rel="stylesheet" href="/store/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/store/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="/store/css/animate.css" />
      <link rel="stylesheet" href="/store/css/magnific-popup.min.css" />
      <link rel="stylesheet" href="/store/css/styles.css" />
      {/* eslint-enable @next/next/no-css-tags */}
      <AnnouncementBar />
      <Header />

      {children}

      <Cart />
      <Login />
      <QuickAdd />
      <CanvasSearch />
      <ToolbarBottom />
      <WhatsAppFloat />
      <Footer />
      {/* ── Bootstrap Template JS (Loaded safely via Client Component) ── */}
      <TemplateScripts />
    </StoreProvider>
  );
}

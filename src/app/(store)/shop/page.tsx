"use client";
import { Suspense } from "react";
import Products from "@/components/store/Products";

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading…</div>}>
      <Products />
    </Suspense>
  );
}

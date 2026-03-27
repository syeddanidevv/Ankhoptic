import { Suspense } from "react";
import OrderConfirmation from "@/components/store/OrderConfirmation";

export const metadata = {
  title: "Order Confirmed — Ankhoptics",
  description: "Your order has been placed successfully. Thank you for shopping with Ankhoptics!",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Order Confirmed</div>
        </div>
      </div>
    }>
      <OrderConfirmation />
    </Suspense>
  );
}

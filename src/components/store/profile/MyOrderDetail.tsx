"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountSidebar from "./AccountSidebar";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: "#fff3cd", text: "#856404" },
  CONFIRMED:  { bg: "#cfe2ff", text: "#0a58ca" },
  PROCESSING: { bg: "#d1ecf1", text: "#0c5460" },
  SHIPPED:    { bg: "#d6e4f7", text: "#1a68c4" },
  DELIVERED:  { bg: "#d4edda", text: "#155724" },
  COMPLETED:  { bg: "#c3e6cb", text: "#0b4e25" },
  CANCELLED:  { bg: "#f8d7da", text: "#721c24" },
  REFUNDED:   { bg: "#e2d9f3", text: "#432874" },
  UNPAID:         { bg: "#f8d7da", text: "#721c24" },
  PAID:           { bg: "#c3e6cb", text: "#0b4e25" },
  COD_PENDING:    { bg: "#fff3cd", text: "#856404" },
  PARTIALLY_PAID: { bg: "#fde8cb", text: "#7a4100" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "#f0f0f0", text: "#555" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "4px 14px", borderRadius: 20,
      fontSize: 12, fontWeight: 700,
      display: "inline-block", letterSpacing: "0.3px",
    }}>
      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")}
    </span>
  );
}

interface OrderItem {
  id: string;
  productTitle: string;
  productImage?: string;
  qty: number;
  unitPrice: number;
  total: number;
  lensType: string;
  leftEyePower?: string;
  rightEyePower?: string;
  aftercareName?: string;
  aftercarePrice: number;
}

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  discountCode?: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    province: string;
  };
}

export default function MyOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/account/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
        setLoading(false);
      });
  }, [orderId]);

  if (loading)
    return (
      <div className="container text-center" style={{ padding: "60px 0", color: "#aaa" }}>
        Loading…
      </div>
    );
  if (error || !order)
    return (
      <div
        className="container"
        style={{ padding: "60px 0", textAlign: "center" }}
      >
        <p>Order not found.</p>
        <Link
          href="/account/orders"
          className="tf-btn btn-fill animate-hover-btn mt_20"
        >
          <span>Back to Orders</span>
        </Link>
      </div>
    );

  const firstImage = order.items[0]?.productImage;

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Order #{1000 + order.orderNumber}</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <AccountSidebar />
            </div>
            <div className="col-lg-9">
              <div className="wd-form-order">
                {/* Header */}
                <div className="order-head">
                  {firstImage && (
                    <figure className="img-product">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={firstImage}
                        alt="product"
                        style={{
                          objectFit: "cover",
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                        }}
                      />
                    </figure>
                  )}
                  <div className="content">
                    <StatusBadge status={order.status} />
                    <h6 className="mt-8 fw-5">Order #{1000 + order.orderNumber}</h6>
                    <div className="text-2" style={{ color: "#aaa" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-PK")}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt_20 mb_20">
                  <h6 className="mb_15">Items</h6>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center gap-15 mb_15"
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        paddingBottom: 12,
                      }}
                    >
                      {item.productImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div className="fw-6">{item.productTitle}</div>
                        <div className="text-2" style={{ color: "#888" }}>
                          {item.lensType === "EYESIGHT" && (
                            <span>
                              L: {item.leftEyePower} / R: {item.rightEyePower}{" "}
                              ·{" "}
                            </span>
                          )}
                          Qty: {item.qty}
                        </div>
                      </div>
                      <div className="fw-6">
                        Rs{Number(item.total).toLocaleString("en-PK")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <ul
                  className="mb_20"
                  style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12 }}
                >
                  <li className="d-flex justify-content-between text-2 mb_8">
                    <span>Subtotal</span>
                    <span>
                      Rs{Number(order.subtotal).toLocaleString("en-PK")}
                    </span>
                  </li>
                  {order.shippingCost > 0 && (
                    <li className="d-flex justify-content-between text-2 mb_8">
                      <span>Shipping</span>
                      <span>
                        Rs{Number(order.shippingCost).toLocaleString("en-PK")}
                      </span>
                    </li>
                  )}
                  {order.discountAmount > 0 && (
                    <li
                      className="d-flex justify-content-between text-2 mb_8"
                      style={{ color: "#38a169" }}
                    >
                      <span>
                        Discount{" "}
                        {order.discountCode ? `(${order.discountCode})` : ""}
                      </span>
                      <span>
                        −Rs
                        {Number(order.discountAmount).toLocaleString("en-PK")}
                      </span>
                    </li>
                  )}
                  <li
                    className="d-flex justify-content-between fw-7 mt_8"
                    style={{ borderTop: "2px solid #222", paddingTop: 8 }}
                  >
                    <span>Total</span>
                    <span>Rs{Number(order.total).toLocaleString("en-PK")}</span>
                  </li>
                </ul>

                {/* Shipping Address */}
                <div
                  style={{
                    background: "#f8f8f8",
                    borderRadius: 8,
                    padding: "16px 20px",
                  }}
                >
                  <h6 className="mb_10">Shipping To</h6>
                  <p className="text-2">{order.shippingAddress?.name}</p>
                  <p className="text-2">{order.shippingAddress?.line1}</p>
                  <p className="text-2">
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.province}
                  </p>
                  <p className="text-2">{order.shippingAddress?.phone}</p>
                </div>

                <div className="mt_20">
                  <Link
                    href="/account/orders"
                    className="tf-btn btn-fill animate-hover-btn"
                  >
                    <span>← Back to Orders</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

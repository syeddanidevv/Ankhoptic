"use client";

import { useEffect } from "react";
import Link from "next/link";
import AccountSidebar from "./AccountSidebar";
import { useAccountStore } from "@/store/accountStore";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: "#fff3cd", text: "#856404" },
  CONFIRMED:  { bg: "#cfe2ff", text: "#0a58ca" },
  PROCESSING: { bg: "#d1ecf1", text: "#0c5460" },
  SHIPPED:    { bg: "#d6e4f7", text: "#1a68c4" },
  DELIVERED:  { bg: "#d4edda", text: "#155724" },
  COMPLETED:  { bg: "#c3e6cb", text: "#0b4e25" },
  CANCELLED:  { bg: "#f8d7da", text: "#721c24" },
  REFUNDED:   { bg: "#e2d9f3", text: "#432874" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "#f0f0f0", text: "#555" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "3px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      display: "inline-block",
    }}>
      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")}
    </span>
  );
}

export default function MyOrder() {
  const { orders, ordersLoading, fetchOrders } = useAccountStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Orders</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"><AccountSidebar /></div>
            <div className="col-lg-9">
              <div className="my-account-content account-order">
                {ordersLoading ? (
                  <p className="text-center py-4" style={{ color: "#aaa" }}>Loading orders…</p>
                ) : orders.length === 0 ? (
                  <div className="text-center" style={{ padding: "40px 0" }}>
                    <i className="icon-bag" style={{ fontSize: 48, color: "#aaa" }} />
                    <p className="mt_20">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="tf-btn btn-fill animate-hover-btn mt_20">
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                ) : (
                  <div className="wrap-account-order">
                    <table>
                      <thead>
                        <tr>
                          <th className="fw-6">Order</th>
                          <th className="fw-6">Date</th>
                          <th className="fw-6">Status</th>
                          <th className="fw-6">Total</th>
                          <th className="fw-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} className="tf-order-item">
                            {/* Order # with product image + title */}
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {o.firstImage && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={o.firstImage}
                                    alt={o.firstItemTitle ?? "product"}
                                    style={{
                                      width: 44, height: 44,
                                      objectFit: "cover",
                                      borderRadius: 6,
                                      border: "1px solid #f0f0f0",
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                                    #{1000 + o.orderNumber}
                                  </div>
                                  {o.items.length > 0 && (
                                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                                      {o.items.slice(0, 2).map((item, i) => (
                                        <div key={i}>{item.productTitle} × {item.qty}</div>
                                      ))}
                                      {o.items.length > 2 && (
                                        <div>+{o.items.length - 2} more</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{new Date(o.createdAt).toLocaleDateString("en-PK")}</td>
                            <td><StatusBadge status={o.status} /></td>
                            <td>
                              Rs{Number(o.total).toLocaleString("en-PK")}
                              <span style={{ fontSize: 11, color: "#888", display: "block" }}>
                                {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td>
                              <Link href={`/account/orders/${o.id}`} className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center">
                                <span>View</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

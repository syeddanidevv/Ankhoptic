"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: string;
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
  lensType: string;
  rightEyePower: string | null;
  aftercareName: string | null;
  aftercarePrice: number;
  product?: { images: string[] } | null;
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    name?: string;
    phone?: string;
    address: string;
    city: string;
    province: string;
  };
  items: OrderItem[];
  createdAt: string;
};

/* ─── Premium Card ─── */
function PremiumCard({ icon, label, badge, accent = true, children }: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e9ecef",
      borderRadius: 16,
      overflow: "hidden",
      height: "100%",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      {/* Green accent top strip */}
      {accent && (
        <div style={{ height: 3, background: "linear-gradient(90deg,#10b981,#059669)" }} />
      )}
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex", alignItems: "center", gap: 10,
        background: "#fafafa",
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111", flex: 1, letterSpacing: "-0.1px" }}>
          {label}
        </span>
        {badge && (
          <span style={{
            background: "#f0fdf4", color: "#059669",
            fontSize: "0.75rem", fontWeight: 700,
            padding: "2px 10px", borderRadius: 20,
            border: "1px solid #bbf7d0",
          }}>{badge}</span>
        )}
      </div>
      <div style={{ padding: "20px 20px" }}>{children}</div>
    </div>
  );
}

function GreenSvg({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function TotalRow({ label, value, green, red, bold }: {
  label: string; value: string; green?: boolean; red?: boolean; bold?: boolean;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: bold ? "10px 14px" : "7px 0",
      background: bold ? "linear-gradient(135deg,#f0fdf4,#ecfdf5)" : "transparent",
      borderRadius: bold ? 10 : 0,
      marginTop: bold ? 10 : 0,
    }}>
      <span style={{ color: bold ? "#065f46" : "#6b7280", fontSize: "0.875rem", fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600, fontSize: bold ? "1.05rem" : "0.875rem", color: red ? "#ef4444" : green ? "#10b981" : "#111" }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Info row for address/payment ─── */
function InfoLine({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1, opacity: 0.7 }}>{icon}</span>
      <span style={{ color: "#374151", fontSize: "0.875rem", lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

/* ─── Page shell ─── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Order Confirmed</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">{children}</div>
      </section>
      <style>{`
        @keyframes successPop {
          from { opacity:0; transform:scale(0.4) rotate(-10deg); }
          to   { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes ringPulse {
          0%   { transform:scale(0.8); opacity:0; }
          50%  { opacity:0.3; }
          100% { transform:scale(1.6); opacity:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .oc-0 { animation: fadeUp 0.45s ease both; }
        .oc-1 { animation: fadeUp 0.45s 0.1s ease both; }
        .oc-2 { animation: fadeUp 0.45s 0.2s ease both; }
        .oc-3 { animation: fadeUp 0.45s 0.3s ease both; }
        .oc-ring {
          position:absolute; inset:-12px; border-radius:50%;
          border:2px solid rgba(16,185,129,0.3);
          animation:ringPulse 1.6s 0.5s ease-out infinite;
        }
      `}</style>
    </>
  );
}

export default function OrderConfirmation() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/store/orders/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setOrder(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return (
    <Shell>
      <div className="text-center py-5">
        <div style={{ fontSize: 56, marginBottom: 12 }}>😢</div>
        <h5 className="fw-5 mb-3">No order ID provided.</h5>
        <Link href="/" className="tf-btn radius-3 btn-fill animate-hover-btn">Go home</Link>
      </div>
    </Shell>
  );

  if (loading) return (
    <Shell>
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>Loading your order…</p>
      </div>
    </Shell>
  );

  if (error || !order) return (
    <Shell>
      <div className="text-center py-5">
        <div style={{ fontSize: 56, marginBottom: 12 }}>😢</div>
        <h5 className="fw-5 mb-3">{error || "Order not found"}</h5>
        <Link href="/" className="tf-btn radius-3 btn-fill animate-hover-btn">Go home</Link>
      </div>
    </Shell>
  );

  const addr = order.shippingAddress;
  const orderNum = `#${1000 + order.orderNumber}`;
  const payLabel = order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod.replace(/_/g, " ");
  const isCOD = order.paymentMethod === "COD";

  return (
    <Shell>

      {/* ── Hero Banner ── */}
      <div className="oc-0" style={{
        background: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#047857 100%)",
        borderRadius: 20,
        padding: "44px 24px 40px",
        textAlign: "center",
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle dot pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        {/* Check icon with pulse ring */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 22 }}>
          <div className="oc-ring" />
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "successPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
            position: "relative",
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h2 style={{
          fontSize: "clamp(1.3rem,3.5vw,1.85rem)", fontWeight: 800,
          color: "white", letterSpacing: "-0.5px", marginBottom: 10, position: "relative",
        }}>
          Thank you! Your order is confirmed 🎉
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", marginBottom: 24, lineHeight: 1.65, position: "relative" }}>
          We received your order and will contact you shortly to confirm delivery.
        </p>

        {/* Order number badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.12)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          borderRadius: 40, padding: "10px 28px",
          position: "relative",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
            Order
          </span>
          <span style={{ fontWeight: 900, fontSize: "1.15rem", color: "white", letterSpacing: "-0.3px" }}>
            {orderNum}
          </span>
        </div>
      </div>

      {/* ── 2-column layout ── */}
      <div className="row g-4">

        {/* LEFT — items + totals */}
        <div className="col-lg-7 oc-1">
          <PremiumCard
            icon={<GreenSvg d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" />}
            label="Order summary"
            badge={`${order.items.length} item${order.items.length !== 1 ? "s" : ""}`}
          >
            {/* Items */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {order.items.map((item, i) => (
                <li key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "13px 0",
                  borderBottom: i < order.items.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: 60, height: 60, borderRadius: 12, flexShrink: 0,
                    overflow: "hidden", border: "1.5px solid #e9ecef",
                    background: "#f8f9fa", position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    {item.product?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0]} alt={item.productTitle}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : <span style={{ fontSize: 26 }}>👁️</span>}
                    {/* Qty badge */}
                    <span style={{
                      position: "absolute", top: -6, right: -6,
                      background: "#111", color: "#fff",
                      fontSize: 10, fontWeight: 800,
                      width: 20, height: 20, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid white",
                    }}>{item.qty}</span>
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "#111",
                      lineHeight: 1.4, marginBottom: 4,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{item.productTitle}</p>
                    <span style={{
                      fontSize: "0.78rem", color: "#9ca3af",
                      lineHeight: 1.5, display: "block",
                    }}>
                      {item.lensType === "PLAIN" ? "Plain lenses" : `Eyesight lenses${item.rightEyePower ? ` (${item.rightEyePower})` : ""}`}
                      {item.aftercareName && item.aftercareName !== "No aftercare" && ` · ${item.aftercareName}`}
                    </span>
                  </div>
                  {/* Price */}
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111", flexShrink: 0 }}>
                    Rs. {item.total.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div style={{ marginTop: 16, padding: "14px 0 0" }}>
              <TotalRow label="Subtotal" value={`Rs. ${order.subtotal.toLocaleString()}`} />
              {order.discountAmount > 0 && (
                <TotalRow label="Discount" value={`− Rs. ${order.discountAmount.toLocaleString()}`} red />
              )}
              <TotalRow
                label="Shipping"
                value={order.shippingCost === 0 ? "Free ✓" : `Rs. ${order.shippingCost.toLocaleString()}`}
                green={order.shippingCost === 0}
              />
              <TotalRow label="Total" value={`Rs. ${order.total.toLocaleString()}`} bold green />
            </div>
          </PremiumCard>
        </div>

        {/* RIGHT — delivery, payment, next steps */}
        <div className="col-lg-5 oc-2">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Delivery */}
            <PremiumCard icon={<GreenSvg d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6" />} label="Delivery address">
              {addr.name && (
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.925rem", color: "#111", marginBottom: 12 }}>
                  {addr.name}
                </p>
              )}
              <InfoLine icon="📍">{addr.address}, {addr.city}, {addr.province}</InfoLine>
              {addr.phone && <InfoLine icon="📞">{addr.phone}</InfoLine>}
            </PremiumCard>

            {/* Payment */}
            <PremiumCard icon={<GreenSvg d="M1 4h22v16H1z M1 10h22" />} label="Payment">
              {/* Method badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: isCOD ? "linear-gradient(135deg,#fffbeb,#fef9c3)" : "linear-gradient(135deg,#eff6ff,#dbeafe)",
                border: `1.5px solid ${isCOD ? "#fde68a" : "#bfdbfe"}`,
                borderRadius: 10, padding: "6px 14px", marginBottom: 12,
              }}>
                <span style={{ fontSize: 14 }}>{isCOD ? "💵" : "💳"}</span>
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: isCOD ? "#92400e" : "#1d4ed8" }}>
                  {payLabel}
                </span>
              </div>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.7 }}>
                {isCOD
                  ? "You'll pay when your order is delivered. Please keep the exact amount ready."
                  : "Your payment has been received and confirmed. Thank you!"}
              </p>
            </PremiumCard>

            {/* What's next */}
            <div style={{
              borderRadius: 14,
              border: "1px solid #e9ecef",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#10b981,#059669)" }} />
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>📦</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#065f46", fontSize: "0.875rem", marginBottom: 4 }}>
                    What happens next?
                  </p>
                  <p style={{ margin: 0, color: "#374151", fontSize: "0.84rem", lineHeight: 1.7 }}>
                    Our team will call or WhatsApp you within{" "}
                    <strong style={{ color: "#065f46" }}>24 hours</strong> to confirm your order and estimated delivery time.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── CTA buttons ── */}
      <div className="oc-3 d-flex gap-3 flex-wrap justify-content-center mt-5 mb-2">
        <Link href="/" className="tf-btn radius-3 btn-outline animate-hover-btn" style={{ minWidth: 190, textAlign: "center" }}>
          ← Continue Shopping
        </Link>
        <Link href="/my-account/orders" className="tf-btn radius-3 btn-fill animate-hover-btn" style={{ minWidth: 190, textAlign: "center" }}>
          View My Orders
        </Link>
      </div>

    </Shell>
  );
}

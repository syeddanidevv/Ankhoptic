"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    <div className="container-full">
      <div className="text-center py-5">
        <h5 className="fw-5 mb-3">No order ID provided.</h5>
        <Link href="/" className="tf-btn radius-3 btn-fill animate-hover-btn">Go Shopping</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="container-full">
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading your order details…</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="container-full">
      <div className="text-center py-5">
        <h5 className="fw-5 mb-3">{error || "Order not found"}</h5>
        <Link href="/" className="tf-btn radius-3 btn-fill animate-hover-btn">Go Shopping</Link>
      </div>
    </div>
  );

  const orderNum = `#${1000 + order.orderNumber}`;
  const payLabel = order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod.replace(/_/g, " ");

  let addr: any = {};
  if (order.shippingAddress) {
    try {
      addr = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
    } catch {
      addr = {};
    }
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Order Confirmation</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row justify-content-center">
            
            <div className="col-lg-8">
              
              <div className="text-center mb-5">
                <div style={{ width: 80, height: 80, margin: '0 auto 20px', borderRadius: '50%', background: '#020042', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="mb-2" style={{ color: '#020042', fontWeight: 600 }}>Thank you for your order!</h3>
                <p className="text-muted">Your order {orderNum} has been placed successfully.</p>
              </div>

              <div className="widget-card-store bg_f3f5f5 p-4 radius-10 mb-4" style={{ borderLeft: '4px solid #020042' }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="mb-3" style={{ color: '#020042', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, fontWeight: 700 }}>Contact & Delivery</h6>
                    <ul className="list-unstyled mb-0" style={{ fontSize: 14, color: '#555' }}>
                      {addr.name && <li className="mb-1"><strong className="text-black">{addr.name}</strong></li>}
                      <li className="mb-1">{addr.address}</li>
                      <li className="mb-1">{addr.city}, {addr.province}</li>
                      {addr.phone && <li className="mb-1">{addr.phone}</li>}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3" style={{ color: '#020042', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, fontWeight: 700 }}>Payment Method</h6>
                    <p style={{ fontSize: 14, color: '#555' }}>{payLabel}</p>
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>
                      Our team will contact you shortly to confirm delivery.
                    </p>
                  </div>
                </div>
              </div>

              <h6 className="mb-3" style={{ color: '#020042', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13, fontWeight: 700 }}>Order Summary</h6>
              <div className="table-responsive mb-4 border-1 radius-10 overflow-hidden" style={{ border: '1px solid #ebebeb' }}>
                <table className="table mb-0 align-middle">
                  <tbody>
                    {order.items.map((item, i) => {
                      let parsedImages: string[] = [];
                      if (item.product?.images) {
                        try {
                          parsedImages = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images;
                        } catch(e) {}
                      }
                      const firstImg = parsedImages[0];
                      const img = firstImg ? (firstImg.startsWith('http') || firstImg.startsWith('/') ? firstImg : `/${firstImg}`) : null;
                      
                      return (
                        <tr key={item.id} style={{ borderBottom: i === order.items.length - 1 ? 'none' : '1px solid #ebebeb' }}>
                          <td style={{ width: 80, padding: 15 }}>
                            <div className="bg_light radius-5 d-flex align-items-center justify-content-center overflow-hidden" style={{ width: 60, height: 60 }}>
                              {img ? (
                                <img src={img} alt={item.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : <span style={{ fontSize: 20 }}>👁️</span>}
                            </div>
                          </td>
                          <td style={{ padding: 15 }}>
                            <h6 className="mb-1 fw-6">{item.productTitle}</h6>
                            <div className="text-muted" style={{ fontSize: 12 }}>
                              {item.lensType === "PLAIN" ? "Plain lenses" : `Eyesight lenses${item.rightEyePower ? ` (${item.rightEyePower})` : ""}`}
                              {item.aftercareName && item.aftercareName !== "No aftercare" && ` · ${item.aftercareName}`}
                            </div>
                            <div className="text-muted mt-1" style={{ fontSize: 12 }}>Qty: {item.qty}</div>
                          </td>
                          <td className="text-end fw-6" style={{ padding: 15 }}>
                            Rs. {item.total.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg_f3f5f5 p-4 radius-10 mb-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-6 text-black">Rs. {order.subtotal.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Discount</span>
                    <span className="fw-6 text-success">− Rs. {order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-6 text-black">{order.shippingCost === 0 ? "Free" : `Rs. ${order.shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-7 text-black" style={{ fontSize: 18 }}>Total</span>
                  <span className="fw-7 text-black" style={{ fontSize: 18, color: '#020042' }}>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center">
                <Link href="/" className="tf-btn btn-fill animate-hover-btn radius-3 mb-3" style={{ background: '#020042', borderColor: '#020042', color: 'white' }}>
                  Return to Home
                </Link>
             </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}

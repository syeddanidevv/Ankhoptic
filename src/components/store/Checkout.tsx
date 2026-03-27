"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { usePrescriptionStore } from "@/store/prescriptionStore";
import { useStoreSettings } from "@/components/store/StoreProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/checkoutStore";

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCartStore();
  const { free_shipping_threshold, sadapay_details, easypaisa_details, advance_note } = useStoreSettings();
  const formData = useCheckoutStore();
  const { errors, validate } = formData;
  const FREE_SHIPPING_THRESHOLD = free_shipping_threshold;

  // Prevent redirect to cart after successful order submission
  const submittedRef = useRef(false);

  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to cart if empty (but not right after submitting)
  useEffect(() => {
    if (items.length === 0 && !submittedRef.current) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const sub = subtotal();
  // Apply 200 shipping ONLY if a free shipping threshold is > 0 AND the subtotal is less than that threshold. Otherwise, shipping is 0 (Free).
  const shippingCost = FREE_SHIPPING_THRESHOLD > 0 && sub < FREE_SHIPPING_THRESHOLD ? 200 : 0;
  const total = sub + shippingCost;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const { files: prescriptionFiles, clearFiles } = usePrescriptionStore();
  // We'll keep a local map for the final URLs just in case 
  const [prescriptionUrls, setPrescriptionUrls] = useState<Record<string, string>>({});
  // Upload status during checkout process
  const [isUploadingPrescriptions, setIsUploadingPrescriptions] = useState(false);

  // Saved addresses
  type SavedAddress = {
    id: string; name: string; phone: string;
    line1: string; city: string; province: string; isDefault: boolean;
  };
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  const customerId = session?.user ? (session.user as { id?: string }).id : null;

  useEffect(() => {
    if (!customerId) return;
    fetch("/api/store/addresses")
      .then(r => r.json())
      .then(d => setSavedAddresses(d.addresses || []))
      .catch(() => {});
  }, [customerId]);

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const addr = savedAddresses.find(a => a.id === id);
    if (!addr) return;
    const [firstName, ...lastParts] = addr.name.split(" ");
    formData.updateField("firstName", firstName || "");
    formData.updateField("lastName", lastParts.join(" "));
    formData.updateField("phone", addr.phone);
    formData.updateField("address", addr.line1);
    formData.updateField("city", addr.city);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    formData.updateField(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setLoading(true);
    setError("");

    // Validate required fields
    if (!validate()) {
      setLoading(false);
      return;
    }

    // Validate terms & conditions last
    if (!agreedToTerms) {
      setTermsError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }
    setTermsError("");
    
    try {
      setIsUploadingPrescriptions(true);
      // 1. Upload prescriptions
      const finalUrls: Record<string, string> = { ...prescriptionUrls };
      const eyesightItems = items.filter(i => i.lensType === "EYESIGHT");
      
      for (const item of eyesightItems) {
        const file = prescriptionFiles[item.id];
        // Only upload if it exists in store and we haven't already got a URL
        if (file && !finalUrls[item.id]) {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/store/upload-prescription", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(`Prescription upload failed: ${data.error}`);
          finalUrls[item.id] = data.url;
        }
      }
      setIsUploadingPrescriptions(false);

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.country,
        postalCode: formData.postalCode,
        notes: formData.note,
        paymentMethod: paymentMethod,
        customerId: session?.user ? (session.user as { id?: string }).id : null,
        items: items.map(it => ({
          slug: it.slug,
          title: `[${it.brand}] ${it.title} - ${it.color}`,
          lensType: it.lensType,
          power: it.power,
          addonName: it.addonName,
          addonPrice: it.addonPrice,
          unitPrice: it.unitPrice,
          qty: it.qty,
          prescriptionUrl: finalUrls[it.id] ?? null,
        }))
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const data = await res.json();

      // Save address to DB if customer is logged in
      if (customerId) {
        const isFirst = savedAddresses.length === 0;
        await fetch("/api/store/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            line1: formData.address,
            city: formData.city,
            province: "Pakistan",
            isDefault: isFirst,
          }),
        }).catch(() => {});
      }

      formData.resetForm();
      submittedRef.current = true; // prevent empty-cart redirect
      clearCart();
      clearFiles();
      router.push(`/order-confirmation?id=${data.id}`);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsUploadingPrescriptions(false);
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Check Out</div>
        </div>
      </div>

      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-page-cart-wrap layout-2">
            
            <div className="tf-page-cart-item">
              <h5 className="fw-5 mb_20">Billing details</h5>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form className="form-checkout" onSubmit={handleSubmit} id="checkout-form">
                
                {/* Saved Addresses Dropdown – only shown when logged-in and has saved addresses */}
                {savedAddresses.length > 0 && (
                  <fieldset className="box fieldset" style={{ marginBottom: 16 }}>
                    <label htmlFor="savedAddresses">Saved addresses</label>
                    <div className="select-custom">
                      <select
                        className="tf-select w-100"
                        id="savedAddresses"
                        defaultValue=""
                        onChange={handleAddressSelect}
                      >
                        <option value="" disabled>Select a saved address…</option>
                        {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.name} — {addr.line1}, {addr.city}{addr.isDefault ? " (Default)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </fieldset>
                )}

                {/* Country fixed to Pakistan - hidden */}
                <input type="hidden" id="country" value="Pakistan" />

                <div className="box grid-2">
                  <fieldset className="fieldset">
                    <label htmlFor="firstName">First name</label>
                    <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.firstName}</span>}
                  </fieldset>
                  <fieldset className="fieldset">
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.lastName}</span>}
                  </fieldset>
                </div>

                <fieldset className="box fieldset">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" value={formData.address} onChange={handleChange} />
                  {errors.address && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</span>}
                </fieldset>

                <div className="box grid-2">
                  <fieldset className="fieldset">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" value={formData.city} onChange={handleChange} />
                    {errors.city && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.city}</span>}
                  </fieldset>
                  <fieldset className="fieldset">
                    <label htmlFor="postalCode">Postal code (optional)</label>
                    <input type="text" id="postalCode" value={formData.postalCode} onChange={handleChange} />
                  </fieldset>
                </div>

                <fieldset className="box fieldset">
                  <label htmlFor="phone">Phone</label>
                  <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                    <span style={{
                      padding: '10px 12px',
                      background: '#f5f5f5',
                      borderRight: '1px solid #e0e0e0',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#444',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}>+92</span>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow digits, max 10
                        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        formData.updateField("phone", val);
                      }}
                      onKeyDown={(e) => {
                        // Block non-digit keys except control keys
                        if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={10}
                      placeholder="3XXXXXXXXX"
                      style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 12px', fontSize: '0.95rem' }}
                    />
                  </div>
                  {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </fieldset>

                <fieldset className="box fieldset" style={{ display: 'none' }}>
                  <label htmlFor="note">Order notes (optional)</label>
                  <textarea id="note" value={formData.note} onChange={handleChange} />
                </fieldset>

                <fieldset className="box fieldset">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
                </fieldset>
              </form>
            </div>
            
            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <h5 className="fw-5 mb_20">Your order</h5>
                
                <div className="tf-page-cart-checkout widget-wrap-checkout">
                  <ul className="wrap-checkout-product">
                    {items.map((it) => (
                      <li className="checkout-product-item" key={it.id}>
                        <figure className="img-product">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.image} alt={it.title} />
                          <span className="quantity">{it.qty}</span>
                        </figure>
                        <div className="content">
                          <div className="info">
                            <p className="name">{it.title} - {it.color}</p>
                            <span className="variant" style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                              <span>Lens: {it.lensType} {it.power && `(${it.power})`}</span>
                              {it.addonName !== "No aftercare" && <span>Addon: {it.addonName}</span>}
                            </span>

                            {/* Prescription upload — EYESIGHT items only */}
                            {it.lensType === "EYESIGHT" && (
                              <div style={{ marginTop: '8px' }}>
                                {!prescriptionFiles[it.id] && !prescriptionUrls[it.id] ? (
                                  <label
                                    style={{
                                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                                      padding: '5px 10px', borderRadius: '6px', fontSize: '0.78rem',
                                      fontWeight: 600, cursor: 'pointer', border: '1.5px dashed #7c3aed',
                                      color: '#7c3aed', background: '#f5f3ff',
                                    }}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    Upload Prescription
                                    <input
                                      type="file" accept="image/*,application/pdf" hidden
                                      disabled={isUploadingPrescriptions}
                                      onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) usePrescriptionStore.getState().setFile(it.id, f);
                                      }}
                                    />
                                  </label>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                    {prescriptionFiles[it.id] && prescriptionFiles[it.id].type.startsWith("image/") ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img 
                                        src={URL.createObjectURL(prescriptionFiles[it.id])} 
                                        alt="Prescription" 
                                        style={{ width: "46px", height: "46px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                                      />
                                    ) : (
                                      <div style={{ width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", borderRadius: "6px", border: "1px solid #ddd", fontSize: "1.2rem" }}>
                                        📄
                                      </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                      <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.78rem' }}>
                                        ✓ {prescriptionFiles[it.id]?.name || "Prescription uploaded"}
                                      </span>
                                      <div style={{ display: 'flex', gap: '10px' }}>
                                        <label style={{ color: '#7c3aed', fontSize: '0.75rem', cursor: isUploadingPrescriptions ? 'not-allowed' : 'pointer', textDecoration: 'underline', margin: 0 }}>
                                          {isUploadingPrescriptions ? "Uploading..." : "Change file"}
                                          <input
                                            type="file" accept="image/*,application/pdf" hidden
                                            disabled={isUploadingPrescriptions}
                                            onChange={e => {
                                              const f = e.target.files?.[0];
                                              if (f) {
                                                usePrescriptionStore.getState().setFile(it.id, f);
                                                setPrescriptionUrls(prev => { const n = {...prev}; delete n[it.id]; return n; });
                                              }
                                            }}
                                          />
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            usePrescriptionStore.getState().removeFile(it.id);
                                            setPrescriptionUrls(prev => { const n = {...prev}; delete n[it.id]; return n; });
                                          }}
                                          disabled={isUploadingPrescriptions}
                                          style={{ color: '#dc2626', fontSize: '0.75rem', background: 'none', border: 'none', padding: 0, cursor: isUploadingPrescriptions ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="price">Rs. {((it.unitPrice + it.addonPrice) * it.qty).toLocaleString()}</span>
                        </div>
                      </li>
                    ))}
                    {items.length === 0 && (
                      <p>Your cart is empty.</p>
                    )}
                  </ul>

                  <div className="coupon-box mt-3">
                    <input type="text" placeholder="Discount code" />
                    <button type="button" className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn">
                      Apply
                    </button>
                  </div>

                  <div className="d-flex justify-content-between line pb_20 mt-3">
                    <h6 className="fw-5">Subtotal</h6>
                    <h6 className="total fw-5" suppressHydrationWarning>Rs. {sub.toLocaleString()}</h6>
                  </div>
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">Shipping</h6>
                    <h6 className="total fw-5" suppressHydrationWarning>{shippingCost === 0 ? "Free" : `Rs. ${shippingCost.toLocaleString()}`}</h6>
                  </div>
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">Total</h6>
                    <h6 className="total fw-5" suppressHydrationWarning>Rs. {total.toLocaleString()}</h6>
                  </div>

                  <div className="wd-check-payment mt-3">
                    <div className="fieldset-radio mb_10" style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        id="COD"
                        className="tf-check"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        style={{ marginTop: 0 }}
                      />
                      <label htmlFor="COD" style={{ marginLeft: 8, transform: "translateY(2px)" }}>Cash on delivery</label>
                    </div>

                    <div className="fieldset-radio mb_20" style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        id="ADVANCE"
                        className="tf-check"
                        checked={paymentMethod === "ADVANCE"}
                        onChange={() => setPaymentMethod("ADVANCE")}
                        style={{ marginTop: 0 }}
                      />
                      <label htmlFor="ADVANCE" style={{ marginLeft: 8, transform: "translateY(2px)" }}>Advance Payment</label>
                    </div>

                    {paymentMethod === "ADVANCE" && (
                      <div className="payment-details p-3 mb_20 rounded" style={{ background: '#f5f5f5', border: '1px solid #ddd' }}>
                        <h6 className="fw-5 mb_10" style={{ fontSize: '0.95rem' }}>Bank Transfer Details</h6>
                        <ul className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                          <li className="text_black-2 mb-1" style={{ fontSize: '0.85rem' }}><strong>SadaPay:</strong> {sadapay_details || "03XX-XXXXXXX (Account Owner)"}</li>
                          <li className="text_black-2" style={{ fontSize: '0.85rem' }}><strong>Easypaisa:</strong> {easypaisa_details || "03XX-XXXXXXX (Account Owner)"}</li>
                        </ul>
                        <p className="text_black-2 mb-0" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dc3545' }}>
                          Note: {advance_note || "Please send a screenshot of the advance payment on WhatsApp along with your order number."}
                        </p>
                      </div>
                    )}
                    
                    <p className="text_black-2 mb_20">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <Link href="/privacy-policy" className="text-decoration-underline">
                        privacy policy
                      </Link>.
                    </p>
                    <div className="box-checkbox fieldset-radio mb_20">
                      <input
                        type="checkbox"
                        id="check-agree"
                        className="tf-check"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked) setTermsError("");
                        }}
                      />
                      <label htmlFor="check-agree" className="text_black-2">
                        I have read and agree to the website{" "}
                        <Link href="/terms-conditions" className="text-decoration-underline">
                          terms and conditions
                        </Link>.
                      </label>
                    </div>
                    {termsError && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '12px' }}>{termsError}</p>}
                  </div>

                  <button 
                    type="submit" 
                    form="checkout-form" 
                    disabled={loading || items.length === 0} 
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center w-100"
                  >
                    {isUploadingPrescriptions ? "Uploading Prescriptions & Processing..." : loading ? "Processing..." : "Place order"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}


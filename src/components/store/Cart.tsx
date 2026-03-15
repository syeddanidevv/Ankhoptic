"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCartStore();

  const FREE_SHIPPING_THRESHOLD = 5000; // PKR
  const sub = subtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);
  const progress = Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* shoppingCart */}
      <div className="modal fullRight fade modal-shopping-cart" id="shoppingCart">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="header">
              <div className="title fw-5">Shopping Cart</div>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="wrap">
              {/* Free Shipping Progress */}
              <div className="tf-mini-cart-threshold">
                <div className="tf-progress-bar">
                  <span style={{ width: `${progress}%` }}>
                    <div className="progress-car">
                      <svg xmlns="http://www.w3.org/2000/svg" width={21} height={14} viewBox="0 0 21 14" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z" />
                      </svg>
                    </div>
                  </span>
                </div>
                <div className="tf-progress-msg">
                  {remaining > 0 ? (
                    <>
                      Buy <span className="price fw-6">Rs. {remaining.toLocaleString()}</span> more to enjoy{" "}
                      <span className="fw-6">Free Shipping</span>
                    </>
                  ) : (
                    <span className="fw-6">🎉 You have free shipping!</span>
                  )}
                </div>
              </div>

              <div className="tf-mini-cart-wrap">
                <div className="tf-mini-cart-main">
                  <div className="tf-mini-cart-sroll">

                    {/* Cart Items */}
                    <div className="tf-mini-cart-items">
                      {items.length === 0 ? (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>
                          <i className="icon icon-bag" style={{ fontSize: 40, display: "block", marginBottom: 10 }} />
                          <p>Your cart is empty</p>
                          <Link
                            href="/shop"
                            data-bs-dismiss="modal"
                            className="tf-btn btn-fill animate-hover-btn radius-3"
                            style={{ marginTop: 12, display: "inline-block" }}
                          >
                            <span>Shop Now</span>
                          </Link>
                        </div>
                      ) : (
                        items.map((item) => (
                          <div className="tf-mini-cart-item" key={item.id}>
                            <div className="tf-mini-cart-image">
                              <Link href={`/product/${item.slug}`}>
                                <div style={{ width: 80, height: 80, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <i className="icon icon-eye" style={{ fontSize: 24, color: "#ccc" }} />
                                </div>
                              </Link>
                            </div>
                            <div className="tf-mini-cart-info">
                              <Link className="title link" href={`/product/${item.slug}`}>
                                {item.title}
                              </Link>
                              <div className="meta-variant">
                                {item.color}
                                {item.lensType === "EYESIGHT" && item.power && ` · Power: ${item.power}`}
                                {item.addonName && ` · ${item.addonName}`}
                              </div>
                              <div className="price fw-6">Rs. {((item.unitPrice + item.addonPrice) * item.qty).toLocaleString()}</div>
                              <div className="tf-mini-cart-btns">
                                <div className="wg-quantity small">
                                  <span
                                    className="btn-quantity minus-btn"
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    style={{ cursor: "pointer" }}
                                  >-</span>
                                  <input
                                    type="text"
                                    name="number"
                                    value={item.qty}
                                    readOnly
                                  />
                                  <span
                                    className="btn-quantity plus-btn"
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    style={{ cursor: "pointer" }}
                                  >+</span>
                                </div>
                                <div
                                  className="tf-mini-cart-remove"
                                  onClick={() => removeItem(item.id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  Remove
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>

                {/* Cart Bottom */}
                {items.length > 0 && (
                  <div className="tf-mini-cart-bottom">
                    <div className="tf-mini-cart-bottom-wrap">
                      <div className="tf-cart-totals-discounts">
                        <div className="tf-cart-total">Subtotal</div>
                        <div className="tf-totals-total-value fw-6">
                          Rs. {sub.toLocaleString()} PKR
                        </div>
                      </div>
                      <div className="tf-cart-tax">
                        Shipping calculated at checkout
                      </div>
                      <div className="tf-mini-cart-line" />
                      <div className="tf-mini-cart-view-checkout">
                        <Link
                          href="/cart"
                          data-bs-dismiss="modal"
                          className="tf-btn btn-outline radius-3 link w-100 justify-content-center"
                        >
                          View Cart
                        </Link>
                        <Link
                          href="/checkout"
                          data-bs-dismiss="modal"
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        >
                          <span>Checkout</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /shoppingCart */}
    </>
  );
}

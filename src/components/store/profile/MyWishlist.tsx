"use client";

import Link from "next/link";
import AccountSidebar from "./AccountSidebar";

export default function MyWishlist() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Wishlist</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"><AccountSidebar /></div>
            <div className="col-lg-9">
              <div className="my-account-content account-wishlist">
                <div className="text-center" style={{ padding: "60px 0" }}>
                  <i className="icon-heart" style={{ fontSize: 52, color: "#e0e0e0" }} />
                  <h6 className="mt_20 mb_10">Your wishlist is empty</h6>
                  <p style={{ color: "#888" }}>Save products you love and come back to them later.</p>
                  <Link href="/shop" className="tf-btn btn-fill animate-hover-btn mt_20">
                    <span>Browse Products</span>
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

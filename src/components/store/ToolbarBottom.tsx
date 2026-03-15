"use client";
import Link from "next/link";

export default function ToolbarBottom() {
  return (
    <div className="tf-toolbar-bottom type-1150">

      {/* Shop / Mobile Menu toggle */}
      <div className="toolbar-item">
        <a
          href="#mobileMenu"
          data-bs-toggle="offcanvas"
          aria-controls="mobileMenu"
        >
          <div className="toolbar-icon">
            <i className="icon icon-shop" />
          </div>
          <div className="toolbar-label">Menu</div>
        </a>
      </div>

      {/* Search */}
      <div className="toolbar-item">
        <a
          href="#canvasSearch"
          data-bs-toggle="offcanvas"
          aria-controls="offcanvasLeft"
        >
          <div className="toolbar-icon">
            <i className="icon icon-search" />
          </div>
          <div className="toolbar-label">Search</div>
        </a>
      </div>

      {/* Account */}
      <div className="toolbar-item">
        <a href="#login" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon icon-account" />
          </div>
          <div className="toolbar-label">Account</div>
        </a>
      </div>

      {/* Wishlist */}
      <div className="toolbar-item">
        <Link href="/wishlist">
          <div className="toolbar-icon">
            <i className="icon icon-heart" />
            <div className="toolbar-count">0</div>
          </div>
          <div className="toolbar-label">Wishlist</div>
        </Link>
      </div>

      {/* Cart */}
      <div className="toolbar-item">
        <a href="#shoppingCart" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon icon-bag" />
            <div className="toolbar-count">0</div>
          </div>
          <div className="toolbar-label">Cart</div>
        </a>
      </div>

    </div>
  );
}
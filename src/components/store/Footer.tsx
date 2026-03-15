/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const DEFAULT_LOGO = "/store/images/logo/logo.jpg";

export default function Footer() {
  const [logo, setLogo] = useState(DEFAULT_LOGO);

  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((d) => { if (d.store_logo) setLogo(d.store_logo); })
      .catch(() => {});
  }, []);

  return (
    <footer id="footer" className="footer md-pb-70">
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link href="/">
                      <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "21px", width: "auto" }}
                      />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>
                        Address: 1234 Fashion Street, Suite 567, <br /> New
                        York, NY 10001
                      </p>
                    </li>
                    <li>
                      <p>
                        Email:{" "}
                        <Link href="mailto:info@fashionshop.com">
                          info@fashionshop.com
                        </Link>
                      </p>
                    </li>
                    <li>
                      <p>
                        Phone: <Link href="tel:2125551234">(212) 555-1234</Link>
                      </p>
                    </li>
                  </ul>
                  <Link href="/contact" className="tf-btn btn-line">
                    Get direction
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                  <ul className="tf-social-icon d-flex gap-10">
                    <li>
                      <Link
                        href="#"
                        className="box-icon w_34 round social-facebook social-line"
                      >
                        <i className="icon fs-14 icon-fb" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="box-icon w_34 round social-twiter social-line"
                      >
                        <i className="icon fs-12 icon-Icon-x" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="box-icon w_34 round social-instagram social-line"
                      >
                        <i className="icon fs-14 icon-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="box-icon w_34 round social-tiktok social-line"
                      >
                        <i className="icon fs-14 icon-tiktok" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="box-icon w_34 round social-pinterest social-line"
                      >
                        <i className="icon fs-14 icon-pinterest-1" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Help</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Help</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  <li>
                    <Link href="/privacy-policy" className="footer-menu_item">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="footer-menu_item">
                      {" "}
                      Returns + Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="footer-menu_item">
                      Shipping
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="footer-menu_item">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="footer-menu_item">
                      FAQ’s
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="footer-menu_item">
                      Compare
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="footer-menu_item">
                      My Wishlist
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>About us</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>About us</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  <li>
                    <Link href="/about" className="footer-menu_item">
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link href="/stores" className="footer-menu_item">
                      Visit Our Store
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="footer-menu_item">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="footer-menu_item">
                      Account
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      Sign up to get first dibs on new arrivals, sales,
                      exclusive content, events and more!
                    </div>
                    <form
                      className="form-newsletter"
                      id="subscribe-form"
                      action="#"
                      method="post"
                      acceptCharset="utf-8"
                      data-mailchimp="true"
                    >
                      <div id="subscribe-content">
                        <fieldset className="email">
                          <input
                            type="email"
                            className="radius-60"
                            name="email-form"
                            id="subscribe-email"
                            placeholder="Enter your email...."
                            tabIndex={0}
                            aria-required="true"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            id="subscribe-button"
                            className="tf-btn btn-sm radius-60 btn-fill btn-icon animate-hover-btn"
                            type="button"
                          >
                            Subscribe
                            <i className="icon icon-arrow1-top-left" />
                          </button>
                        </div>
                      </div>
                      <div id="subscribe-msg" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                  <div className="footer-menu_item">
                    © 2025 Ankhoptics. All Rights Reserved
                  </div>
                  <div className="tf-payment">
                    <Image
                      src="/store/images/payments/visa.png"
                      alt="Visa"
                      width={48}
                      height={30}
                    />
                    <Image
                      src="/store/images/payments/img-1.png"
                      alt="Payment"
                      width={48}
                      height={30}
                    />
                    <Image
                      src="/store/images/payments/img-2.png"
                      alt="Payment"
                      width={48}
                      height={30}
                    />
                    <Image
                      src="/store/images/payments/img-3.png"
                      alt="Payment"
                      width={48}
                      height={30}
                    />
                    <Image
                      src="/store/images/payments/img-4.png"
                      alt="Payment"
                      width={48}
                      height={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

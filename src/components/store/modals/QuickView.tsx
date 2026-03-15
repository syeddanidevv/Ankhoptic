export default function QuickAdd() {
  return (
    <>
      {/* modal quick_view */}
      <div className="modal fade modalDemo popup-quickview" id="quick_view">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="wrap">
              <div className="tf-product-media-wrap">
                <div dir="ltr" className="swiper tf-single-slide">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <div className="item">
                        <img src="images/products/orange-1.jpg" alt="" />
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="item">
                        <img src="images/products/pink-1.jpg" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="swiper-button-next button-style-arrow single-slide-prev" />
                  <div className="swiper-button-prev button-style-arrow single-slide-next" />
                </div>
              </div>
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list">
                  <div className="tf-product-info-title">
                    <h5>
                      <a className="link" href="product-detail.html">
                        Ribbed Tank Top
                      </a>
                    </h5>
                  </div>
                  <div className="tf-product-info-badges">
                    <div className="badges text-uppercase">Best seller</div>
                    <div className="product-status-content">
                      <i className="icon-lightning" />
                      <p className="fw-6">
                        Selling fast! 48 people have this in their carts.
                      </p>
                    </div>
                  </div>
                  <div className="tf-product-info-price">
                    <div className="price">$18.00</div>
                  </div>
                  <div className="tf-product-description">
                    <p>
                      Nunc arcu faucibus a et lorem eu a mauris adipiscing
                      conubia ac aptent ligula facilisis a auctor habitant
                      parturient a a.Interdum fermentum.
                    </p>
                  </div>
                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item">
                      <div className="variant-picker-label">
                        Color:{" "}
                        <span className="fw-6 variant-picker-label-value">
                          Orange
                        </span>
                      </div>
                      <div className="variant-picker-values">
                        <input
                          id="values-orange-1"
                          type="radio"
                          name="color-1"
                          defaultChecked={true}
                        />
                        <label
                          className="hover-tooltip radius-60"
                          htmlFor="values-orange-1"
                          data-value="Orange"
                        >
                          <span className="btn-checkbox bg-color-orange" />
                          <span className="tooltip">Orange</span>
                        </label>
                        <input
                          id="values-black-1"
                          type="radio"
                          name="color-1"
                        />
                        <label
                          className=" hover-tooltip radius-60"
                          htmlFor="values-black-1"
                          data-value="Black"
                        >
                          <span className="btn-checkbox bg-color-black" />
                          <span className="tooltip">Black</span>
                        </label>
                        <input
                          id="values-white-1"
                          type="radio"
                          name="color-1"
                        />
                        <label
                          className="hover-tooltip radius-60"
                          htmlFor="values-white-1"
                          data-value="White"
                        >
                          <span className="btn-checkbox bg-color-white" />
                          <span className="tooltip">White</span>
                        </label>
                      </div>
                    </div>
                    <div className="variant-picker-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="variant-picker-label">
                          Size:{" "}
                          <span className="fw-6 variant-picker-label-value">
                            S
                          </span>
                        </div>
                        <div className="find-size btn-choose-size fw-6">
                          Find your size
                        </div>
                      </div>
                      <div className="variant-picker-values">
                        <input
                          type="radio"
                          name="size-1"
                          id="values-s-1"
                          defaultChecked={true}
                        />
                        <label
                          className="style-text"
                          htmlFor="values-s-1"
                          data-value="S"
                        >
                          <p>S</p>
                        </label>
                        <input type="radio" name="size-1" id="values-m-1" />
                        <label
                          className="style-text"
                          htmlFor="values-m-1"
                          data-value="M"
                        >
                          <p>M</p>
                        </label>
                        <input type="radio" name="size-1" id="values-l-1" />
                        <label
                          className="style-text"
                          htmlFor="values-l-1"
                          data-value="L"
                        >
                          <p>L</p>
                        </label>
                        <input type="radio" name="size-1" id="values-xl-1" />
                        <label
                          className="style-text"
                          htmlFor="values-xl-1"
                          data-value="XL"
                        >
                          <p>XL</p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <div className="wg-quantity">
                      <span className="btn-quantity minus-btn">-</span>
                      <input type="text" name="number" defaultValue={1} />
                      <span className="btn-quantity plus-btn">+</span>
                    </div>
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form className="">
                      <a
                        href="#"
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn btn-add-to-cart"
                      >
                        <span>Add to cart -&nbsp;</span>
                        <span className="tf-qty-price">$8.00</span>
                      </a>
                      <a
                        href="#"
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </a>
                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </a>
                      <div className="w-100">
                        <a href="#" className="btns-full">
                          Buy with{" "}
                          <img src="images/payments/paypal.png" alt="" />
                        </a>
                        <a href="#" className="payment-more-option">
                          More payment options
                        </a>
                      </div>
                    </form>
                  </div>
                  <div>
                    <a
                      href="product-detail.html"
                      className="tf-btn fw-6 btn-line"
                    >
                      View full details
                      <i className="icon icon-arrow1-top-left" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /modal quick_view */}
    </>
  );
}

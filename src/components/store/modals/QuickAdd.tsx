export default function QuickAdd() {
  return (
    <>
      {/* modal quick_add */}
      <div className="modal fade modalDemo popup-quickadd" id="quick_add">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="wrap">
              <div className="tf-product-info-item">
                <div className="image">
                  <img src="images/products/orange-1.jpg" alt="" />
                </div>
                <div className="content">
                  <a href="product-detail.html">Ribbed Tank Top</a>
                  <div className="tf-product-info-price">
                    {/* <div class="price-on-sale">$8.00</div>
                          <div class="compare-at-price">$10.00</div>
                          <div class="badges-on-sale"><span>20</span>% OFF</div> */}
                    <div className="price">$18.00</div>
                  </div>
                </div>
              </div>
              <div className="tf-product-info-variant-picker mb_15">
                <div className="variant-picker-item">
                  <div className="variant-picker-label">
                    Color:{" "}
                    <span className="fw-6 variant-picker-label-value">
                      Orange
                    </span>
                  </div>
                  <div className="variant-picker-values">
                    <input
                      id="values-orange"
                      type="radio"
                      name="color"
                      defaultChecked={true}
                    />
                    <label
                      className="hover-tooltip radius-60"
                      htmlFor="values-orange"
                      data-value="Orange"
                    >
                      <span className="btn-checkbox bg-color-orange" />
                      <span className="tooltip">Orange</span>
                    </label>
                    <input id="values-black" type="radio" name="color" />
                    <label
                      className=" hover-tooltip radius-60"
                      htmlFor="values-black"
                      data-value="Black"
                    >
                      <span className="btn-checkbox bg-color-black" />
                      <span className="tooltip">Black</span>
                    </label>
                    <input id="values-white" type="radio" name="color" />
                    <label
                      className="hover-tooltip radius-60"
                      htmlFor="values-white"
                      data-value="White"
                    >
                      <span className="btn-checkbox bg-color-white" />
                      <span className="tooltip">White</span>
                    </label>
                  </div>
                </div>
                <div className="variant-picker-item">
                  <div className="variant-picker-label">
                    Size:{" "}
                    <span className="fw-6 variant-picker-label-value">S</span>
                  </div>
                  <div className="variant-picker-values">
                    <input
                      type="radio"
                      name="size"
                      id="values-s"
                      defaultChecked={true}
                    />
                    <label
                      className="style-text"
                      htmlFor="values-s"
                      data-value="S"
                    >
                      <p>S</p>
                    </label>
                    <input type="radio" name="size" id="values-m" />
                    <label
                      className="style-text"
                      htmlFor="values-m"
                      data-value="M"
                    >
                      <p>M</p>
                    </label>
                    <input type="radio" name="size" id="values-l" />
                    <label
                      className="style-text"
                      htmlFor="values-l"
                      data-value="L"
                    >
                      <p>L</p>
                    </label>
                    <input type="radio" name="size" id="values-xl" />
                    <label
                      className="style-text"
                      htmlFor="values-xl"
                      data-value="XL"
                    >
                      <p>XL</p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="tf-product-info-quantity mb_15">
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
                    <span className="tf-qty-price">$18.00</span>
                  </a>
                  <div className="tf-product-btn-wishlist btn-icon-action">
                    <i className="icon-heart" />
                    <i className="icon-delete" />
                  </div>
                  <a
                    href="#compare"
                    data-bs-toggle="offcanvas"
                    aria-controls="offcanvasLeft"
                    className="tf-product-btn-wishlist box-icon bg_white compare btn-icon-action"
                  >
                    <span className="icon icon-compare" />
                    <span className="icon icon-check" />
                  </a>
                  <div className="w-100">
                    <a href="#" className="btns-full">
                      Buy with <img src="images/payments/paypal.png" alt="" />
                    </a>
                    <a href="#" className="payment-more-option">
                      More payment options
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /modal quick_add */}
    </>
  );
}

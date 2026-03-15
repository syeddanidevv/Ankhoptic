export default function IconBox() {
  return (
    <section
      className="flat-spacing-1 has-line-bottom flat-iconbox wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          <div
            dir="ltr"
            className="swiper tf-sw-mobile"
            data-preview={1}
            data-space={15}
          >
            <div className="swiper-wrapper wrap-iconbox">
              <div className="swiper-slide">
                <div className="tf-icon-box style-row">
                  <div className="icon">
                    <i className="icon-car-order" />
                  </div>
                  <div className="content">
                    <div className="title fw-4">Free Shipping</div>
                    <p>Free delivery above Rs 2500</p>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="tf-icon-box style-row">
                  <div className="icon">
                    <i className="icon-heart" />
                  </div>
                  <div className="content">
                    <div className="title fw-4">Satisfaction</div>
                    <p>Satisfaction with every order</p>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="tf-icon-box style-row">
                  <div className="icon">
                    <i className="icon-suport" />
                  </div>
                  <div className="content">
                    <div className="title fw-4">Support</div>
                    <p>24/7 support for all your needs</p>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="tf-icon-box style-row">
                  <div className="icon">
                    <i className="icon-return-order" />
                  </div>
                  <div className="content">
                    <div className="title fw-4">Return</div>
                    <p>Easy returns within 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sw-dots style-2 sw-pagination-mb justify-content-center" />
        </div>
      </div>
    </section>
  );
}

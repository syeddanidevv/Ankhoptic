/* eslint-disable @next/next/no-img-element */
export default function HomeNewsletter() {
  return (
    <section className="flat-spacing-5">
      <div className="container">
        <div className="widget-card-store type-4 radius-20 overflow-hidden align-items-center tf-grid-layout md-col-2 bg_f3f5f5" style={{ maxHeight: 400 }}>
          <div className="store-item-info" style={{ padding: '60px 40px' }}>
            <h5 className="store-heading ">
              Subscribe <br /> to our newsletter
            </h5>
            <div className="description">
              <p className="text-black">
                Promotions, new products and sales. Directly to your inbox.
              </p>
            </div>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <form
                id="subscribe-form"
                action="#"
                className="form-newsletter form-newsletter-1"
                method="post"
                acceptCharset="utf-8"
                data-mailchimp="true"
              >
                <div id="subscribe-content" className="subscribe-wrap">
                  <input
                    type="email"
                    name="email-form"
                    id="subscribe-email"
                    placeholder="Enter email address"
                  />
                  <button
                    type="button"
                    id="subscribe-button"
                    className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-60"
                  >
                    Subscribe
                  </button>
                </div>
                <div id="subscribe-msg" />
              </form>
            </div>
          </div>
          <div className="store-img" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img
              className="lazyload"
              data-src="/store/images/products/glasses-1.jpg"
              src="/store/images/products/glasses-1.jpg"
              alt="Ankhoptics Newsletter"
              style={{ objectFit: 'contain', width: '100%', height: '100%', maxHeight: 400 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

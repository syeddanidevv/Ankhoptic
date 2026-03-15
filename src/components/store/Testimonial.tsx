/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Testimonial() {
  return (
    <section className="flat-spacing-4 pt_0">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title">Testimonials</span>
          <p className="sub-title">
            Beat the Heat in Style: It&apos;s time to stock up on summer
            essentials!
          </p>
        </div>
        <div className="wrap-carousel">
          <div
            dir="ltr"
            className="swiper tf-sw-testimonial"
            data-preview={3}
            data-tablet={2}
            data-mobile={1}
            data-space-lg={30}
            data-space-md={15}
          >
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div
                  className="testimonial-item style-column wow fadeInUp"
                  data-wow-delay="0s"
                >
                  <div className="rating">
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                  </div>
                  <div className="heading">Best Online Fashion Site</div>
                  <div className="text">
                    &ldquo; I always find something stylish and affordable on
                    this web fashion site &rdquo;
                  </div>
                  <div className="author">
                    <div className="name">Robert smith</div>
                    <div className="metas">Customer from USA</div>
                  </div>
                  <div className="product">
                    <div className="image">
                      <Link href="#">
                        <img
                          className="lazyload"
                          data-src="/store/images/shop/products/img-p2.png"
                          src="/store/images/shop/products/img-p2.png"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="content-wrap">
                      <div className="product-title">
                        <Link href="#">Jersey thong body</Link>
                      </div>
                      <div className="price">$105.95</div>
                    </div>
                    <Link href="#" className="">
                      <i className="icon-arrow1-top-left" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div
                  className="testimonial-item style-column wow fadeInUp"
                  data-wow-delay=".1s"
                >
                  <div className="rating">
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                  </div>
                  <div className="heading">Great Selection and Quality</div>
                  <div className="text">
                    &quot;I love the variety of styles and the high-quality
                    clothing on this web fashion site.&quot;
                  </div>
                  <div className="author">
                    <div className="name">Allen Lyn</div>
                    <div className="metas">Customer from France</div>
                  </div>
                  <div className="product">
                    <div className="image">
                      <Link href="#">
                        <img
                          className="lazyload"
                          data-src="/store/images/shop/products/img-p3.png"
                          src="/store/images/shop/products/img-p3.png"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="content-wrap">
                      <div className="product-title">
                        <Link href="#">Cotton jersey top</Link>
                      </div>
                      <div className="price">$7.95</div>
                    </div>
                    <Link href="#" className="">
                      <i className="icon-arrow1-top-left" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div
                  className="testimonial-item style-column wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  <div className="rating">
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                  </div>
                  <div className="heading">Best Customer Service</div>
                  <div className="text">
                    &quot;I finally found a web fashion site with stylish and
                    flattering options in my size.&quot;
                  </div>
                  <div className="author">
                    <div className="name">Peter Rope</div>
                    <div className="metas">Customer from USA</div>
                  </div>
                  <div className="product">
                    <div className="image">
                      <Link href="#">
                        <img
                          className="lazyload"
                          data-src="/store/images/shop/products/img-p4.png"
                          src="/store/images/shop/products/img-p4.png"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="content-wrap">
                      <div className="product-title">
                        <Link href="#">Ribbed modal T-shirt</Link>
                      </div>
                      <div className="price">From $18.95</div>
                    </div>
                    <Link href="#" className="">
                      <i className="icon-arrow1-top-left" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div
                  className="testimonial-item style-column wow fadeInUp"
                  data-wow-delay=".3s"
                >
                  <div className="rating">
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                    <i className="icon-star" />
                  </div>
                  <div className="heading">Great Selection and Quality</div>
                  <div className="text">
                    &quot;I love the variety of styles and the high-quality
                    clothing on this web fashion site.&quot;
                  </div>
                  <div className="author">
                    <div className="name">Hellen Ase</div>
                    <div className="metas">Customer from Japan</div>
                  </div>
                  <div className="product">
                    <div className="image">
                      <Link href="#">
                        <img
                          className="lazyload"
                          data-src="/store/images/shop/products/img-p5.png"
                          src="/store/images/shop/products/img-p5.png"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="content-wrap">
                      <div className="product-title">
                        <Link href="#">Customer from Japan</Link>
                      </div>
                      <div className="price">$16.95</div>
                    </div>
                    <Link href="#" className="">
                      <i className="icon-arrow1-top-left" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center" />
        </div>
      </div>
    </section>
  );
}

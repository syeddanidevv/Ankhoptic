import Link from "next/link";
export default function TopTrending() {
  return (
    <section className="flat-spacing-5 pt_0">
      <div className="container">
        <div className="flat-animate-tab">
          <div className="flat-title wow fadeInUp" data-wow-delay="0s">
            <span className="title fw-6">Top Trending</span>
            <p className="sub-title">
              Discover our best-selling lenses, trusted for their comfort,
              style, and superior quality!
            </p>
          </div>
          <div className="tab-content">
            <div className="tab-pane active show" id="meat" role="tabpanel">
              <div className="tf-grid-layout tf-col-2 xl-col-4">
                {/* card product 1 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable1.jpg"
                        src="/store/images/products/vegetable1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable2.jpg"
                        src="/store/images/products/vegetable2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 2 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits.jpg"
                        src="/store/images/products/fruits.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits2.jpg"
                        src="/store/images/products/fruits2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Red Seedless Grapes
                      </Link>
                      <span className="price fw-6">$4.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 3 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/meat1.jpg"
                        src="/store/images/products/meat1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/meat2.jpg"
                        src="/store/images/products/meat2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Silere Merino Lamb Boneless Leg Joint
                      </Link>
                      <span className="price fw-6">$13.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 4 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits3.jpg"
                        src="/store/images/products/fruits3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits4.jpg"
                        src="/store/images/products/fruits4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 5 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits5.jpg"
                        src="/store/images/products/fruits5.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits6.jpg"
                        src="/store/images/products/fruits6.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        M&amp;S Full-Bodied Greek Kalamata Olives
                      </Link>
                      <span className="price fw-6">$7.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 6 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/milk.jpg"
                        src="/store/images/products/milk.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/milk2.jpg"
                        src="/store/images/products/milk2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        The Collective Suckies Peach &amp; Apricot Yoghurt
                      </Link>
                      <span className="price fw-6">$75.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 7 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fish.jpg"
                        src="/store/images/products/fish.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fish2.jpg"
                        src="/store/images/products/fish2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Fish Said Fred Sea Bass Fillets
                      </Link>
                      <span className="price fw-6">$6.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 8 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable3.jpg"
                        src="/store/images/products/vegetable3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable4.jpg"
                        src="/store/images/products/vegetable4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado British Broccoli
                      </Link>
                      <span className="price fw-6">$72.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="oils" role="tabpanel">
              <div className="tf-grid-layout tf-col-2 xl-col-4">
                {/* card product 1 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable1.jpg"
                        src="/store/images/products/vegetable1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable2.jpg"
                        src="/store/images/products/vegetable2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 2 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits.jpg"
                        src="/store/images/products/fruits.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits2.jpg"
                        src="/store/images/products/fruits2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Red Seedless Grapes
                      </Link>
                      <span className="price fw-6">$4.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 3 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/meat1.jpg"
                        src="/store/images/products/meat1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/meat2.jpg"
                        src="/store/images/products/meat2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Silere Merino Lamb Boneless Leg Joint
                      </Link>
                      <span className="price fw-6">$13.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 4 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits3.jpg"
                        src="/store/images/products/fruits3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits4.jpg"
                        src="/store/images/products/fruits4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 5 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits5.jpg"
                        src="/store/images/products/fruits5.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits6.jpg"
                        src="/store/images/products/fruits6.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        M&amp;S Full-Bodied Greek Kalamata Olives
                      </Link>
                      <span className="price fw-6">$7.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 6 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/milk.jpg"
                        src="/store/images/products/milk.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/milk2.jpg"
                        src="/store/images/products/milk2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        The Collective Suckies Peach &amp; Apricot Yoghurt
                      </Link>
                      <span className="price fw-6">$75.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 7 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fish.jpg"
                        src="/store/images/products/fish.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fish2.jpg"
                        src="/store/images/products/fish2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Fish Said Fred Sea Bass Fillets
                      </Link>
                      <span className="price fw-6">$6.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 8 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable3.jpg"
                        src="/store/images/products/vegetable3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable4.jpg"
                        src="/store/images/products/vegetable4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado British Broccoli
                      </Link>
                      <span className="price fw-6">$72.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="fruits" role="tabpanel">
              <div className="tf-grid-layout tf-col-2 xl-col-4">
                {/* card product 1 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable1.jpg"
                        src="/store/images/products/vegetable1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable2.jpg"
                        src="/store/images/products/vegetable2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 2 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits.jpg"
                        src="/store/images/products/fruits.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits2.jpg"
                        src="/store/images/products/fruits2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Red Seedless Grapes
                      </Link>
                      <span className="price fw-6">$4.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 3 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/meat1.jpg"
                        src="/store/images/products/meat1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/meat2.jpg"
                        src="/store/images/products/meat2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Silere Merino Lamb Boneless Leg Joint
                      </Link>
                      <span className="price fw-6">$13.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 4 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits3.jpg"
                        src="/store/images/products/fruits3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits4.jpg"
                        src="/store/images/products/fruits4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 5 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits5.jpg"
                        src="/store/images/products/fruits5.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits6.jpg"
                        src="/store/images/products/fruits6.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        M&amp;S Full-Bodied Greek Kalamata Olives
                      </Link>
                      <span className="price fw-6">$7.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 6 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/milk.jpg"
                        src="/store/images/products/milk.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/milk2.jpg"
                        src="/store/images/products/milk2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        The Collective Suckies Peach &amp; Apricot Yoghurt
                      </Link>
                      <span className="price fw-6">$75.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 7 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fish.jpg"
                        src="/store/images/products/fish.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fish2.jpg"
                        src="/store/images/products/fish2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Fish Said Fred Sea Bass Fillets
                      </Link>
                      <span className="price fw-6">$6.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 8 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable3.jpg"
                        src="/store/images/products/vegetable3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable4.jpg"
                        src="/store/images/products/vegetable4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado British Broccoli
                      </Link>
                      <span className="price fw-6">$72.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="tomatoes" role="tabpanel">
              <div className="tf-grid-layout tf-col-2 xl-col-4">
                {/* card product 1 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable1.jpg"
                        src="/store/images/products/vegetable1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable2.jpg"
                        src="/store/images/products/vegetable2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 2 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits.jpg"
                        src="/store/images/products/fruits.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits2.jpg"
                        src="/store/images/products/fruits2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Red Seedless Grapes
                      </Link>
                      <span className="price fw-6">$4.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 3 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/meat1.jpg"
                        src="/store/images/products/meat1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/meat2.jpg"
                        src="/store/images/products/meat2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Silere Merino Lamb Boneless Leg Joint
                      </Link>
                      <span className="price fw-6">$13.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 4 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits3.jpg"
                        src="/store/images/products/fruits3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits4.jpg"
                        src="/store/images/products/fruits4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 5 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits5.jpg"
                        src="/store/images/products/fruits5.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits6.jpg"
                        src="/store/images/products/fruits6.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        M&amp;S Full-Bodied Greek Kalamata Olives
                      </Link>
                      <span className="price fw-6">$7.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 6 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/milk.jpg"
                        src="/store/images/products/milk.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/milk2.jpg"
                        src="/store/images/products/milk2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        The Collective Suckies Peach &amp; Apricot Yoghurt
                      </Link>
                      <span className="price fw-6">$75.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 7 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fish.jpg"
                        src="/store/images/products/fish.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fish2.jpg"
                        src="/store/images/products/fish2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Fish Said Fred Sea Bass Fillets
                      </Link>
                      <span className="price fw-6">$6.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 8 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable3.jpg"
                        src="/store/images/products/vegetable3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable4.jpg"
                        src="/store/images/products/vegetable4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado British Broccoli
                      </Link>
                      <span className="price fw-6">$72.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane" id="soup" role="tabpanel">
              <div className="tf-grid-layout tf-col-2 xl-col-4">
                {/* card product 1 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable1.jpg"
                        src="/store/images/products/vegetable1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable2.jpg"
                        src="/store/images/products/vegetable2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 2 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits.jpg"
                        src="/store/images/products/fruits.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits2.jpg"
                        src="/store/images/products/fruits2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Red Seedless Grapes
                      </Link>
                      <span className="price fw-6">$4.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 3 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/meat1.jpg"
                        src="/store/images/products/meat1.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/meat2.jpg"
                        src="/store/images/products/meat2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Silere Merino Lamb Boneless Leg Joint
                      </Link>
                      <span className="price fw-6">$13.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 4 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits3.jpg"
                        src="/store/images/products/fruits3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits4.jpg"
                        src="/store/images/products/fruits4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado Little Gem Lettuce
                      </Link>
                      <span className="price fw-6">$85.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 5 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fruits5.jpg"
                        src="/store/images/products/fruits5.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fruits6.jpg"
                        src="/store/images/products/fruits6.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        M&amp;S Full-Bodied Greek Kalamata Olives
                      </Link>
                      <span className="price fw-6">$7.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 6 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/milk.jpg"
                        src="/store/images/products/milk.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/milk2.jpg"
                        src="/store/images/products/milk2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        The Collective Suckies Peach &amp; Apricot Yoghurt
                      </Link>
                      <span className="price fw-6">$75.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 7 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/fish.jpg"
                        src="/store/images/products/fish.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/fish2.jpg"
                        src="/store/images/products/fish2.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Fish Said Fred Sea Bass Fillets
                      </Link>
                      <span className="price fw-6">$6.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* card product 8 */}
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href="product-detail.html" className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src="/store/images/products/vegetable3.jpg"
                        src="/store/images/products/vegetable3.jpg"
                        alt="image-product"
                      />
                      <img
                        className="lazyload img-hover"
                        data-src="/store/images/products/vegetable4.jpg"
                        src="/store/images/products/vegetable4.jpg"
                        alt="image-product"
                      />
                    </Link>
                    <div className="list-product-btn absolute-2">
                      <Link
                        href="#"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete" />
                      </Link>
                      <Link
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare" />
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check" />
                      </Link>
                      <Link
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">Quick View</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href="product-detail.html" className="title link fw-6">
                        Ocado British Broccoli
                      </Link>
                      <span className="price fw-6">$72.00</span>
                    </div>
                    <div className="list-product-btn">
                      <Link
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag" />
                        <span className="tooltip">Add to cart</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* eslint-disable @next/next/no-img-element */
const categories = [
  { label: "New Arrivals", img: "collection-circle-8.jpg" },
  { label: "Best Sellers", img: "collection-circle-9.jpg" },
  { label: "Top Rated", img: "collection-circle-10.jpg" },
  { label: "Brands We Love", img: "collection-circle-11.jpg" },
  { label: "Trending", img: "collection-circle-12.jpg" },
  { label: "The Re-Imagined", img: "collection-circle-13.jpg" },
  { label: "Sale", img: "sale.jpg", saleOff: "30% off" },
];

export default function CategoryCircles() {
  return (
    <section className="flat-spacing-20">
      <div className="container">
        <div className="tf-categories-wrap">
          <div className="tf-categories-container">
            {categories.map(({ label, img, saleOff }) => (
              <div key={label} className="collection-item-circle hover-img">
                <a href="#" className="collection-image img-style">
                  {saleOff ? (
                    <div className="has-saleoff-wrap position-relative">
                      <img
                        src={`/store/images/collections/${img}`}
                        alt={label}
                      />
                      <div className="sale-off fw-5">{saleOff}</div>
                    </div>
                  ) : (
                    <img src={`/store/images/collections/${img}`} alt={label} />
                  )}
                </a>
                <div className="collection-content text-center">
                  <a href="#" className="link title fw-6">
                    {label}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Shop all button */}
          <div className="tf-shopall-wrap">
            <div className="collection-item-circle tf-shopall">
              <a
                href="#"
                className="collection-image img-style tf-shopall-icon"
              >
                <i className="icon icon-arrow1-top-left"></i>
              </a>
              <div className="collection-content text-center">
                <a href="#" className="link title fw-6">
                  Shop all
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

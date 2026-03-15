"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export default function CanvasSearch() {
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/store/brands")
      .then((r) => r.json())
      .then((data) => setBrands(data))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* canvasSearch */}
      <div className="offcanvas offcanvas-end canvas-search" id="canvasSearch">
        <div className="canvas-wrapper">
          <header className="tf-search-head">
            <div className="title fw-5">
              Search our site
              <div className="close">
                <span
                  className="icon-close icon-close-popup"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                />
              </div>
            </div>
            <div className="tf-search-sticky">
              <form className="tf-mini-search-frm" onSubmit={handleSubmit}>
                <fieldset className="text">
                  <input
                    type="text"
                    placeholder="Search lenses, brands..."
                    name="text"
                    tabIndex={0}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-required="true"
                    required
                  />
                </fieldset>
                <button type="submit">
                  <i className="icon icon-search" />
                </button>
              </form>
            </div>
          </header>

          <div className="canvas-body p-0">
            <div className="tf-search-content">
              <div className="tf-cart-hide-has-results">

                {/* Quick Links */}
                <div className="tf-col-quicklink">
                  <div className="tf-search-content-title fw-5">Quick Links</div>
                  <ul className="tf-quicklink-list">
                    <li className="tf-quicklink-item">
                      <Link href="/shop">All Lenses</Link>
                    </li>
                    <li className="tf-quicklink-item">
                      <Link href="/shop?color=brown">Brown Lenses</Link>
                    </li>
                    <li className="tf-quicklink-item">
                      <Link href="/shop?color=grey">Grey Lenses</Link>
                    </li>
                    <li className="tf-quicklink-item">
                      <Link href="/shop?disposability=daily">Daily Lenses</Link>
                    </li>
                    <li className="tf-quicklink-item">
                      <Link href="/shop?disposability=monthly">Monthly Lenses</Link>
                    </li>
                    <li className="tf-quicklink-item">
                      <Link href="/shop?tag=deals">Deals</Link>
                    </li>
                  </ul>
                </div>

                {/* DB Brands */}
                {brands.length > 0 && (
                  <div className="tf-col-content">
                    <div className="tf-search-content-title fw-5">Browse by Brand</div>
                    <div className="tf-search-hidden-inner">
                      {brands.map((brand) => (
                        <div className="tf-loop-item" key={brand.id}>
                          <div
                            className="content"
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}
                          >
                            {brand.logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4 }}
                              />
                            )}
                            <Link href={`/shop?brand=${brand.slug}`}>{brand.name}</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /canvasSearch */}
    </>
  );
}
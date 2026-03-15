/* eslint-disable @next/next/no-img-element */
export default function BrandLogos() {
  const brands = [
    { name: "US Vision", logo: "/store/images/brand/us-vision.webp" },
    { name: "Optiano", logo: "/store/images/brand/optiano.webp" },
    { name: "Magic Eye", logo: null },
  ];

  return (
    <section className="flat-spacing-12 pt_0">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-6">Our Brands</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              style={{
                flex: "1 1 160px",
                maxWidth: 200,
                minWidth: 130,
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "22px 28px",
                background: "#fff",
                minHeight: 110,
              }}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxHeight: 90,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1e2d5a",
                    textAlign: "center",
                    letterSpacing: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

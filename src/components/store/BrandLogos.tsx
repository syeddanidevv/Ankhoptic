/* eslint-disable @next/next/no-img-element */
export default function BrandLogos() {
  const brands = [
    { name: "US Vision", logo: "/store/images/brand/us-vision.webp" },
    { name: "Optiano", logo: "/store/images/brand/optiano.webp" },
    { name: "Magic Eye", logo: null },
  ];

  return (
    <section className="flat-spacing-5">
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
                flex: "1 1 200px",
                maxWidth: 260,
                minWidth: 150,
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 20px",
                background: "#fff",
                minHeight: 140,
              }}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxHeight: 115,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 22,
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

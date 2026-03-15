import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CategorySlider() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      brand: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { position: "asc" },
  });

  if (categories.length === 0) return null;

  return (
    <section className="flat-spacing-9">
      <style>{`
        .tf-sw-collection:not(.swiper-initialized) .swiper-wrapper {
          display: flex;
          overflow: hidden;
        }
        .tf-sw-collection:not(.swiper-initialized) .swiper-slide {
          min-width: calc(100% / 6);
          flex-shrink: 0;
        }
      `}</style>
      <div className="container-full">
        <div
          className="flat-title wow fadeInUp align-items-start"
          data-wow-delay="0s"
        >
          <span className="title fw-6">Shop by categories</span>
        </div>
        <div className="hover-sw-nav">
          <div
            dir="ltr"
            className="swiper tf-sw-collection"
            data-preview={6}
            data-tablet={4}
            data-mobile={2}
            data-space-lg={30}
            data-space-md={30}
            data-space={15}
            data-loop="false"
            data-auto-play="false"
          >
            <div className="swiper-wrapper">
              {categories.map((cat) => (
                <div className="swiper-slide" key={cat.id}>
                  <div className="collection-item style-2 hover-img">
                    <div className="collection-inner">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="collection-image img-style radius-20"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 200,
                          gap: 8,
                          textDecoration: "none",
                          background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)",
                          padding: "20px 12px",
                        }}
                      >
                        {cat.brand && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5 }}>
                            {cat.brand.name}
                          </span>
                        )}
                        <span style={{ fontSize: 15, fontWeight: 700, textAlign: "center", color: "#1e2d5a", lineHeight: 1.3 }}>
                          {cat.name}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="nav-sw nav-next-slider nav-next-collection box-icon w_46 round">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-collection box-icon w_46 round">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center" />
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Slide {
  url: string;
  alt?: string;
  link?: string;
}

interface SliderCfg {
  preview: number;
  tablet: number;
  mobile: number;
  centered: boolean;
  loop: boolean;
  autoPlay: boolean;
  delay: number;
  speed: number;
  height: number;
  dotOffset: number;
  dotColor: string;
}

function HeroSliderContent({ slides, cfg }: { slides: Slide[]; cfg: SliderCfg }) {
  const plugins = useMemo(() => {
    return cfg.autoPlay ? [Autoplay({ delay: cfg.delay, stopOnInteraction: false })] : [];
  }, [cfg.autoPlay, cfg.delay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: cfg.loop,
      align: cfg.centered ? "center" : "start",
      duration: Math.max(20, Math.min(100, cfg.speed / 10)),
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="tf-slideshow slider-radius" style={{ position: "relative" }}>
      <style>{`
        .embla-hero-container {
          overflow: hidden;
        }
        .embla-hero-flex {
          display: flex;
          touch-action: pan-y pinch-zoom;
          margin-left: -15px;
        }
        .embla-hero-slide {
          flex: 0 0 calc(100% / ${cfg.mobile});
          min-width: 0;
          padding-left: 15px;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .embla-hero-slide {
            flex: 0 0 calc(100% / ${cfg.tablet});
          }
        }
        @media (min-width: 1152px) {
          .embla-hero-slide {
            flex: 0 0 calc(100% / ${cfg.preview});
          }
        }

        .custom-dot {
          width: 8px;
          height: 8px;
          background: ${cfg.dotColor || "#ffffff"};
          opacity: 0.5;
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .custom-dot.active {
          opacity: 1;
          background: ${cfg.dotColor || "#ffffff"};
          width: 24px;
          border-radius: 4px;
        }
      `}</style>

      <div className="embla-hero-container" ref={emblaRef}>
        <div className="embla-hero-flex">
          {slides.map((slide, i) => (
            <div className="embla-hero-slide" key={i}>
              {slide.link ? (
                <a
                  href={slide.link}
                  className="wrap-slider"
                  style={{ display: "block" }}
                >
                  <img
                    src={slide.url}
                    alt={slide.alt ?? `slide-${i + 1}`}
                    style={{
                      width: "100%",
                      height: `${cfg.height || 600}px`,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </a>
              ) : (
                <div className="wrap-slider" style={{ display: "block" }}>
                  <img
                    src={slide.url}
                    alt={slide.alt ?? `slide-${i + 1}`}
                    style={{
                      width: "100%",
                      height: `${cfg.height || 600}px`,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="wrap-pagination"
        style={{
          position: "absolute",
          bottom: `${cfg.dotOffset || 20}px`,
          width: "100%",
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            className="justify-content-center"
            style={{ display: "flex", alignItems: "center" }}
          >
            {scrollSnaps.map((_, index) => (
              <div
                key={index}
                onClick={() => scrollTo(index)}
                className={`custom-dot ${
                  index === selectedIndex ? "active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [cfg, setCfg] = useState({
    preview: 1,
    tablet: 1,
    mobile: 1,
    centered: false,
    loop: true,
    autoPlay: true,
    delay: 4500,
    speed: 1200,
    height: 600,
    dotOffset: 20,
    dotColor: "#ffffff",
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.hero_slides) && d.hero_slides.length > 0) {
          setSlides(d.hero_slides);
        }
        if (d.slider_settings) {
          setCfg({
            preview: Number(d.slider_settings.preview ?? 1),
            tablet: Number(d.slider_settings.tablet ?? 1),
            mobile: Number(d.slider_settings.mobile ?? 1),
            centered: d.slider_settings.centered === true,
            loop: d.slider_settings.loop !== false,
            autoPlay: d.slider_settings.autoPlay !== false,
            delay: Number(d.slider_settings.delay ?? 4500),
            speed: Number(d.slider_settings.speed ?? 1200),
            height: Number(d.slider_settings.height ?? 600),
            dotOffset: Number(d.slider_settings.dotOffset ?? 20),
            dotColor: d.slider_settings.dotColor || "#ffffff",
          });
        }
      })
      .catch((err) => console.error("Slider fetch error:", err))
      .finally(() => setReady(true));
  }, []);

  if (!ready || slides.length === 0) return null;

  return <HeroSliderContent slides={slides} cfg={cfg} />;
}

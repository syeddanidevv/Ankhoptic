/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";

interface SliderSettings {
  preview: number;
  tablet: number;
  mobile: number;
  centered: boolean;
  space: number;
  loop: boolean;
  autoPlay: boolean;
  delay: number;
  speed: number;
}

const DEFAULT_SETTINGS: SliderSettings = {
  preview: 3,
  tablet: 1,
  mobile: 1,
  centered: false,
  space: 10,
  loop: true,
  autoPlay: true,
  delay: 2000,
  speed: 1000,
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<
    { url: string; alt?: string; link?: string }[]
  >([]);
  const [cfg, setCfg] = useState<SliderSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const swiperRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  // Keep reference to destroy swiper instance on re-init
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperInstanceRef = useRef<any>(null);

  // 1. Fetch slides + settings from API
  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.hero_slides) && d.hero_slides.length > 0) {
          setSlides(d.hero_slides);
        }
        if (d.slider_settings) {
          setCfg({
            ...DEFAULT_SETTINGS,
            ...d.slider_settings,
            preview: Number(
              d.slider_settings.preview || DEFAULT_SETTINGS.preview,
            ),
            tablet: Number(d.slider_settings.tablet || DEFAULT_SETTINGS.tablet),
            mobile: Number(d.slider_settings.mobile || DEFAULT_SETTINGS.mobile),
            space: Number(d.slider_settings.space || DEFAULT_SETTINGS.space),
            delay: Number(d.slider_settings.delay || DEFAULT_SETTINGS.delay),
            speed: Number(d.slider_settings.speed || DEFAULT_SETTINGS.speed),
          });
        }
      })
      .catch((err) => console.error("Slider fetch config error:", err))
      .finally(() => setReady(true));
  }, []);

  // 2. Initialize Swiper AFTER slides + cfg are ready
  useEffect(() => {
    if (!ready || slides.length === 0 || !swiperRef.current) return;

    // Destroy previous instance if it exists
    if (swiperInstanceRef.current) {
      try {
        swiperInstanceRef.current.destroy(true, true);
      } catch {}
      swiperInstanceRef.current = null;
    }

    // Wait for Swiper script to load
    const swiperInterval = setInterval(() => {
      if (typeof window === "undefined" || !swiperRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwiperCtor = (window as any).Swiper;
      if (!SwiperCtor) return; // Keep waiting

      clearInterval(swiperInterval);

      const canLoop = cfg.loop && slides.length > cfg.preview;

      swiperInstanceRef.current = new SwiperCtor(swiperRef.current, {
        slidesPerView: cfg.mobile,
        spaceBetween: 0,
        loop: canLoop,
        speed: cfg.speed,
        centeredSlides: false,
        ...(cfg.autoPlay
          ? {
              autoplay: {
                delay: cfg.delay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              },
            }
          : { autoplay: false }),
        pagination: {
          el: paginationRef.current,
          clickable: true,
        },
        navigation: {
          clickable: true,
          nextEl: ".navigation-prev-slider",
          prevEl: ".navigation-next-slider",
        },
        breakpoints: {
          768: {
            slidesPerView: cfg.tablet,
            spaceBetween: cfg.space,
            centeredSlides: false,
          },
          1150: {
            slidesPerView: cfg.preview,
            spaceBetween: cfg.space,
            centeredSlides: cfg.centered,
          },
        },
      });
    }, 100);

    return () => {
      clearInterval(swiperInterval);
      if (swiperInstanceRef.current) {
        try {
          swiperInstanceRef.current.destroy(true, true);
        } catch {}
        swiperInstanceRef.current = null;
      }
    };
  }, [ready, slides, cfg]);

  // Don't render until data is loaded (so carousel.js doesn't grab empty DOM first)
  if (!ready || slides.length === 0) return null;

  return (
    <div className="tf-slideshow slider-radius slider-effect-fade position-relative">
      <div ref={swiperRef} dir="ltr" className="swiper tf-sw-slideshow">
        <div className="swiper-wrapper">
          {slides.map((slide, i) => (
            <div key={i} className="swiper-slide">
              {slide.link ? (
                <a href={slide.link}>
                  <img
                    className={`${i !== 0 ? "lazyload" : ""} w-100`}
                    {...(i !== 0 ? { "data-src": slide.url } : {})}
                    src={slide.url}
                    alt={slide.alt ?? `hp-slideshow-0${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                </a>
              ) : (
                <img
                  className={`${i !== 0 ? "lazyload" : ""} w-100`}
                  {...(i !== 0 ? { "data-src": slide.url } : {})}
                  src={slide.url}
                  alt={slide.alt ?? `hp-slideshow-0${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="wrap-pagination">
        <div className="container">
          <div ref={paginationRef} className="sw-dots line-white-pagination sw-pagination-slider justify-content-center"></div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

type JQueryFunction = (selector: unknown) => { length: number; each: (callback: (index: number, element: HTMLElement) => void) => void; data: (key: string) => unknown; parent: () => { find: (selector: string) => HTMLElement[] } };

declare global {
  interface Window {
    jQuery: JQueryFunction;
    Swiper: new (element: HTMLElement | null, options: unknown) => { destroy: () => void };
  }
}

export default function CarouselTrigger() {
  useEffect(() => {
    // Only run if the Swiper script and jQuery are loaded
    if (typeof window !== "undefined" && window.Swiper && window.jQuery) {
      const $ = window.jQuery;
      
      // Delay slightly to ensure DOM is ready and Next.js has mounted
      setTimeout(() => {
        const elements = $(".tf-sw-collection:not(.swiper-initialized)");
        if (elements.length > 0) {
          elements.each((_: number, el: HTMLElement) => {
            const $this = $(el);
            const preview = $this.data("preview");
            const tablet = $this.data("tablet");
            const mobile = $this.data("mobile");
            const spacingLg = $this.data("space-lg");
            const spacingMd = $this.data("space-md");
            const spacing = $this.data("space");
            const loop = $this.data("loop");
            const play = $this.data("auto-play");
            
            new window.Swiper(el, {
              autoplay: play ? {
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false,
              slidesPerView: mobile,
              loop: loop,
              spaceBetween: spacing,
              speed: 1000,
              pagination: {
                el: $this.parent().find(".sw-pagination-collection")[0],
                clickable: true,
              },
              slidesPerGroup: 1,
              navigation: {
                clickable: true,
                nextEl: $this.parent().find(".nav-next-collection")[0],
                prevEl: $this.parent().find(".nav-prev-collection")[0],
              },
              breakpoints: {
                768: {
                  slidesPerView: tablet,
                  spaceBetween: spacingMd,
                  slidesPerGroup: 2,
                },
                1150: {
                  slidesPerView: preview,
                  spaceBetween: spacingLg,
                  slidesPerGroup: 2,
                },
              },
            });
          });
        }

        // Testimonial Init
        const testimonials = $(".tf-sw-testimonial:not(.swiper-initialized)");
        if (testimonials.length > 0) {
          testimonials.each((_: number, el: HTMLElement) => {
            const $this = $(el);
            const preview = $this.data("preview");
            const tablet = $this.data("tablet");
            const mobile = $this.data("mobile");
            const spacingLg = $this.data("space-lg");
            const spacingMd = $this.data("space-md");

            new window.Swiper(el, {
              slidesPerView: mobile,
              spaceBetween: spacingMd,
              speed: 1000,
              pagination: {
                el: $this.parent().find(".sw-pagination-testimonial")[0],
                clickable: true,
              },
              navigation: {
                clickable: true,
                nextEl: $this.parent().find(".nav-prev-testimonial")[0],
                prevEl: $this.parent().find(".nav-next-testimonial")[0],
              },
              breakpoints: {
                768: {
                  slidesPerView: tablet,
                  spaceBetween: spacingLg,
                },
                1150: {
                  slidesPerView: preview,
                  spaceBetween: spacingLg,
                },
              },
            });
          });
        }
      }, 100);
    }
  }, []);

  return null;
}

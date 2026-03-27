"use client";

import { useEffect } from "react";

export default function TemplateScripts() {
  useEffect(() => {
    // Pre-declare window.$ if needed before jQuery loads, or wait.
    // We load scripts sequentially after React hydration to avoid hydration mismatches
    // and guarantee jQuery plugins execute in the correct order.
    
    // Check if scripts were already loaded to prevent duplicate loading on re-renders
    if (document.getElementById("template-scripts-loaded")) return;
    
    const marker = document.createElement("div");
    marker.id = "template-scripts-loaded";
    marker.style.display = "none";
    document.body.appendChild(marker);

    const scripts = [
      "/store/js/jquery.min.js",
      "/store/js/bootstrap.min.js",
      "/store/js/swiper-bundle.min.js",
      "/store/js/wow.min.js",
      "/store/js/lazysize.min.js",
      "/store/js/magnific-popup.min.js",
      "/store/js/bootstrap-select.min.js",
      "/store/js/carousel.js",
      "/store/js/count-down.js",
      "/store/js/main.js"
    ];

    let promise = Promise.resolve();
    
    scripts.forEach((src) => {
      promise = promise.then(() => {
        return new Promise<void>((resolve, reject) => {
          // If script already exists in the DOM, skip it
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            resolve(); // continue even if one fails
          };
          document.body.appendChild(script);
        });
      });
    });
  }, []);

  return null;
}

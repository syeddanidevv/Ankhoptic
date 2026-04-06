import type { NextConfig } from "next";

const securityHeaders = [
  // Block iframe embedding (clickjacking protection)
  { key: "X-Frame-Options",           value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Stop referrer leaking on cross-origin nav
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Restrict browser features
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  // XSS auditor (legacy browsers)
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  // HSTS — HTTPS only (enable in production with a real domain)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:", // blob: needed for HMR or WebWorkers
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' wss: https:", // wss: required for Hot Module Reloading in dev
      "frame-src 'self' https://www.google.com https://*.google.com", // allow Google Maps embeds
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Required for Docker/Coolify deployment — produces a minimal self-contained server
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

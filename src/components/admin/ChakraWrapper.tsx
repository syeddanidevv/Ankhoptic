"use client";
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/admin/ui/toaster";

const adminSystem = createSystem(defaultConfig, defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Inter', 'Segoe UI', system-ui, sans-serif" },
        body:    { value: "'Inter', 'Segoe UI', system-ui, sans-serif" },
        mono:    { value: "'JetBrains Mono', 'Fira Code', monospace" },
      },
    },
  },
}));

export default function ChakraWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Inter — loaded only for admin, not polluting the storefront */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .chakra-wrapper * {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: -0.01em;
        }
      `}</style>
      <ChakraProvider value={adminSystem}>
        <div className="chakra-wrapper" style={{ height: "100%" }}>
          {children}
          <Toaster />
        </div>
      </ChakraProvider>
    </SessionProvider>
  );
}

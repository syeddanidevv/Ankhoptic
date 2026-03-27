"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QuickViewProvider } from "@/context/QuickViewContext";

interface StoreSettings {
  free_shipping_threshold: number;
  sadapay_details: string;
  easypaisa_details: string;
  advance_note: string;
}

const defaultSettings: StoreSettings = {
  free_shipping_threshold: 0,
  sadapay_details: "",
  easypaisa_details: "",
  advance_note: "",
};

const StoreSettingsContext = createContext<StoreSettings>(defaultSettings);

export const useStoreSettings = () => useContext(StoreSettingsContext);

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings/store")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings({
            free_shipping_threshold:
              data.free_shipping_threshold !== undefined && data.free_shipping_threshold !== null
                ? Number(data.free_shipping_threshold) 
                : 0,
            sadapay_details: data.sadapay_details || "",
            easypaisa_details: data.easypaisa_details || "",
            advance_note: data.advance_note || "",
          });
        }
      })
      .catch((err) => console.error("Failed to fetch store settings:", err));
  }, []);

  return (
    <SessionProvider>
      <StoreSettingsContext.Provider value={settings}>
        <QuickViewProvider>{children}</QuickViewProvider>
      </StoreSettingsContext.Provider>
    </SessionProvider>
  );
}

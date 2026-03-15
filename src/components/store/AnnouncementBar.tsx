"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((d) => {
        if (
          Array.isArray(d.announcement_messages) &&
          d.announcement_messages.length > 0
        ) {
          setMessages(d.announcement_messages);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  if (messages.length === 0) return null;

  // We need enough copies so that half the strip is wider than the screen.
  // 10 copies of the whole array is generally more than enough to cover ultra-wide monitors.
  const repeated: string[] = [];
  for (let i = 0; i < 15; i++) {
    repeated.push(...messages);
  }

  // Double the array so we can translate exactly -50% to create a seamless infinite loop
  const seamlessArray = [...repeated, ...repeated];

  return (
    <div
      className="announcement-bar bg_dark"
      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
    >
      <motion.div
        className="wrap-announcement-bar"
        style={{ display: "inline-flex", width: "max-content" }}
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: repeated.length * 1000, // Much slower speed
        }}
      >
        {/* We keep the original class `box-sw-announcement-bar` so it gets the template's spacing/gaps natively */}
        <div
          className="box-sw-announcement-bar"
          style={{
            display: "flex",
            flexShrink: 0,
            gap: "40px",
            alignItems: "center",
            animation: "none", // Override global CSS animation that overrides Framer Motion
          }}
        >
          {seamlessArray.map((msg, i) => (
            <div key={`msg-${i}`} className="announcement-bar-item">
              <p>{msg}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <span className="icon-close close-announcement-bar"></span>
    </div>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscription failed");
      
      setStatus("success");
      setEmail("");
      toast.success("Subscribed to the newsletter!");
    } catch {
      setStatus("error");
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      if (status !== "error") {
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  };

  return (
    <section className="flat-spacing-5">
      <div className="container">
        <div className="widget-card-store type-4 radius-20 overflow-hidden align-items-center tf-grid-layout md-col-2 bg_f3f5f5" style={{ maxHeight: 400 }}>
          <div className="store-item-info" style={{ padding: '60px 40px' }}>
            <h5 className="store-heading ">
              Subscribe <br /> to our newsletter
            </h5>
            <div className="description">
              <p className="text-black">
                Promotions, new products and sales. Directly to your inbox.
              </p>
            </div>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <form
                id="subscribe-form"
                onSubmit={handleSubmit}
                className="form-newsletter form-newsletter-1"
                action="#"
              >
                <div id="subscribe-content" className="subscribe-wrap">
                  <input
                    type="email"
                    name="email-form"
                    id="subscribe-email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    id="subscribe-button"
                    disabled={status === "loading"}
                    className="fade-item fade-item-3 tf-btn btn-light-icon animate-hover-btn btn-xl radius-60"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
                {status === "success" && (
                  <div className="mt-2 text-success" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Successfully subscribed! ✨
                  </div>
                )}
                {status === "error" && (
                  <div className="mt-2 text-danger" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Something went wrong.
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="store-img" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img
              className="lazyload"
              data-src="/store/images/products/glasses-1.jpg"
              src="/store/images/products/glasses-1.jpg"
              alt="Ankhoptics Newsletter"
              style={{ objectFit: 'contain', width: '100%', height: '100%', maxHeight: 400 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

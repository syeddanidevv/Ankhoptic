"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Send failed");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      toast.success("Your message has been sent successfully!");
    } catch {
      setStatus("error");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form className="mw-705 mx-auto text-center form-contact" onSubmit={handleSubmit}>
      <div className="d-flex gap-15 mb_15">
        <fieldset className="w-100">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Name *"
          />
        </fieldset>
        <fieldset className="w-100">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="Email *"
          />
        </fieldset>
      </div>
      <div className="mb_15">
        <textarea
          placeholder="Message *"
          name="message"
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          cols={30}
          rows={10}
        ></textarea>
      </div>
      <div className="send-wrap">
        <button
          type="submit"
          disabled={status === "loading"}
          className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center"
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>
      </div>
      {status === "success" && (
        <div className="mt-3 text-success fw-600">
          Thank you! We'll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="mt-3 text-danger fw-600">
          Oops! Something went wrong.
        </div>
      )}
    </form>
  );
}

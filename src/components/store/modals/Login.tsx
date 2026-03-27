/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Helper: close any Bootstrap modal by id
function closeModal(id: string) {
  if (typeof window === "undefined") return;
  try {
    // Try Bootstrap JS API first
    const el = document.getElementById(id);
    if (el && (window as any).bootstrap?.Modal) {
      (window as any).bootstrap.Modal.getInstance(el)?.hide();
    } else if (el) {
      // Manual fallback
      el.classList.remove("show");
      el.style.display = "none";
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
    }
  } catch (error) {
    console.warn(`Failed to close modal "${id}":`, error);
  }
}

export default function Login() {
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // ── Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await signIn("customer", {
      email: loginEmail,
      password: loginPass,
      redirect: false,
    });
    setLoginLoading(false);
    if (res?.ok) {
      closeModal("login");
      router.refresh();
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  // ── Register ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    if (regPass.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    setRegLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: regFirst,
        lastName: regLast,
        email: regEmail,
        password: regPass,
      }),
    });
    setRegLoading(false);
    if (res.ok) {
      setRegSuccess("Account created! Logging you in...");
      // Auto-login after register
      const loginRes = await signIn("customer", {
        email: regEmail,
        password: regPass,
        redirect: false,
      });
      if (loginRes?.ok) {
        closeModal("register");
        router.refresh();
      }
    } else {
      const data = await res.json();
      setRegError(data.error || "Registration failed.");
    }
  };

  // ── Forgot Password ──
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(
      "If this email is registered, you'll receive a reset link shortly.",
    );
  };

  // ── Reset forms when modals close ──
  useEffect(() => {
    const resetLogin = () => {
      setLoginEmail("");
      setLoginPass("");
      setLoginError("");
    };
    const resetRegister = () => {
      setRegFirst("");
      setRegLast("");
      setRegEmail("");
      setRegPass("");
      setRegError("");
      setRegSuccess("");
    };
    const resetForgot = () => {
      setForgotEmail("");
      setForgotMsg("");
    };

    const loginEl = document.getElementById("login");
    const registerEl = document.getElementById("register");
    const forgotEl = document.getElementById("forgotPassword");

    loginEl?.addEventListener("hidden.bs.modal", resetLogin);
    registerEl?.addEventListener("hidden.bs.modal", resetRegister);
    forgotEl?.addEventListener("hidden.bs.modal", resetForgot);

    return () => {
      loginEl?.removeEventListener("hidden.bs.modal", resetLogin);
      registerEl?.removeEventListener("hidden.bs.modal", resetRegister);
      forgotEl?.removeEventListener("hidden.bs.modal", resetForgot);
    };
  }, []);

  return (
    <>
      {/* ── Login Modal ── */}
      <div
        className="modal modalCentered fade form-sign-in modal-part-content"
        id="login"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <div className="demo-title">Log in</div>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-login-form">
              <form onSubmit={handleLogin}>
                {loginError && (
                  <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
                    {loginError}
                  </p>
                )}
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Email *
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Password *
                  </label>
                </div>
                <div>
                  <a
                    href="#forgotPassword"
                    data-bs-toggle="modal"
                    className="btn-link link"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="bottom">
                  <div className="w-100">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      <span>{loginLoading ? "Logging in..." : "Log in"}</span>
                    </button>
                  </div>
                  <div className="w-100">
                    <a
                      href="#register"
                      data-bs-toggle="modal"
                      className="btn-link fw-6 w-100 link"
                    >
                      New customer? Create your account
                      <i className="icon icon-arrow1-top-left" />
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      <div
        className="modal modalCentered fade form-sign-in modal-part-content"
        id="forgotPassword"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <div className="demo-title">Reset your password</div>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-login-form">
              <form onSubmit={handleForgot}>
                <div>
                  <p>
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>
                {forgotMsg && (
                  <p style={{ color: "green", fontSize: 13, marginBottom: 8 }}>
                    {forgotMsg}
                  </p>
                )}
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Email *
                  </label>
                </div>
                <div>
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link link"
                  >
                    Cancel
                  </a>
                </div>
                <div className="bottom">
                  <div className="w-100">
                    <button
                      type="submit"
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      <span>Reset password</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Register Modal ── */}
      <div
        className="modal modalCentered fade form-sign-in modal-part-content"
        id="register"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <div className="demo-title">Register</div>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-login-form">
              <form onSubmit={handleRegister}>
                {regError && (
                  <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
                    {regError}
                  </p>
                )}
                {regSuccess && (
                  <p style={{ color: "green", fontSize: 13, marginBottom: 8 }}>
                    {regSuccess}
                  </p>
                )}
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    value={regFirst}
                    onChange={(e) => setRegFirst(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    First name
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    value={regLast}
                    onChange={(e) => setRegLast(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Last name
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Email *
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required
                  />
                  <label className="tf-field-label" htmlFor="">
                    Password * (min 6 characters)
                  </label>
                </div>
                <div className="bottom">
                  <div className="w-100">
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      <span>{regLoading ? "Creating..." : "Register"}</span>
                    </button>
                  </div>
                  <div className="w-100">
                    <a
                      href="#login"
                      data-bs-toggle="modal"
                      className="btn-link fw-6 w-100 link"
                    >
                      Already have an account? Log in here
                      <i className="icon icon-arrow1-top-left" />
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

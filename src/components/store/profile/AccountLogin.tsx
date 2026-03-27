"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccountStore } from "@/store/accountStore";

export default function AccountLogin() {
  const router = useRouter();
  const loginAction = useAccountStore((state) => state.login);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await loginAction(email, password);
    setLoading(false);
    
    if (success) {
      router.push("/account");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Login</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <div className="tf-page-login">
                <h5 className="mb_24">Sign In</h5>
                {error && (
                  <div className="tf-notice danger mb_15" style={{ color: "#e53e3e", fontSize: 14 }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="email"
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="login-email">
                      Email *
                    </label>
                  </div>
                  <div className="tf-field style-1 mb_30">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="password"
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="login-password">
                      Password *
                    </label>
                  </div>
                  <div className="mb_20">
                    <button
                      type="submit"
                      disabled={loading}
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    >
                      {loading ? "Signing in…" : "Sign In"}
                    </button>
                  </div>
                </form>
                <p className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/account/register" className="text_primary">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

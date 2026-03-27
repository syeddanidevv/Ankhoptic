"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAccountStore } from "@/store/accountStore";

export default function AccountRegister() {
  const router = useRouter();
  const registerAction = useAccountStore((state) => state.register);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await registerAction({ firstName, lastName, email, phone, password });
      
      if (success) {
        router.push("/account");
        router.refresh();
      } else {
        router.push("/account/login");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Register</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="tf-page-login">
                <h5 className="mb_24">Create an Account</h5>
                {error && (
                  <div className="tf-notice danger mb_15" style={{ color: "#e53e3e", fontSize: 14 }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="tf-field style-1 mb_15">
                        <input
                          className="tf-field-input tf-input"
                          placeholder=" "
                          type="text"
                          id="register-fname"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                        <label className="tf-field-label fw-4 text_black-2" htmlFor="register-fname">
                          First Name *
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="tf-field style-1 mb_15">
                        <input
                          className="tf-field-input tf-input"
                          placeholder=" "
                          type="text"
                          id="register-lname"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                        <label className="tf-field-label fw-4 text_black-2" htmlFor="register-lname">
                          Last Name *
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="email"
                      id="register-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="register-email">
                      Email *
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="tel"
                      id="register-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="register-phone">
                      Phone Number (Optional)
                    </label>
                  </div>

                  <div className="tf-field style-1 mb_30">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=" "
                      type="password"
                      id="register-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="register-password">
                      Password *
                    </label>
                  </div>

                  <div className="mb_20">
                    <button
                      type="submit"
                      disabled={loading}
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    >
                      {loading ? "Registering…" : "Register"}
                    </button>
                  </div>
                </form>
                <p className="text-center">
                  Already have an account?{" "}
                  <Link href="/account/login" className="text_primary">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

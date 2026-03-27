"use client";

import { useEffect } from "react";
import Link from "next/link";
import AccountSidebar from "./AccountSidebar";
import { useAccountStore } from "@/store/accountStore";

export default function MyAccount() {
  const { profile, profileLoading, fetchProfile } = useAccountStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Account</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"><AccountSidebar /></div>
            <div className="col-lg-9">
              <div className="my-account-content account-dashboard">
                <div className="mb_60">
                  <h5 className="fw-5 mb_20">
                    Hello {profileLoading ? "…" : (profile?.name ?? "there")} 👋
                  </h5>
                  <p>
                    From your account dashboard you can view your{" "}
                    <Link className="text_primary" href="/account/orders">recent orders</Link>
                    , manage your{" "}
                    <Link className="text_primary" href="/account/address">shipping address</Link>
                    , and{" "}
                    <Link className="text_primary" href="/account/details">edit your account details</Link>.
                  </p>
                </div>
                <div className="tf-grid-layout md-col-2 gap-15">
                  <div className="item" style={{ background: "#f5f5f5", borderRadius: 8, padding: "20px 24px" }}>
                    <div className="text-2 text_black-2">Total Orders</div>
                    <div className="fw-7" style={{ fontSize: 28, marginTop: 8 }}>
                      {profileLoading ? "…" : (profile?.ordersCount ?? "—")}
                    </div>
                  </div>
                  <div className="item" style={{ background: "#f5f5f5", borderRadius: 8, padding: "20px 24px" }}>
                    <div className="text-2 text_black-2">Total Spent</div>
                    <div className="fw-7" style={{ fontSize: 28, marginTop: 8 }}>
                      Rs{Number(profile?.totalSpent ?? 0).toLocaleString("en-PK")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import AccountSidebar from "./AccountSidebar";
import { useAccountStore } from "@/store/accountStore";

export default function MyAccDetail() {
  const { profile, profileLoading, fetchProfile, updateProfile } = useAccountStore();
  const [localProfile, setLocalProfile] = useState(() => ({
    name: profile?.name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
  }));
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  // Track last loaded profile id to avoid overwriting user edits
  const [loadedId, setLoadedId] = useState(profile?.id ?? "");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Only sync form from store when profile first loads (not on every change)
  if (profile && profile.id !== loadedId) {
    setLoadedId(profile.id);
    setLocalProfile({ name: profile.name, email: profile.email, phone: profile.phone ?? "" });
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    const res = await fetch("/api/account/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localProfile),
    });
    setSavingProfile(false);
    const d = await res.json();
    if (res.ok) {
      updateProfile(localProfile); // update store optimistically
      setProfileMsg("✓ Profile updated!");
    } else {
      setProfileMsg(d.error ?? "Failed to update");
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg("Passwords do not match"); return; }
    if (pwForm.newPassword.length < 6) { setPwMsg("Password must be at least 6 characters"); return; }
    setSavingPw(true);
    setPwMsg("");
    const res = await fetch("/api/account/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    setSavingPw(false);
    const d = await res.json();
    if (res.ok) {
      setPwMsg("✓ Password changed!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setPwMsg(d.error ?? "Failed to change password");
    }
  }

  const msgColor = (m: string) => m.startsWith("✓") ? "#38a169" : "#e53e3e";

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Account Details</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"><AccountSidebar /></div>
            <div className="col-lg-9">
              <div className="my-account-content account-edit">
                {profileLoading && <p className="text-center py-4" style={{ color: "#aaa", marginBottom: 20 }}>Loading…</p>}

                {/* Profile form */}
                <form onSubmit={handleProfileSave} className="mb_40">
                  <h6 className="mb_20">Personal Information</h6>
                  {profileMsg && <p style={{ color: msgColor(profileMsg), fontSize: 14, marginBottom: 12 }}>{profileMsg}</p>}
                  {[
                    { id: "det-name", label: "Full Name", key: "name", type: "text" },
                    { id: "det-email", label: "Email", key: "email", type: "email" },
                    { id: "det-phone", label: "Phone (optional)", key: "phone", type: "tel" },
                  ].map(({ id, label, key, type }) => (
                    <div key={key} className="tf-field style-1 mb_15">
                      <input
                        id={id}
                        className="tf-field-input tf-input"
                        placeholder=" "
                        type={type}
                        value={(localProfile as Record<string, string>)[key] ?? ""}
                        onChange={(e) => setLocalProfile({ ...localProfile, [key]: e.target.value })}
                        required={key !== "phone"}
                      />
                      <label className="tf-field-label fw-4 text_black-2" htmlFor={id}>{label}</label>
                    </div>
                  ))}
                  <button type="submit" disabled={savingProfile} className="tf-btn btn-fill animate-hover-btn">
                    {savingProfile ? "Saving…" : "Save Changes"}
                  </button>
                </form>

                <hr className="my-4" />

                {/* Password form */}
                <form onSubmit={handlePasswordSave}>
                  <h6 className="mb_20">Change Password</h6>
                  {pwMsg && <p style={{ color: msgColor(pwMsg), fontSize: 14, marginBottom: 12 }}>{pwMsg}</p>}
                  {[
                    { id: "pw-current", label: "Current Password", key: "currentPassword" },
                    { id: "pw-new", label: "New Password", key: "newPassword" },
                    { id: "pw-confirm", label: "Confirm New Password", key: "confirmPassword" },
                  ].map(({ id, label, key }) => (
                    <div key={key} className="tf-field style-1 mb_15">
                      <input
                        id={id}
                        className="tf-field-input tf-input"
                        placeholder=" "
                        type="password"
                        value={(pwForm as Record<string, string>)[key] ?? ""}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        required
                      />
                      <label className="tf-field-label fw-4 text_black-2" htmlFor={id}>{label}</label>
                    </div>
                  ))}
                  <button type="submit" disabled={savingPw} className="tf-btn btn-fill animate-hover-btn">
                    {savingPw ? "Updating…" : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

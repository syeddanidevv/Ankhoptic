"use client";

import { useEffect, useState } from "react";
import AccountSidebar from "./AccountSidebar";
import { useAccountStore, type CustomerAddress } from "@/store/accountStore";

type FormData = Omit<CustomerAddress, "id" | "isDefault"> & { isDefault: boolean };

const EMPTY: FormData = {
  name: "", phone: "", line1: "", line2: "", city: "", province: "", isDefault: false,
};

interface AddressFormProps {
  title: string;
  values: FormData;
  onChange: (key: keyof FormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}

function AddressForm({ title, values, onChange, onSubmit, onCancel, saving, submitLabel }: AddressFormProps) {
  return (
    <form className="wd-form-address" onSubmit={onSubmit}>
      <div className="title">{title}</div>
      <div className="box-field grid-2-lg">
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-name`} required
            value={values.name} onChange={(e) => onChange("name", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-name`}>Full Name</label>
        </div>
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-phone`} required
            value={values.phone} onChange={(e) => onChange("phone", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-phone`}>Phone</label>
        </div>
      </div>
      <div className="box-field">
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-line1`} required
            value={values.line1} onChange={(e) => onChange("line1", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-line1`}>Address Line 1</label>
        </div>
      </div>
      <div className="box-field">
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-line2`}
            value={values.line2 ?? ""} onChange={(e) => onChange("line2", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-line2`}>Address Line 2 (optional)</label>
        </div>
      </div>
      <div className="box-field grid-2-lg">
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-city`} required
            value={values.city} onChange={(e) => onChange("city", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-city`}>City</label>
        </div>
        <div className="tf-field style-1">
          <input className="tf-field-input tf-input" placeholder=" " type="text" id={`${title}-province`} required
            value={values.province} onChange={(e) => onChange("province", e.target.value)} />
          <label className="tf-field-label fw-4 text_black-2" htmlFor={`${title}-province`}>Province / State</label>
        </div>
      </div>
      <div className="box-field text-start">
        <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
          <input type="checkbox" id={`${title}-default`} className="tf-check"
            checked={values.isDefault} onChange={(e) => onChange("isDefault", e.target.checked)} />
          <label htmlFor={`${title}-default`} className="text_black-2 fw-4">Set as default address</label>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center gap-20">
        <button type="submit" disabled={saving} className="tf-btn btn-fill animate-hover-btn">
          {saving ? "Saving…" : submitLabel}
        </button>
        <button type="button" className="tf-btn btn-fill animate-hover-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function MyAddress() {
  const { addresses, addressesLoading, fetchAddresses, addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useAccountStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormData>({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<Record<string, FormData>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch on mount using useEffect — addresses comes from store (no cascading setState)
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  function startEdit(a: CustomerAddress) {
    setEditingId(a.id);
    setEditForms((prev) => ({
      ...prev,
      [a.id]: { name: a.name, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, province: a.province, isDefault: a.isDefault },
    }));
  }

  function updateAddForm(key: keyof FormData, value: string | boolean) {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditForm(id: string, key: keyof FormData, value: string | boolean) {
    setEditForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    setSaving(false);
    if (res.ok) {
      const created = await res.json();
      // If this is now default, update store to reflect that
      if (addForm.isDefault) {
        removeAddress("__refetch__"); // trigger re-fetch
        await fetchAddresses();
      } else {
        addAddress(created);
      }
      setShowAddForm(false);
      setAddForm({ ...EMPTY });
      setMsg("Address added!");
    } else {
      const d = await res.json();
      setMsg(d.error ?? "Failed to save");
    }
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/account/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForms[id]),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      // If setting as default, re-fetch to get all correctly cleared
      if (editForms[id]?.isDefault) {
        await fetchAddresses();
      } else {
        updateAddress(updated);
      }
      setEditingId(null);
      setMsg("Address updated!");
    } else {
      const d = await res.json();
      setMsg(d.error ?? "Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    removeAddress(id);
  }

  async function handleSetDefault(id: string) {
    setDefaultAddress(id); // optimistic update
    const res = await fetch(`/api/account/addresses/${id}`, { method: "PATCH" });
    if (!res.ok) await fetchAddresses(); // revert on error
    else setMsg("Default address updated!");
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Addresses</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3"><AccountSidebar /></div>
            <div className="col-lg-9">
              <div className="my-account-content account-address">

                {msg && (
                  <div style={{ color: msg.includes("!") ? "#38a169" : "#e53e3e", marginBottom: 12, fontSize: 14 }}>
                    {msg}
                  </div>
                )}

                {!showAddForm && (
                  <div className="mb_30">
                    <button
                      onClick={() => { setShowAddForm(true); setAddForm({ ...EMPTY }); }}
                      className="tf-btn btn-fill animate-hover-btn"
                    >
                      Add a new address
                    </button>
                  </div>
                )}

                {showAddForm && (
                  <div className="account-address-item mb_30">
                    <AddressForm
                      title="Add new address"
                      values={addForm}
                      onChange={updateAddForm}
                      onSubmit={handleAdd}
                      onCancel={() => setShowAddForm(false)}
                      saving={saving}
                      submitLabel="Add address"
                    />
                  </div>
                )}

                <div className="list-account-address">
                  {addressesLoading && addresses.length === 0 && (
                    <p className="text-center py-4" style={{ color: "#aaa" }}>Loading addresses…</p>
                  )}
                  {!addressesLoading && addresses.length === 0 && !showAddForm && (
                    <p className="text-center" style={{ color: "#aaa" }}>No saved addresses yet. Add one above!</p>
                  )}

                  {addresses.map((a) => (
                    <div key={a.id} className="account-address-item">
                      {editingId !== a.id ? (
                        <>
                          {a.isDefault && <h6 className="mb_20">Default</h6>}
                          <p>{a.name}</p>
                          <p>{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                          <p>{a.city}, {a.province}</p>
                          <p className="mb_10">{a.phone}</p>
                          <div className="d-flex gap-10 justify-content-center flex-wrap">
                            <button onClick={() => startEdit(a)} className="tf-btn btn-fill animate-hover-btn justify-content-center btn-edit-address">
                              <span>Edit</span>
                            </button>
                            {!a.isDefault && (
                              <button onClick={() => handleSetDefault(a.id)} className="tf-btn btn-outline animate-hover-btn justify-content-center">
                                <span>Set Default</span>
                              </button>
                            )}
                            <button onClick={() => handleDelete(a.id)} className="tf-btn btn-outline animate-hover-btn justify-content-center">
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        editForms[a.id] && (
                          <AddressForm
                            title="Edit address"
                            values={editForms[a.id]}
                            onChange={(key, value) => updateEditForm(a.id, key, value)}
                            onSubmit={(e) => handleUpdate(e, a.id)}
                            onCancel={() => setEditingId(null)}
                            saving={saving}
                            submitLabel="Update address"
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

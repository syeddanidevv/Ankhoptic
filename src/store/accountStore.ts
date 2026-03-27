import { create } from "zustand";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: string;
  firstImage: string | null;
  firstItemTitle: string | null;
  items: { productTitle: string; qty: number }[];
}

export interface CustomerAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  isDefault: boolean;
}

interface AccountState {
  // Profile
  profile: CustomerProfile | null;
  profileLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<CustomerProfile>) => void;
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Record<string, string>) => Promise<boolean>;

  // Orders
  orders: CustomerOrder[];
  ordersLoading: boolean;
  fetchOrders: () => Promise<void>;

  // Addresses
  addresses: CustomerAddress[];
  addressesLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: CustomerAddress) => void;
  updateAddress: (address: CustomerAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  // Profile
  profile: null,
  profileLoading: false,
  fetchProfile: async () => {
    if (get().profileLoading) return;
    set({ profileLoading: true });
    try {
      const res = await fetch("/api/account/me");
      const data = await res.json();
      if (!data.error) set({ profile: data });
    } finally {
      set({ profileLoading: false });
    }
  },
  updateProfile: (data) =>
    set((s) => ({ profile: s.profile ? { ...s.profile, ...data } : null })),

  // Auth
  login: async (email, password) => {
    const { signIn } = await import("next-auth/react");
    const res = await signIn("customer", { email, password, redirect: false });
    if (res?.ok) {
      get().fetchProfile();
      return true;
    }
    return false;
  },
  register: async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const parsed = await res.json();
    if (!res.ok) {
      throw new Error(parsed.error || "Failed to register");
    }
    const { signIn } = await import("next-auth/react");
    const loginRes = await signIn("customer", { email: data.email, password: data.password, redirect: false });
    if (loginRes?.ok) {
      get().fetchProfile();
      return true;
    }
    return false;
  },

  // Orders
  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    if (get().ordersLoading) return;
    set({ ordersLoading: true });
    try {
      const res = await fetch("/api/account/orders");
      const data = await res.json();
      set({ orders: Array.isArray(data) ? data : [] });
    } finally {
      set({ ordersLoading: false });
    }
  },

  // Addresses
  addresses: [],
  addressesLoading: false,
  fetchAddresses: async () => {
    if (get().addressesLoading) return;
    set({ addressesLoading: true });
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      set({ addresses: Array.isArray(data) ? data : [] });
    } finally {
      set({ addressesLoading: false });
    }
  },
  addAddress: (address) =>
    set((s) => ({ addresses: [...s.addresses, address] })),
  updateAddress: (address) =>
    set((s) => ({
      addresses: s.addresses.map((a) => (a.id === address.id ? address : a)),
    })),
  removeAddress: (id) =>
    set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
  setDefaultAddress: (id) =>
    set((s) => ({
      addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    })),
}));

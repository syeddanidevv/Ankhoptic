import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CheckoutErrors {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}

interface CheckoutState {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  note: string;
  paymentMethod: string;
  errors: CheckoutErrors;
  updateField: (field: string, value: string) => void;
  validate: () => boolean;
  resetForm: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      firstName: "",
      lastName: "",
      country: "Pakistan",
      city: "",
      address: "",
      postalCode: "",
      phone: "",
      email: "",
      note: "",
      paymentMethod: "COD",
      errors: {},

      updateField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
          // Clear error for that field on change
          errors: { ...state.errors, [field]: undefined },
        })),

      validate: () => {
        const s = get();
        const errors: CheckoutErrors = {};
        if (!s.firstName.trim()) errors.firstName = "First name is required";
        if (!s.lastName.trim()) errors.lastName = "Last name is required";
        if (!s.address.trim()) errors.address = "Address is required";
        if (!s.city.trim()) errors.city = "City is required";
        if (!s.phone.trim()) {
          errors.phone = "Phone number is required";
        } else if (!/^3[0-9]{9}$/.test(s.phone.trim())) {
          errors.phone = "Enter a valid 10-digit number starting with 3 (e.g. 3001234567)";
        }
        if (!s.email.trim()) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) {
          errors.email = "Enter a valid email address";
        }
        set({ errors });
        return Object.keys(errors).length === 0;
      },

      resetForm: () =>
        set({
          firstName: "",
          lastName: "",
          country: "Pakistan",
          city: "",
          address: "",
          postalCode: "",
          phone: "",
          email: "",
          note: "",
          paymentMethod: "COD",
          errors: {},
        }),
    }),
    {
      name: "checkout-storage",
      // Don't persist errors
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { errors, validate, updateField, resetForm, ...rest } = state;
        return rest;
      },
    }
  )
);

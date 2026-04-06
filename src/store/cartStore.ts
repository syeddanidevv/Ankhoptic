import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id:               string;   /* unique cart item id: slug+lensType+power */
  slug:             string;
  title:            string;
  image:            string;   /* product thumbnail */
  brand:            string;
  color:            string;
  lensType:         "PLAIN" | "EYESIGHT";
  power:            string | null;
  prescriptionName: string | null; /* uploaded file name */
  addonName:        string;
  addonImage?:      string | null;
  addonPrice:       number;
  unitPrice:        number;
  qty:              number;
}

interface CartStore {
  items: CartItem[];
  addItem:    (item: Omit<CartItem, "id" | "qty">) => void;
  removeItem: (id: string) => void;
  updateQty:  (id: string, qty: number) => void;
  clearCart:  () => void;
  itemCount:  () => number;
  subtotal:   () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = `${item.slug}-${item.lensType}-${item.power ?? "plain"}-${item.addonName}`;
        set(s => {
          const existing = s.items.find(i => i.id === id);
          if (existing) {
            return { items: s.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i) };
          }
          return { items: [...s.items, { ...item, id, qty: 1 }] };
        });
      },

      removeItem: (id) =>
        set(s => ({ items: s.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) =>
        set(s => ({
          items: qty <= 0
            ? s.items.filter(i => i.id !== id)
            : s.items.map(i => i.id === id ? { ...i, qty } : i),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + (i.unitPrice + i.addonPrice) * i.qty, 0),
    }),
    {
      name: "ankhoptics-cart",
    }
  )
);

import { create } from "zustand";

interface BrandFormErrors {
  name?: string;
  logo?: string;
}

interface BrandFormState {
  // Form fields
  name: string;
  slug: string;
  logo: string;        // saved URL or base64 (confirmed after save)
  previewUrl: string;  // blob URL for instant preview

  // Pending file (deferred upload — uploaded on form submit)
  pendingFile: File | null;
  uploadProgress: number; // 0-100

  // Validation
  errors: BrandFormErrors;
  touched: Record<string, boolean>;

  // UI
  uploading: boolean;

  // Actions
  setName: (v: string) => void;
  setSlug: (v: string) => void;
  setLogo: (url: string) => void;
  setPreviewUrl: (url: string) => void;
  setPendingFile: (f: File | null) => void;
  setUploadProgress: (n: number) => void;
  setUploading: (v: boolean) => void;
  touch: (field: string) => void;
  validate: () => boolean;
  reset: () => void;
  populate: (data: { name: string; slug?: string; logo?: string | null }) => void;
}

const initialState = {
  name: "",
  slug: "",
  logo: "",
  previewUrl: "",
  pendingFile: null,
  uploadProgress: 0,
  errors: {},
  touched: {},
  uploading: false,
};

export const useBrandForm = create<BrandFormState>((set, get) => ({
  ...initialState,

  setName: (v) => {
    set((s) => ({
      name: v,
      touched: { ...s.touched, name: true },
      errors: { ...s.errors, name: v.trim() ? undefined : "Brand name is required" },
    }));
  },

  setSlug: (v) => set({ slug: v }),

  setLogo: (url) => {
    set((s) => ({ logo: url, errors: { ...s.errors, logo: undefined } }));
  },

  setPreviewUrl: (url) => set({ previewUrl: url }),

  setPendingFile: (f) => set({ pendingFile: f }),

  setUploadProgress: (n) => set({ uploadProgress: n }),

  setUploading: (v) => set({ uploading: v }),

  touch: (field) => set((s) => ({ touched: { ...s.touched, [field]: true } })),

  validate: () => {
    const { name } = get();
    const errors: BrandFormErrors = {};
    if (!name.trim()) errors.name = "Brand name is required";
    set({ errors, touched: { name: true } });
    return Object.keys(errors).length === 0;
  },

  reset: () => set(initialState),

  populate: ({ name, slug, logo }) =>
    set({
      name,
      slug: slug || "",
      logo: logo || "",
      previewUrl: logo || "",
      pendingFile: null,
      uploadProgress: 0,
      errors: {},
      touched: {},
    }),
}));

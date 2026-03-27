import { create } from "zustand";

interface PrescriptionStore {
  files: Record<string, File>;
  setFile: (cartItemId: string, file: File) => void;
  getFile: (cartItemId: string) => File | undefined;
  removeFile: (cartItemId: string) => void;
  clearFiles: () => void;
}

export const usePrescriptionStore = create<PrescriptionStore>((set, get) => ({
  files: {},
  setFile: (cartItemId, file) =>
    set((state) => ({
      files: { ...state.files, [cartItemId]: file },
    })),
  getFile: (cartItemId) => get().files[cartItemId],
  removeFile: (cartItemId) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[cartItemId];
      return { files: newFiles };
    }),
  clearFiles: () => set({ files: {} }),
}));

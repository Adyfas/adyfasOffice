import { create } from "zustand";

interface LightboxState {
  isOpen: boolean;
  src: string;
  alt: string;
  open: (src: string, alt?: string) => void;
  close: () => void;
}

export const UsestateLightbox = create<LightboxState>()((set) => ({
  isOpen: false,
  src: "",
  alt: "",
  open: (src, alt = "") => set({ isOpen: true, src, alt }),
  close: () => set({ isOpen: false }),
}));

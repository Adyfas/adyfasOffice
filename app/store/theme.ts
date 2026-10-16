import { create } from "zustand";

interface ThemeState {
  isLight: boolean;
  setIsLight: (value: boolean) => void;
}

export const UsestateTheme = create<ThemeState>()((set) => ({
  isLight: false,
  setIsLight: (isLight) => set({ isLight }),
}));

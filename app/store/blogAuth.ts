import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBlogAuth = create<{
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password: string) => {
        const ownerPassword =
          typeof import.meta !== "undefined" && import.meta.env?.VITE_BLOG_OWNER_PASSWORD
            ? import.meta.env.VITE_BLOG_OWNER_PASSWORD
            : "adyfas2025";
        const isOwner = password === ownerPassword;
        if (isOwner) set({ isAuthenticated: true });
        return isOwner;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "blog-owner-auth" }
  )
);

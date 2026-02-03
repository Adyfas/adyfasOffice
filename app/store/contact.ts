import { create } from "zustand";

interface ContactState {
  message: string;
  setMessage: (newMessage: string) => void;
}

export const UsestateMessage = create<ContactState>()((set) => ({
  message: "",
  setMessage: (newMessage) => set({ message: newMessage }),
}));

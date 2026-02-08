import {create} from "zustand"

interface handsomeProps{
    hidden: boolean;
    setHidden: (newValue: boolean) =>void;
}

export const UsetateHandsome = create<handsomeProps>()((set) => ({
    hidden:false,
    setHidden:(newValue) => set({ hidden: newValue })
}))
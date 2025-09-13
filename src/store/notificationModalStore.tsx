import { create } from "zustand";

interface Modal {
    isOpen: boolean;
    setIsOpen: () => void;
}

export const useModalStore = create<Modal>((set, get) => ({
    isOpen: false,
    setIsOpen: () => set({ isOpen: !get().isOpen }),
}));

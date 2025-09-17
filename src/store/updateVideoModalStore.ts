import { create } from "zustand";

type EditVideoModalState = {
    isOpen: boolean;
    videoId: string | null;
    initialTitle: string;
    initialDescription: string;
    openModal: (videoId: string, title: string, description: string) => void;
    closeModal: () => void;
};

export const useEditVideoModalStore = create<EditVideoModalState>((set) => ({
    isOpen: false,
    videoId: null,
    initialTitle: "",
    initialDescription: "",
    openModal: (videoId, title, description) =>
        set({
            isOpen: true,
            videoId,
            initialTitle: title,
            initialDescription: description || "",
        }),
    closeModal: () =>
        set({
            isOpen: false,
            videoId: null,
            initialTitle: "",
            initialDescription: "",
        }),
}));

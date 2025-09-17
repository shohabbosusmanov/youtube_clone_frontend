import { create } from "zustand";

interface LikeState {
    likesCount: number;
    likedByUser: boolean;
    setLikesCount: (count: number) => void;
    setLikedByUser: (liked: boolean) => void;
    increment: () => void;
    decrement: () => void;
}

export const useLikeStore = create<LikeState>((set) => ({
    likesCount: 0,
    likedByUser: false,
    setLikesCount: (count) => set({ likesCount: count }),
    setLikedByUser: (liked) => set({ likedByUser: liked }),
    increment: () => set((state) => ({ likesCount: state.likesCount + 1 })),
    decrement: () => set((state) => ({ likesCount: state.likesCount - 1 })),
}));

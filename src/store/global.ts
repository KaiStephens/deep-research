import { create } from "zustand";

interface GlobalStore {
  openHistory: boolean;
}

interface GlobalFunction {
  setOpenHistory: (visible: boolean) => void;
}

export const useGlobalStore = create<GlobalStore & GlobalFunction>((set) => ({
  openHistory: false,
  setOpenHistory: (visible) => set({ openHistory: visible }),
}));

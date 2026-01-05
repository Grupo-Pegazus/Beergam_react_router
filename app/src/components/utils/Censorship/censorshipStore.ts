import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CensorshipSettings {
  [key: string]: boolean; // key é o identificador do item censurável
}

interface ICensorshipStore {
  settings: CensorshipSettings;
  isCensored: (key: string) => boolean;
  toggleCensorship: (key: string) => void;
  setCensorship: (key: string, value: boolean) => void;
  clearAll: () => void;
}

const censorshipStore = create<ICensorshipStore>()(
  persist(
    (set, get) => ({
      settings: {},
      isCensored: (key: string) => {
        return get().settings[key] === true;
      },
      toggleCensorship: (key: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: !state.settings[key],
          },
        }));
      },
      setCensorship: (key: string, value: boolean) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: value,
          },
        }));
      },
      clearAll: () => {
        set({ settings: {} });
      },
    }),
    {
      name: "beergam_censorship_settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default censorshipStore;


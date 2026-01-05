import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PREDEFINED_CENSORSHIP_KEYS } from "./typings";

export interface CensorshipSettings {
  [key: string]: boolean; // key é o identificador do item censurável
}

interface ICensorshipStore {
  settings: CensorshipSettings;
  isCensored: (key: string) => boolean;
  toggleCensorship: (key: string) => void;
  setCensorship: (key: string, value: boolean) => void;
  clearAll: () => void;
  initializeSettings: () => void;
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
      initializeSettings: () => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings };
        let hasChanges = false;

        // Verifica cada chave pré-definida
        PREDEFINED_CENSORSHIP_KEYS.forEach((key) => {
          // Se a chave não existir, cria com valor padrão false
          if (!(key in updatedSettings)) {
            updatedSettings[key] = false;
            hasChanges = true;
          }
        });

        // Se houver mudanças, atualiza o store
        if (hasChanges) {
          set({ settings: updatedSettings });
        }
      },
    }),
    {
      name: "beergam_censorship_settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default censorshipStore;

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CensorshipSettings {
  [key: string]: boolean; // key é o identificador do item censurável
}

/**
 * Lista de chaves pré-definidas para inicialização do sistema de censura.
 * Todas as chaves serão criadas com valor padrão `false` se não existirem.
 */
export const PREDEFINED_CENSORSHIP_KEYS = [
  "home_summary",
  "home_summary_faturamento_bruto",
  "home_summary_lucro_liquido",
  "home_summary_margem_percentual",
  "home_summary_vendas",
  "home_summary_ticket_medio",
  "home_summary_lucro_medio",
  "home_summary_canceladas",
  "home_summary_canceladas_valor_total",
] as const;

/**
 * Tipo inferido a partir da lista de chaves pré-definidas.
 * Não é necessário definir manualmente - é inferido automaticamente.
 */
export type TPREDEFINED_CENSORSHIP_KEYS =
  (typeof PREDEFINED_CENSORSHIP_KEYS)[number];

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

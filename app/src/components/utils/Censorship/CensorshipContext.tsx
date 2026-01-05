import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import censorshipStore, { type CensorshipSettings } from "./censorshipStore";

export type { CensorshipSettings };

interface CensorshipContextValue {
  settings: CensorshipSettings;
  isCensored: (key: string) => boolean;
  toggleCensorship: (key: string) => void;
  setCensorship: (key: string, value: boolean) => void;
  clearAll: () => void;
}

const defaultContextValue: CensorshipContextValue = {
  settings: {},
  isCensored: () => false,
  toggleCensorship: () => {},
  setCensorship: () => {},
  clearAll: () => {},
};

const CensorshipContext =
  createContext<CensorshipContextValue>(defaultContextValue);

interface CensorshipProviderProps {
  children: ReactNode;
}

export function CensorshipProvider({ children }: CensorshipProviderProps) {
  // Inicializa as configurações uma vez por recarregamento de página
  useEffect(() => {
    censorshipStore.getState().initializeSettings();
  }, []);

  // Usa useSyncExternalStore para sincronizar com o Zustand store
  const getSettingsSnapshot = () => censorshipStore.getState().settings;
  const getSettingsServerSnapshot = () => ({}) as CensorshipSettings;
  const settings = useSyncExternalStore(
    censorshipStore.subscribe,
    getSettingsSnapshot,
    getSettingsServerSnapshot
  );

  const isCensored = (key: string): boolean => {
    return settings[key] === true;
  };

  const toggleCensorship = (key: string) => {
    censorshipStore.getState().toggleCensorship(key);
  };

  const setCensorship = (key: string, value: boolean) => {
    censorshipStore.getState().setCensorship(key, value);
  };

  const clearAll = () => {
    censorshipStore.getState().clearAll();
  };

  const value: CensorshipContextValue = {
    settings,
    isCensored,
    toggleCensorship,
    setCensorship,
    clearAll,
  };

  return (
    <CensorshipContext.Provider value={value}>
      {children}
    </CensorshipContext.Provider>
  );
}

export function useCensorship() {
  const context = useContext(CensorshipContext);
  if (!context) {
    throw new Error(
      "useCensorship deve ser usado dentro de CensorshipProvider"
    );
  }
  return context;
}

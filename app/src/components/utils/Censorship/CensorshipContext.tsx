import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CENSORSHIP_STORAGE_KEY = "beergam_censorship_settings";

export interface CensorshipSettings {
  [key: string]: boolean; // key é o identificador do item censurável
}

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

const CensorshipContext = createContext<CensorshipContextValue>(
  defaultContextValue
);

interface CensorshipProviderProps {
  children: ReactNode;
}

export function CensorshipProvider({ children }: CensorshipProviderProps) {
  const [settings, setSettings] = useState<CensorshipSettings>({});

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CENSORSHIP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CensorshipSettings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de censura:", error);
    }
  }, []);

  // Salvar no localStorage sempre que settings mudar
  useEffect(() => {
    try {
      localStorage.setItem(CENSORSHIP_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações de censura:", error);
    }
  }, [settings]);

  const isCensored = (key: string): boolean => {
    return settings[key] === true;
  };

  const toggleCensorship = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setCensorship = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAll = () => {
    setSettings({});
    try {
      localStorage.removeItem(CENSORSHIP_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar configurações de censura:", error);
    }
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
    throw new Error("useCensorship deve ser usado dentro de CensorshipProvider");
  }
  return context;
}


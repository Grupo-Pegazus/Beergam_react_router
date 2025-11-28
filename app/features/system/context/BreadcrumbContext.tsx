import { createContext, useContext, useState, type ReactNode } from "react";

interface BreadcrumbContextValue {
  customLabel: string | null;
  setCustomLabel: (label: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(
  undefined
);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [customLabel, setCustomLabel] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ customLabel, setCustomLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbCustomization() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    // Retorna valores padrão se não estiver dentro do provider
    // Isso permite usar o hook mesmo sem o provider (comportamento opcional)
    return {
      customLabel: null,
      setCustomLabel: () => {},
    };
  }
  return context;
}


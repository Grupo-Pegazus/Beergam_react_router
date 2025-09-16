import { useEffect, useState } from "react";
import type { RootState } from "..";

interface PersistWrapperProps {
  children: React.ReactNode;
  onRehydrate?: (state: Partial<RootState>) => void;
}

export function PersistWrapper({ children, onRehydrate }: PersistWrapperProps) {
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    // Simular processo de rehidratação
    const timer = setTimeout(() => {
      setIsRehydrated(true);

      // Chamar callback de rehidratação se fornecido
      if (onRehydrate) {
        // Aqui você pode despachar ações para sincronizar o estado
        // Por exemplo, se precisar de alguma ação específica após a rehidratação
        onRehydrate({});
      }
    }, 100); // Pequeno delay para simular carregamento

    return () => clearTimeout(timer);
  }, [onRehydrate]);

  // Mostrar loading ou conteúdo baseado no estado de rehidratação
  if (!isRehydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import authStore from "~/features/store-zustand";

/**
 * Hook global que detecta quando há uma transição de estado que requer
 * navegação e mostra um loading durante essa transição.
 *
 * Detecta:
 * - Login bem-sucedido (success: true) e precisa navegar para choosen_account
 * - Marketplace selecionado e precisa navegar para /interno
 */
export function useGlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Carregando...");
  const location = useLocation();
  const success = authStore.use.success();
  const marketplace = authStore.use.marketplace();
  const user = authStore.use.user();
  const isLoggingOut = authStore.use.isLoggingOut();
  useEffect(() => {
    // Detecta quando o marketplace foi selecionado e está na página de escolha de conta
    // Nesse caso, o ChoosenAccountRoute vai navegar para /interno
    const shouldNavigateAfterMarketplaceSelection =
      marketplace && location.pathname === "/interno/choosen_account";
    const shouldNavigateAfterLogout =
      isLoggingOut && location.pathname.startsWith("/interno");
    if (isLoggingOut) {
      setMessage("Saindo da conta...");
    } else {
      setMessage("Carregando...");
    }
    if (shouldNavigateAfterMarketplaceSelection || shouldNavigateAfterLogout) {
      setIsLoading(true);
    } else {
      // Remove o loading quando não está mais em uma situação de transição
      // Pequeno delay para garantir que a transição foi concluída
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [success, marketplace, user, location.pathname, isLoggingOut]);

  return { isLoading, message };
}

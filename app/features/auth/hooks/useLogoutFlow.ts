import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import authStore from "~/features/store-zustand";
import toast from "~/src/utils/toast";
import { authService } from "../service";
interface UseLogoutFlowParams {
  redirectTo?: string;
}

interface UseLogoutFlowResult {
  isLoggingOut: boolean;
  logout: () => Promise<void>;
}

export function useLogoutFlow({
  redirectTo = "/login",
}: UseLogoutFlowParams): UseLogoutFlowResult {
  const navigate = useNavigate();
  const logoutLocal = authStore.use.logout();
  const errorLocal = authStore.use.error();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    if (errorLocal == "REFRESH_TOKEN_REVOKED") {
      logoutLocal();
      window.setTimeout(() => {
        navigate(redirectTo, { replace: true });
        authStore.setState({ isLoggingOut: false });
      }, 350);
      return;
    }
    try {
      logoutLocal();
      const res = await authService.logout();
      if (!res.success) {
        toast.error(res.message || "Erro ao sair. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro inesperado no fluxo de logout", error);
      toast.error("Erro ao sair. Tente novamente em alguns instantes.");
    } finally {
      setIsLoggingOut(false);
      window.setTimeout(() => {
        navigate(redirectTo, { replace: true });
        authStore.setState({ isLoggingOut: false });
      }, 350);
    }
  }, [isLoggingOut, logoutLocal, navigate, redirectTo, errorLocal]);

  return { isLoggingOut, logout };
}

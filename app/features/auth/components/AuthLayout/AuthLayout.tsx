import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import authStore from "~/features/store-zustand";
import { UserRoles } from "~/features/user/typings/BaseUser";
import type { IColab } from "~/features/user/typings/Colab";
import { isColab } from "~/features/user/utils";
import { queryClient } from "~/lib/queryClient";
import Alert from "~/src/components/utils/Alert";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { useSessionInactivityGuard } from "../../hooks/useSessionInactivityGuard";
import {
  useAuthError,
  useAuthMarketplace,
  useAuthUser,
} from "../../context/AuthStoreContext";
import { authService } from "../../service";
import MultipleDeviceWarning from "../MultipleDeviceWarning/MultipleDeviceWarning";
import UsageTimeLimitWarning from "../UsageTimeLimitWarning/UsageTimeLimitWarning";
const ROUTES_WITHOUT_MARKETPLACE = [
  "/interno/choosen_account",
  "/interno/config",
];
export default function AuthLayout() {
  useSessionInactivityGuard();
  const { logout, isLoggingOut } = useLogoutFlow({
    redirectTo: "/login",
  });
  const { openModal } = useModal();
  const authError = useAuthError();
  const user = useAuthUser();
  const marketplace = useAuthMarketplace();
  const location = useLocation();
  const { data } = useQuery({
    queryKey: ["verifyTimeColab", user?.pin, user?.master_pin, user?.role],
    queryFn: () =>
      authService.verifyTimeColab(
        user?.pin ?? "",
        user?.master_pin ?? "",
        user?.role ?? UserRoles.COLAB
      ),
    enabled: authError === "USAGE_TIME_LIMIT",
  });
  useEffect(() => {
    //UseEffect para fazer veiricação de colab quando da timeAccess negativo
    if (!data) return;
    if (data.success) {
      authStore.setState({ error: null });
      queryClient.invalidateQueries({ queryKey: ["verifyTimeColab"] });
    } else {
      authStore.setState({ error: "USAGE_TIME_LIMIT" });
    }
  }, [data, queryClient, authError]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await authService.ping();
      if (!response.success) {
        clearInterval(interval);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const subscriptionErrors = useMemo(
    () => [
      "SUBSCRIPTION_NOT_FOUND",
      "SUBSCRIPTION_CANCELLED",
      "SUBSCRIPTION_NOT_ACTIVE",
    ],
    []
  );

  const isSubscriptionError = useMemo(
    () => authError && subscriptionErrors.includes(authError),
    [authError, subscriptionErrors]
  );

  const targetSubscriptionPath = "/interno/config";
  const targetSubscriptionSearch = "?session=Minha%20Assinatura";
  const isOnSubscriptionPage = useMemo(
    () =>
      location.pathname === targetSubscriptionPath &&
      location.search === targetSubscriptionSearch,
    [location.pathname, location.search]
  );

  const canAccessOutlet = useMemo(() => {
    //Aqui é quando o usuário NÃO consegue acessar rotas que precisam de informações ou segurança.
    if (!user) return false;
    // Permite acesso se for erro de assinatura e já estiver na página de assinatura
    if (isSubscriptionError && isOnSubscriptionPage) return true;
    if (authError) return false;
    return true;
  }, [authError, user, isSubscriptionError, isOnSubscriptionPage]);
  if (!canAccessOutlet) {
    if (!user && !isLoggingOut) return <Navigate to="/login" replace />; //Se as informações do usuário não existirem, mandar para o login. #TODO: Criar endpoint para recuperar informações do usuário
    if (authError) {
      switch (authError) {
        case "REFRESH_TOKEN_EXPIRED":
          return <Navigate to="/login" replace />;
        case "REFRESH_TOKEN_REVOKED":
          return <MultipleDeviceWarning />;
        case "SUBSCRIPTION_NOT_FOUND":
        case "SUBSCRIPTION_CANCELLED":
        case "SUBSCRIPTION_NOT_ACTIVE":
          // Se já está na página de assinatura, permite renderizar (canAccessOutlet já trata isso)
          if (isOnSubscriptionPage) {
            break;
          }
          if (isColab(user as IColab) && !isLoggingOut) {
            openModal(
              <Alert type="error">
                <p className="text-beergam-typography-tertiary!">
                  A assinatura não foi encontrada. Por favor, entre em contato
                  com o suporte ou com seu administrador.
                </p>
              </Alert>,
              {
                title: "Erro ao verificar assinatura",
              }
            );
            logout();
            return;
          } else {
            return (
              <Navigate
                to={`${targetSubscriptionPath}${targetSubscriptionSearch}`}
                replace
                state={{ error: authError }}
              />
            );
          }
        // Caso contrário, navega para a página de assinatura
        case "USAGE_TIME_LIMIT":
          return <UsageTimeLimitWarning />;
      }
    }
  }
  if (ROUTES_WITHOUT_MARKETPLACE.includes(location.pathname)) {
    return <Outlet />;
  } else {
    if (!marketplace) {
      return <Navigate to="/interno/choosen_account" replace />;
    }
    return <Outlet />;
  }
}

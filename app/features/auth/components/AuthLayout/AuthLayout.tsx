import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import authStore from "~/features/store-zustand";
import { UserRoles } from "~/features/user/typings/BaseUser";
import { queryClient } from "~/lib/queryClient";
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
  const authError = useAuthError();
  const user = useAuthUser();
  const marketplace = useAuthMarketplace();
  const isLoggingOut = authStore.use.isLoggingOut();
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
          // Caso contrário, navega para a página de assinatura
          return (
            <Navigate
              to={`${targetSubscriptionPath}${targetSubscriptionSearch}`}
              replace
            />
          );
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

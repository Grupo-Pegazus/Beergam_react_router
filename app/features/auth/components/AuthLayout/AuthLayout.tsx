import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet } from "react-router";
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
  "/interno/subscription",
  "/interno/choosen_account",
  "/interno/config",
  "/interno/perfil",
];
export default function AuthLayout() {
  const authError = useAuthError();
  const user = useAuthUser();
  const marketplace = useAuthMarketplace();
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
  const canAccessOutlet = useMemo(() => {
    //Aqui é quando o usuário NÃO consegue acessar rotas que precisam de informações ou segurança.
    if (!user) return false;
    if (authError) return false;
    return true;
  }, [authError, user]);
  if (!canAccessOutlet) {
    if (!user) return <Navigate to="/login" replace />; //Se as informações do usuário não existirem, mandar para o login. #TODO: Criar endpoint para recuperar informações do usuário
    if (authError) {
      switch (authError) {
        case "REFRESH_TOKEN_EXPIRED":
          return <Navigate to="/login" replace />;
        case "REFRESH_TOKEN_REVOKED":
          return <MultipleDeviceWarning />;
        case "SUBSCRIPTION_NOT_FOUND": //Fazer verificação de se o usuário está na página de assinatura, se não estiver, mandar para a página de assinatura.
        case "SUBSCRIPTION_CANCELLED":
        case "SUBSCRIPTION_NOT_ACTIVE":
          if (window.location.pathname !== "/interno/subscription")
            return <Navigate to="/interno/subscription" replace />;
          break;
        case "USAGE_TIME_LIMIT":
          return <UsageTimeLimitWarning />;
      }
    }
  }
  if (ROUTES_WITHOUT_MARKETPLACE.includes(window.location.pathname)) {
    return <Outlet />;
  } else {
    if (!marketplace) {
      return <Navigate to="/interno/choosen_account" replace />;
    }
    return <Outlet />;
  }
}

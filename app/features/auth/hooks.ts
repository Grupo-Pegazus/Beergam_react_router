import { useRouteLoaderData } from "react-router";
import authStore from "~/features/store-zustand";
import type { IUser } from "~/features/user/typings/User";
import type { IAuthState } from "./types";

/**
 * Hook que monitora mudanças no estado de autenticação do Zustand
 * e força re-render quando há atualizações no BootstrapAuth ou
 * quando há triggers diretos (ex: refresh_token_revoked no client.ts)
 *
 * O hook prioriza os dados do Zustand (atualizados em tempo real) sobre
 * os dados do loader, garantindo que mudanças no estado sejam refletidas
 * imediatamente no componente.
 */
export function useAuth() {
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUser; authInfo?: IAuthState }
    | undefined;

  // Monitora o estado do Zustand (atualiza em tempo real e força re-render automaticamente)
  // Usa seletores otimizados para evitar re-renders desnecessários
  const error = authStore.use.error();
  const loading = authStore.use.loading();
  const success = authStore.use.success();
  const subscription = authStore.use.subscription();
  const usageLimitData = authStore.use.usageLimitData();
  const userInfoFromZustand = authStore.use.user();

  // Prioriza dados do Zustand (atualizados em tempo real) sobre os do loader
  // Os seletores do Zustand já forçam re-render quando o estado muda
  const userInfo = userInfoFromZustand ?? rootData?.userInfo;

  // Prioriza o Zustand (fonte de verdade) sobre os dados do loader
  // Só usa os dados do loader se o Zustand ainda estiver no estado inicial
  const isZustandInitialized =
    error !== null ||
    subscription !== null ||
    success !== false ||
    loading !== false;

  const authInfo: IAuthState = isZustandInitialized
    ? {
        loading,
        subscription,
        error,
        success,
        usageLimitData: usageLimitData ?? null,
      }
    : (rootData?.authInfo ?? {
        loading: false,
        subscription: null,
        error: null,
        success: false,
        usageLimitData: null,
      });

  return {
    userInfo,
    authInfo,
  };
}

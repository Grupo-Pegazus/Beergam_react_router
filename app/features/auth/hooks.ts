import { useSelector } from "react-redux";
import { useRouteLoaderData } from "react-router";
import type { IUser } from "~/features/user/typings/User";
import type { RootState } from "~/store";
import type { IAuthState } from "./redux";

/**
 * Hook que monitora mudanças no estado de autenticação do Redux
 * e força re-render quando há atualizações no BootstrapAuth ou
 * quando há triggers diretos (ex: refresh_token_revoked no client.ts)
 *
 * O hook prioriza os dados do Redux (atualizados em tempo real) sobre
 * os dados do loader, garantindo que mudanças no estado sejam refletidas
 * imediatamente no componente.
 */
export function useAuth() {
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUser; authInfo?: IAuthState }
    | undefined;

  // Monitora o estado do Redux (atualiza em tempo real e força re-render automaticamente)
  const authState = useSelector((state: RootState) => state.auth);
  const userInfoFromRedux = useSelector((state: RootState) => state.user.user);

  // Prioriza dados do Redux (atualizados em tempo real) sobre os do loader
  // O useSelector já força re-render quando o estado muda
  const userInfo = userInfoFromRedux ?? rootData?.userInfo;

  // Sempre prioriza o authState do Redux (atualizado em tempo real)
  // O Redux é a fonte de verdade após o bootstrap inicial
  // Só usa os dados do loader se o Redux ainda estiver no estado inicial
  const isReduxInitialized =
    authState.error !== null ||
    authState.subscription !== null ||
    authState.success !== false ||
    authState.loading !== false;

  const authInfo: IAuthState = isReduxInitialized
    ? {
        loading: authState.loading,
        subscription: authState.subscription,
        error: authState.error,
        success: authState.success,
      }
    : (rootData?.authInfo ?? {
        loading: false,
        subscription: null,
        error: null,
        success: false,
      });

  return {
    userInfo,
    authInfo,
    authState,
  };
}

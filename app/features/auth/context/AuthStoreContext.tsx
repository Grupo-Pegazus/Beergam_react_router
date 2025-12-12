import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { TAuthError } from "~/features/auth/types";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";

interface AuthStoreContextValue {
  error: TAuthError | null;
  user: IUser | IColab | null;
  marketplace: BaseMarketPlace | null;
  _isWithinProvider: boolean; // Flag interno para verificar se está dentro do Provider
}

interface AuthStoreProviderProps {
  initialError?: TAuthError | null;
  initialUser?: IUser | IColab | null;
  initialMarketplace?: BaseMarketPlace | null;
  children: ReactNode;
}

// Valor padrão para evitar erro quando usado fora do Provider (durante SSR/hidratação)
const defaultContextValue: AuthStoreContextValue = {
  error: null,
  user: null,
  marketplace: null,
  _isWithinProvider: false,
};

const AuthStoreContext = createContext<AuthStoreContextValue>(defaultContextValue);

export function AuthStoreProvider({
  initialError = null,
  initialUser = null,
  initialMarketplace = null,
  children,
}: AuthStoreProviderProps) {
  // Error
  const getErrorSnapshot = () => authStore.getState().error;
  const getErrorServerSnapshot = () => initialError ?? null;
  const liveError = useSyncExternalStore(
    authStore.subscribe,
    getErrorSnapshot,
    getErrorServerSnapshot
  );

  // User
  const getUserSnapshot = () => authStore.getState().user;
  const getUserServerSnapshot = () => initialUser ?? null;
  const liveUser = useSyncExternalStore(
    authStore.subscribe,
    getUserSnapshot,
    getUserServerSnapshot
  );

  // Marketplace
  const getMarketplaceSnapshot = () => authStore.getState().marketplace;
  const getMarketplaceServerSnapshot = () => initialMarketplace ?? null;
  const liveMarketplace = useSyncExternalStore(
    authStore.subscribe,
    getMarketplaceSnapshot,
    getMarketplaceServerSnapshot
  );

  const value = useMemo<AuthStoreContextValue>(
    () => ({
      error: liveError,
      user: liveUser,
      marketplace: liveMarketplace,
      _isWithinProvider: true,
    }),
    [liveError, liveUser, liveMarketplace]
  );

  return (
    <AuthStoreContext.Provider value={value}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore() {
  const context = useContext(AuthStoreContext);
  
  if (!context._isWithinProvider) {
    throw new Error("useAuthStore must be used within AuthStoreProvider");
  }
  
  // Remove o flag interno antes de retornar
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _isWithinProvider: _, ...publicContext } = context;
  return publicContext as Omit<AuthStoreContextValue, "_isWithinProvider">;
}

// Hooks específicos para facilitar o uso
export function useAuthError() {
  const { error } = useAuthStore();
  return error;
}

export function useAuthUser() {
  const { user } = useAuthStore();
  return user;
}

export function useAuthMarketplace() {
  const { marketplace } = useAuthStore();
  return marketplace;
}

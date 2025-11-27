import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { TAuthError } from "~/features/auth/redux";
import type { BaseMarketPlace } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";

interface AuthStoreContextValue {
  error: TAuthError | null;
  user: IUser | IColab | null;
  marketplace: BaseMarketPlace | null;
}

interface AuthStoreProviderProps {
  initialError?: TAuthError | null;
  initialUser?: IUser | IColab | null;
  initialMarketplace?: BaseMarketPlace | null;
  children: ReactNode;
}

const AuthStoreContext = createContext<AuthStoreContextValue | null>(null);

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
  if (!context) {
    throw new Error("useAuthStore must be used within AuthStoreProvider");
  }
  return context;
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

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import authStore from "~/features/store-zustand";

type AuthError = ReturnType<typeof authStore.getState>["error"];

interface AuthErrorProviderProps {
  initialError?: AuthError | null;
  children: ReactNode;
}

const AuthErrorContext = createContext<AuthError | null>(null);

export function AuthErrorProvider({
  initialError = null,
  children,
}: AuthErrorProviderProps) {
  const getSnapshot = () => authStore.getState().error;
  const getServerSnapshot = () => initialError ?? null;

  const liveError = useSyncExternalStore(
    authStore.subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const value = useMemo<AuthError | null>(() => {
    return liveError ?? initialError ?? null;
  }, [initialError, liveError]);

  return (
    <AuthErrorContext.Provider value={value}>
      {children}
    </AuthErrorContext.Provider>
  );
}

export function useAuthError() {
  const context = useContext(AuthErrorContext);
  return context;
}

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IAuthState, TAuthError, UsageLimitData } from "../auth/types";
import type { BaseMarketPlace } from "../marketplace/typings";
import type { MenuState } from "../menu/typings";
import type { Subscription } from "../user/typings/BaseUser";
import type { IColab } from "../user/typings/Colab";
import type { IUser } from "../user/typings/User";
import { isMaster } from "../user/utils";
import { createSelectors } from "./createSelectors";
import { createEncryptedStorage } from "./encryptedStorage";
interface IAuthStore {
  error: TAuthError | null;
  loading: boolean;
  success: boolean;
  isLoggingOut: boolean;
  subscription: Subscription | null;
  user: IUser | IColab | null;
  usageLimitData: UsageLimitData | null;
  marketplace: BaseMarketPlace | null;
  login: (
    subscription: Subscription | null,
    user: IUser | IColab | null
  ) => void;
  logout: () => void;
  setAuthError: (error: TAuthError, usageLimitData?: UsageLimitData) => void;
  setSubscription: (subscription: Subscription | null) => void;
  updateSubscription: (
    subscription: Subscription | null,
    success?: boolean,
    error?: TAuthError | null
  ) => void;
  updateAuthInfo: (auth: IAuthState) => void;
  updateColab: (colab: IColab) => void;
  createColab: (colab: IColab) => void;
  updateColabs: (colabs: Record<string, IColab>) => void;
  deleteColab: (colabPin: string) => void;
  updateAllowedViews: (allowedViews: MenuState) => void;
  updateUserDetails: (user: IUser | IColab) => void;
  // updateUserInfo: (user: IUser | IColab) => void;
  setMarketplace: (marketplace: BaseMarketPlace | null) => void;
  limparMarketplace: () => void;
}

const authBaseStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      error: null,
      loading: false,
      success: false,
      isLoggingOut: false,
      subscription: null,
      user: null,
      marketplace: null,
      usageLimitData: null,
      login: (subscription: Subscription | null, user: IUser | IColab | null, shouldClearMarketplace: boolean = true) =>
        set({
          subscription,
          user,
          loading: false,
          success: true,
          error: null,
          isLoggingOut: false,
          marketplace: shouldClearMarketplace ? null : get().marketplace,
        }),
      logout: () => {
        set({
          error: null,
          loading: false,
          success: false,
          subscription: null,
          user: null,
          marketplace: null,
          usageLimitData: null,
          isLoggingOut: true,
        });
      },
      setAuthError: (error: TAuthError, usageLimitData?: UsageLimitData) =>
        set({
          error,
          loading: false,
          // success: false,
          subscription: null,
          usageLimitData: usageLimitData ?? null,
        }),
      setSubscription: (subscription: Subscription | null) =>
        set({ subscription, loading: false, success: true, error: null }),
      updateSubscription: (
        subscription: Subscription | null,
        success: boolean = true,
        error: TAuthError | null = get().error
      ) => {
        set((state) => {
          const currentUser = state.user;
          if (currentUser?.details) {
            const updatedUser = isMaster(currentUser)
              ? ({
                  ...currentUser,
                  details: {
                    ...currentUser.details,
                    subscription,
                  },
                } as IUser)
              : ({
                  ...currentUser,
                  details: {
                    ...currentUser.details,
                    subscription,
                  },
                } as IColab);
            return {
              subscription,
              loading: false,
              success,
              error,
              user: updatedUser,
            };
          }
          return {
            subscription,
            loading: false,
            success,
            error,
          };
        });
      },
      updateAuthInfo: (auth: IAuthState) => {
        set({
          loading: auth.loading,
          subscription: auth.subscription,
          error: auth.error,
          success: auth.success,
          usageLimitData: auth.usageLimitData ?? null,
        });
      },
      updateColab: (colab: IColab) => {
        const currentUser = get().user;
        if (currentUser && isMaster(currentUser) && colab.pin) {
          const currentColabs = currentUser.colabs ?? {};
          // Garante que o colaborador existe antes de atualizar
          if (colab.pin in currentColabs) {
            const updatedColabs = {
              ...currentColabs,
              [colab.pin]: colab,
            };
            set({
              user: {
                ...currentUser,
                colabs: updatedColabs,
              },
            });
          }
        }
      },
      createColab: (colab: IColab) => {
        const currentUser = get().user;
        if (currentUser && isMaster(currentUser) && colab.pin) {
          const currentColabs = currentUser.colabs ?? {};
          // Adiciona o novo colaborador apenas se ele não existir
          if (!(colab.pin in currentColabs)) {
            const updatedColabs = {
              ...currentColabs,
              [colab.pin]: colab,
            };
            set({
              user: {
                ...currentUser,
                colabs: updatedColabs,
              },
            });
          }
        }
      },
      updateColabs: (colabs: Record<string, IColab>) => {
        const currentUser = get().user;
        if (currentUser && isMaster(currentUser)) {
          set({
            user: {
              ...currentUser,
              colabs,
            },
          });
        }
      },
      deleteColab: (colabPin: string) => {
        const currentUser = get().user;
        if (currentUser && isMaster(currentUser) && currentUser.colabs) {
          const updatedColabs = { ...currentUser.colabs };
          if (colabPin in updatedColabs) {
            delete updatedColabs[colabPin];
            set({
              user: {
                ...currentUser,
                colabs: updatedColabs,
              },
            });
          }
        }
      },
      updateAllowedViews: (allowedViews: MenuState) => {
        const currentUser = get().user;
        if (currentUser && currentUser.details) {
          const updatedUser: IUser | IColab = {
            ...currentUser,
            details: {
              ...currentUser.details,
              allowed_views: allowedViews,
            },
          } as IUser | IColab;
          set({
            user: updatedUser,
          });
        }
      },
      updateUserDetails: (user: IUser | IColab) => {
        const currentUser = get().user;
        if (!currentUser || !currentUser.details) return;

        // Garante que os tipos sejam compatíveis (ambos IUser ou ambos IColab)
        if (isMaster(currentUser) === isMaster(user)) {
          set({
            user: {
              ...currentUser,
              details: {
                ...currentUser.details,
                ...user.details,
              },
            } as IUser | IColab,
          });
        }
      },
      // updateUserInfo: (user: IUser | IColab) => {
      //   const currentUser = get().user;
      //   let auxColabs: Record<string, IColab> = {};

      //   // Preserva colaboradores existentes se o payload não tiver colaboradores
      //   if (currentUser && isMaster(currentUser)) {
      //     auxColabs = currentUser.colabs ?? {};
      //   }

      //   // Atualiza colaboradores se o payload tiver colaboradores
      //   if (isMaster(user) && user.colabs) {
      //     auxColabs = user.colabs;
      //   }

      //   const userToUpdate = isMaster(user)
      //     ? { ...user, colabs: auxColabs }
      //     : user;

      //   set({ user: userToUpdate });
      // },
      setMarketplace: (marketplace: BaseMarketPlace | null) => {
        set({ marketplace });
      },
      limparMarketplace: () => {
        set({ marketplace: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => createEncryptedStorage("auth-store")),
    }
  )
);

export default createSelectors(authBaseStore);

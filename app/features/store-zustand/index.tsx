import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TAuthError, UsageLimitData } from "../auth/redux";
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
  subscription: Subscription | null;
  user: IUser | IColab | null;
  usageLimitData: UsageLimitData | null;
  marketplace: BaseMarketPlace | null;
  login: (
    subscription: Subscription | null,
    user: IUser | IColab | null
  ) => void;
  logout: () => void;
  setAuthError: (error: TAuthError) => void;
  setSubscription: (subscription: Subscription | null) => void;
  updateColab: (colab: IColab) => void;
  createColab: (colab: IColab) => void;
  updateColabs: (colabs: Record<string, IColab>) => void;
  deleteColab: (colabPin: string) => void;
  updateAllowedViews: (allowedViews: MenuState) => void;
  updateUserDetails: (user: IUser | IColab) => void;
}

const authBaseStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      error: null,
      loading: false,
      success: false,
      subscription: null,
      user: null,
      marketplace: null,
      usageLimitData: null,
      login: (subscription: Subscription | null, user: IUser | IColab | null) =>
        set({ subscription, user, loading: false, success: true, error: null }),
      logout: () =>
        set({
          error: null,
          loading: false,
          success: false,
          subscription: null,
          user: null,
          marketplace: null,
        }),
      setAuthError: (error: TAuthError) =>
        set({ error, loading: false, success: false, subscription: null }),
      setSubscription: (subscription: Subscription | null) =>
        set({ subscription, loading: false, success: true, error: null }),
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
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => createEncryptedStorage("auth-store")),
    }
  )
);

export default createSelectors(authBaseStore);

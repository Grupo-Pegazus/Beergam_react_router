import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TAuthError, UsageLimitData } from "../auth/redux";
import type { BaseMarketPlace } from "../marketplace/typings";
import type { Subscription } from "../user/typings/BaseUser";
import type { IColab } from "../user/typings/Colab";
import type { IUser } from "../user/typings/User";
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
}

const authBaseStore = create<IAuthStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => createEncryptedStorage("auth-store")),
    }
  )
);

export default createSelectors(authBaseStore);

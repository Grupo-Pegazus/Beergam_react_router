import type { Subscription } from "react-redux";
import { create } from "zustand";
import type { TAuthError } from "../auth/redux";
import type { BaseMarketPlace } from "../marketplace/typings";
import type { IColab } from "../user/typings/Colab";
import type { IUser } from "../user/typings/User";
import { createSelectors } from "./createSelectors";

interface IAuthStore {
  error: TAuthError | null;
  loading: boolean;
  success: boolean;
  subscription: Subscription | null;
  user: IUser | IColab | null;
  marketplace: BaseMarketPlace | null;
}

const authBaseStore = create<IAuthStore>((set) => ({
  error: null,
  loading: false,
  success: false,
  subscription: null,
  user: null,
  marketplace: null,
  setError: (error: TAuthError | null) => set({ error }),
}));

export const authStore = createSelectors(authBaseStore);

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { limparMarketplaceDados } from "../marketplace/redux";
import type { Subscription } from "../user/typings/BaseUser";
import { cryptoAuth, cryptoMarketplace, cryptoUser } from "./utils";

export type TSubscriptionError =
  | "SUBSCRIPTION_NOT_FOUND"
  | "SUBSCRIPTION_NOT_ACTIVE"
  | "SUBSCRIPTION_CANCELLED";

export type TAuthError =
  | "REFRESH_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_REVOKED"
  | TSubscriptionError
  | "UNKNOWN_ERROR";

export interface IAuthState {
  loading: boolean;
  subscription: Subscription | null;
  error: TAuthError | null;
  success: boolean;
}

const initialState: IAuthState = {
  loading: false,
  subscription: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<Subscription | null>) {
      state.subscription = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
      console.log("login: ", state.error);
    },
    logout(state) {
      state.subscription = null;
      state.success = false;
      state.loading = false;
      cryptoAuth.limparDados();
      cryptoMarketplace.limparDados();
      cryptoUser.limparDados();
      limparMarketplaceDados();
    },
    updateSubscription(state, action: PayloadAction<Subscription | null>) {
      state.subscription = action.payload;
      state.error = null;
      state.success = true;
      state.loading = false;
      cryptoAuth.encriptarDados(state);
    },
    setAuthError(state, action: PayloadAction<TAuthError>) {
      state.error = action.payload;
      state.loading = false;
      state.subscription = null;
    },
    updateAuthInfo(
      state,
      action: PayloadAction<{ auth: IAuthState; shouldEncrypt?: boolean }>
    ) {
      state.loading = action.payload.auth.loading;
      state.subscription = action.payload.auth.subscription;
      state.error = action.payload.auth.error;
      state.success = action.payload.auth.success;
      if (action.payload.shouldEncrypt) {
        cryptoAuth.encriptarDados(action.payload.auth);
      }
    },
  },
});

export const {
  login,
  logout,
  updateSubscription,
  setAuthError,
  updateAuthInfo,
} = authSlice.actions;
export default authSlice.reducer;

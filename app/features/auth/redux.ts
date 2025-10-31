import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuState } from "../menu/typings";
import { type IColab } from "../user/typings/Colab";
import type { Subscription } from "../user/typings/BaseUser";
import { type IUser } from "../user/typings/User";
import { cryptoUser } from "./utils";

export interface IAuthState<T extends IColab | IUser> {
  loading: boolean;
  user: T | null;
  error: string | null;
  success: boolean;
}

const initialState: IAuthState<IColab | IUser> = {
  loading: false,
  user: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IColab | IUser>) {
      state.user = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.success = false;
      state.loading = false;
      state.error = null;
    },
    setUserViews(state, action: PayloadAction<MenuState>) {
      if (state.user) {
        state.user.allowed_views = action.payload;
      }
    },
    updateUserInfo(state, action: PayloadAction<IUser>) {
      console.log("updateUserInfo", action.payload);
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        try {
          const plainUser: IUser = JSON.parse(JSON.stringify(state.user));
          cryptoUser.encriptarDados(plainUser);
        } catch (e) {
          console.error("Falha ao encriptar dados do usuário", e);
        }
      }
    },
    updateUserSubscription(state, action: PayloadAction<Subscription | null>) {
      if (state.user && "details" in state.user) {
        const user = state.user as IUser;
        user.details.subscription = action.payload;
        try {
          const plainUser: IUser = JSON.parse(JSON.stringify(user));
          cryptoUser.encriptarDados(plainUser);
        } catch (e) {
          console.error("Falha ao encriptar dados do usuário", e);
        }
      }
    },
  },
});

export const { login, logout, setUserViews, updateUserInfo, updateUserSubscription } =
  authSlice.actions;
export default authSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuState } from "../menu/typings";
import { type IColab } from "../user/typings/Colab";
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
        cryptoUser.encriptarDados(state.user as IUser);
      }
    },
  },
});

export const { login, logout, setUserViews, updateUserInfo } =
  authSlice.actions;
export default authSlice.reducer;

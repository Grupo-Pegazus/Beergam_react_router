import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MenuState } from "../menu/typings";
import { type IBaseUser } from "../user/typings/BaseUser";
import { type IUser } from "../user/typings/User";

export interface IAuthState<T extends IBaseUser | IUser> {
  loading: boolean;
  user: T | null;
  error: string | null;
  success: boolean;
}

const initialState: IAuthState<IBaseUser | IUser> = {
  loading: false,
  user: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IBaseUser | IUser>) {
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
  },
});

export const { login, logout, setUserViews } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subscription } from "../user/typings/BaseUser";

export interface IAuthState {
  loading: boolean;
  subscription: Subscription | null;
  error: string | null;
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
    login(state, action: PayloadAction<Subscription>) {
      state.subscription = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.subscription = null;
      state.success = false;
      state.loading = false;
      state.error = null;
    },
    updateSubscription(state, action: PayloadAction<Subscription | null>) {
      state.subscription = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { login, logout, updateSubscription } = authSlice.actions;
export default authSlice.reducer;

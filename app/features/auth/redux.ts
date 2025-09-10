import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IBaseUsuario, type IUsuario } from "./user/typings";

export interface IAuthState {
  loading: boolean;
  user: IBaseUsuario | IUsuario | null;
  error: string | null;
  success: boolean;
}

const initialState: IAuthState = {
  loading: false,
  user: {} as IBaseUsuario | IUsuario | null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IBaseUsuario | IUsuario>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

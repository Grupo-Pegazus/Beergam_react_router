import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IColab } from "../user/typings/Colab";
import { type IUser } from "../user/typings/User";
import { isMaster } from "./utils";

interface IUserState {
  user: IUser | null | IColab;
}

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo(state, action: PayloadAction<IUser | IColab>) {
      state.user = action.payload;
    },
    updateColabs(state, action: PayloadAction<IColab[]>) {
      if (state.user && isMaster(state.user)) {
        state.user.colabs = action.payload;
      }
    },
  },
});

export const { updateUserInfo, updateColabs } = userSlice.actions;
export default userSlice.reducer;

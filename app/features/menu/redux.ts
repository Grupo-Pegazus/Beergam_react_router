// app/features/menu/redux.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type MenuKeys, type MenuState } from "./typings";
import { getDefaultViews } from "./utils";

const initialState: MenuState = {
  ...getDefaultViews(),
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuActive: (
      state,
      action: PayloadAction<{ key: MenuKeys; active: boolean }>
    ) => {
      state[action.payload.key].active = action.payload.active;
    },
  },
});

export const { setMenuActive } = menuSlice.actions;
export default menuSlice.reducer;

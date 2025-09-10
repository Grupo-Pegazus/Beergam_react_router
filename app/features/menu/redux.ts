// app/features/menu/redux.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getDefaultViews, type MenuKeys, type MenuState } from "./typings";

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

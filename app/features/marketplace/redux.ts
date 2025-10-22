import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BaseMarketPlace } from "./typings";

const initialState: {
  marketplace: BaseMarketPlace | null;
} = {
  marketplace: null,
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setMarketplace(state, action: PayloadAction<BaseMarketPlace | null>) {
      state.marketplace = action.payload;
    },
  },
});

export const { setMarketplace } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;

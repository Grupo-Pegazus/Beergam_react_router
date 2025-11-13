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
    limparMarketplace(state) {
      state.marketplace = null;
    },
  },
});

export const { setMarketplace, limparMarketplace } = marketplaceSlice.actions;
export const limparMarketplaceDados = () => {
  return marketplaceSlice.caseReducers.limparMarketplace;
};
export default marketplaceSlice.reducer;

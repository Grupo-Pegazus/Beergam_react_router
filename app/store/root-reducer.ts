import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/redux";
import counterReducer from "../features/counter/counterSlice";
import marketplaceReducer from "../features/marketplace/redux";
import menuReducer from "../features/menu/redux";
import userReducer from "../features/user/redux";

// Combina todos os reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  menu: menuReducer,
  auth: authReducer,
  user: userReducer,
  marketplace: marketplaceReducer,
});

export default rootReducer;

// Exporta o tipo do estado raiz
export type RootState = ReturnType<typeof rootReducer>;

// Exporta o tipo das actions
export type RootAction = Parameters<typeof rootReducer>[1];

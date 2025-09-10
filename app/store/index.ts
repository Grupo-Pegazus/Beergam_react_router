import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { type RootAction, type RootState } from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer,
});

// Exporta os tipos para uso em toda a aplicação
export type { RootAction, RootState };

// Exporta o tipo do dispatch tipado
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { type RootAction, type RootState } from "./root-reducer";

// Carregar estado persistido do localStorage
// const preloadedState = loadStateFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  // preloadedState,
});

// Salvar estado no localStorage sempre que ele mudar
// store.subscribe(() => {
//   const currentState = store.getState();
//   saveStateToLocalStorage(currentState);
// });

// Exporta os tipos para uso em toda a aplicação
export type { RootAction, RootState };

// Exporta o tipo do dispatch tipado
export type AppDispatch = typeof store.dispatch;

export default store;

import type { RootState } from "./root-reducer";

// Chave para armazenar o estado no localStorage
const PERSIST_KEY = "beergam:persist";

/**
 * Salva o estado no localStorage
 */
export const saveStateToLocalStorage = (state: RootState): void => {
  try {
    // Verificar se estamos no cliente (browser)
    if (typeof window === "undefined") {
      return;
    }

    // Filtrar apenas os slices que devem ser persistidos
    const stateToPersist = {
      auth: state.auth,
      menu: state.menu,
    };

    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem(PERSIST_KEY, serializedState);
  } catch (error) {
    console.error("Erro ao salvar estado no localStorage:", error);
  }
};

/**
 * Carrega o estado do localStorage
 */
export const loadStateFromLocalStorage = (): Partial<RootState> | undefined => {
  try {
    // Verificar se estamos no cliente (browser)
    if (typeof window === "undefined") {
      return undefined;
    }

    const serializedState = localStorage.getItem(PERSIST_KEY);
    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState) as Partial<RootState>;
  } catch (error) {
    console.error("Erro ao carregar estado do localStorage:", error);
    return undefined;
  }
};

/**
 * Limpa o estado persistido do localStorage
 */
export const clearPersistedState = (): void => {
  try {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(PERSIST_KEY);
  } catch (error) {
    console.error("Erro ao limpar estado persistido:", error);
  }
};

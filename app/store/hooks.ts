import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearPersistedState } from "../store/persistence";

export function usePersist() {
  const dispatch = useDispatch();

  const clearPersist = useCallback(() => {
    clearPersistedState();
    // Aqui você pode despachar ações para resetar o estado se necessário
    // dispatch(resetAuth());
    // dispatch(resetMenu());
  }, [dispatch]);

  return {
    clearPersist,
  };
}

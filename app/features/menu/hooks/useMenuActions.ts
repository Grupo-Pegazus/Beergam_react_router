import { useCallback } from "react";
import { type MenuKeys } from "../typings";
import { useMenuContext } from "../context/MenuContext";

export function useMenuActions() {
  const { dispatch } = useMenuContext();

  const setMenuActive = useCallback(
    (key: MenuKeys, active: boolean) => {
      dispatch({ type: "SET_MENU_ACTIVE", payload: { key, active } });
    },
    [dispatch]
  );

  const toggleOpen = useCallback(
    (path: string) => {
      dispatch({ type: "TOGGLE_OPEN", payload: { path } });
    },
    [dispatch]
  );

  const setOpen = useCallback(
    (path: string, value: boolean) => {
      dispatch({ type: "SET_OPEN", payload: { path, value } });
    },
    [dispatch]
  );

  const setCurrentSelected = useCallback(
    (path: string, value: boolean) => {
      dispatch({ type: "SET_CURRENT_SELECTED", payload: { path, value } });
    },
    [dispatch]
  );

  const setSelectedOnly = useCallback(
    (path: string) => {
      dispatch({ type: "SET_SELECTED_ONLY", payload: { path } });
    },
    [dispatch]
  );

  const closeMany = useCallback(
    (paths: string[]) => {
      dispatch({ type: "CLOSE_MANY", payload: paths });
    },
    [dispatch]
  );

  return {
    setMenuActive,
    toggleOpen,
    setOpen,
    setCurrentSelected,
    setSelectedOnly,
    closeMany,
  };
}


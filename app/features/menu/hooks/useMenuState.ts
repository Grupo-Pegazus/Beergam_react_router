import { useMemo } from "react";
import { useMenuContext } from "../context/MenuContext";

export function useMenuState() {
  const { state } = useMenuContext();

  const openKeys = useMemo(
    () =>
      Object.entries(state.open)
        .filter(([, value]) => value)
        .map(([key]) => key),
    [state.open]
  );

  return {
    views: state.views,
    open: state.open,
    currentSelected: state.currentSelected,
    openKeys,
    isExpanded: state.isExpanded,
  };
}


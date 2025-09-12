import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { setCurrentSelected, setSelectedOnly } from "./redux"; // actions do slice
import { type IMenuConfig } from "./typings";
import { findKeyPathByRoute, getRelativePath } from "./utils";

export const useActiveMenu = (menuConfig: IMenuConfig) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const path = location.pathname;

    // Redux: abre pais e marca selecionados (pais + atual)
    const { dotPath, parentDotPaths } = findKeyPathByRoute(menuConfig, path);

    if (dotPath) {
      dispatch(setSelectedOnly({ path: dotPath })); // limpa e marca o atual
      for (const p of parentDotPaths) {
        dispatch(setCurrentSelected({ path: p, value: true })); // marca cada pai
      }
    }
  }, [location.pathname, menuConfig, dispatch]);

  const isItemActive = (itemKey: string): boolean => {
    const relativePath = getRelativePath(itemKey);
    return relativePath === location.pathname;
  };

  return { currentPath: location.pathname, isItemActive };
};

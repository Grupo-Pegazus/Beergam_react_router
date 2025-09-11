import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { setCurrentSelected, setOpen, setSelectedOnly } from "./redux"; // actions do slice
import { type IMenuConfig, type IMenuItem } from "./typings";
import {
  findActiveItemAndParents,
  findKeyPathByRoute,
  getRelativePath,
} from "./utils";

export const useActiveMenu = (menuConfig: IMenuConfig) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeState, setActiveState] = useState<{
    activeItems: IMenuItem[];
  }>({ activeItems: [] });

  useEffect(() => {
    const path = location.pathname;

    // estado derivado (igual)
    const result = findActiveItemAndParents(menuConfig, path);
    const parents: IMenuItem[] = [];
    let level: Record<string, IMenuItem> = menuConfig;
    for (const key of result.parentKeys) {
      const parent = level[key];
      if (parent) {
        parents.push(parent);
        level = parent.dropdown ?? {};
      }
    }
    setActiveState({
      activeItems: result.activeItem
        ? [...parents, result.activeItem]
        : parents,
    });

    // Redux: abre pais e marca selecionados (pais + atual)
    const { dotPath, parentDotPaths } = findKeyPathByRoute(menuConfig, path);

    for (const p of parentDotPaths) {
      dispatch(setOpen({ path: p, value: true }));
    }

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

  return { currentPath: location.pathname, activeState, isItemActive };
};

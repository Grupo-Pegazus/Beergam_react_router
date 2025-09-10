import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { type IMenuConfig, type IMenuItem } from "./typings";
import { findActiveItemAndParents, getRelativePath } from "./utils";

export const useActiveMenu = (menuConfig: IMenuConfig) => {
  const location = useLocation();
  const [activeState, setActiveState] = useState<{
    activeItems: IMenuItem[];
  }>({ activeItems: [] });

  useEffect(() => {
    const updateActiveState = () => {
      const path = location.pathname;
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
    };

    updateActiveState();
  }, [location.pathname, menuConfig]);

  const isItemActive = (itemKey: string): boolean => {
    const relativePath = getRelativePath(itemKey);
    return relativePath === location.pathname;
  };

  return { currentPath: location.pathname, activeState, isItemActive };
};

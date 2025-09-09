import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import {
  findActiveItemAndParents,
  type IMenuConfig,
  type IMenuItem,
} from "./typings";

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
    return activeState.activeItems.some((item) => item.path === itemKey);
  };

  return { currentPath: location.pathname, activeState, isItemActive };
};

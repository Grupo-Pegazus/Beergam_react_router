import { useEffect } from "react";
import { useLocation } from "react-router";
import { type IMenuConfig } from "./typings";
import { findKeyPathByRoute, getRelativePath } from "./utils";
import { useMenuActions } from "./hooks/useMenuActions";

export const useActiveMenu = (menuConfig: IMenuConfig) => {
  const location = useLocation();
  const { setCurrentSelected, setSelectedOnly } = useMenuActions();

  useEffect(() => {
    const path = location.pathname;
    const { dotPath, parentDotPaths } = findKeyPathByRoute(menuConfig, path);

    if (dotPath) {
      setSelectedOnly(dotPath);
      parentDotPaths.forEach((parentPath) => {
        setCurrentSelected(parentPath, true);
      });
    }
  }, [location.pathname, menuConfig, setCurrentSelected, setSelectedOnly]);

  const isItemActive = (itemKey: string): boolean => {
    const relativePath = getRelativePath(itemKey);
    return relativePath === location.pathname;
  };

  return { currentPath: location.pathname, isItemActive };
};

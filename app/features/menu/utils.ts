import Svg from "~/src/assets/svgs";
import {
  MenuConfig,
  type IMenuConfig,
  type IMenuItem,
  type MenuKeys,
  type MenuState,
} from "./typings";

export function getDefaultViews() {
  //Função que define um valor padrão para o allowed_views do usuário
  const views: MenuState = {} as MenuState;
  for (const key in MenuConfig) {
    views[key as MenuKeys] = {
      active: true,
    };
  }
  return views;
}
export const getIcon = (iconName: keyof typeof Svg) => Svg[iconName];

// Função para encontrar o item ativo e seus pais
// Função para encontrar o item ativo e seus pais
export const findActiveItemAndParents = (
  menuConfig: IMenuConfig,
  currentPath: string
): { activeItem: IMenuItem | null; parentKeys: string[] } => {
  const parentKeys: string[] = [];

  const findInMenu = (
    menu: IMenuConfig,
    parentKey?: string
  ): IMenuItem | null => {
    for (const [key, item] of Object.entries(menu)) {
      // Se encontrou o item ativo - compara com o caminho relativo
      const relativePath = getRelativePath(key);
      if (relativePath === currentPath) {
        if (parentKey) parentKeys.push(parentKey);
        return item;
      }

      // Se tem dropdown, procura recursivamente
      if (item.dropdown) {
        const found = findInMenu(item.dropdown, key);
        if (found) {
          if (parentKey) parentKeys.push(parentKey);
          return found;
        }
      }
    }
    return null;
  };

  const activeItem = findInMenu(menuConfig);
  return { activeItem, parentKeys: parentKeys.reverse() };
};

// Função para verificar se um item está ativo
export const isItemActive = (
  itemKey: string,
  currentPath: string,
  menuConfig: IMenuConfig
): boolean => {
  const { activeItem, parentKeys } = findActiveItemAndParents(
    menuConfig,
    currentPath
  );

  // Item é ativo se for o próprio item ou um dos pais
  return itemKey === activeItem?.path || parentKeys.includes(itemKey);
};

export const DEFAULT_INTERNAL_PATH = "/interno";

export const getRelativePath = (
  itemKey: string | undefined
): string | undefined => {
  if (!itemKey) return undefined;

  const findItemPath = (
    menu: IMenuConfig,
    targetKey: string,
    parentPath: string[] = []
  ): string | undefined => {
    for (const [key, item] of Object.entries(menu)) {
      const currentPath = [...parentPath, key];

      // Se encontrou o item procurado
      if (key === targetKey) {
        const leafSegment = (item.path ?? key).replace(/^\/+/, "");
        return (
          DEFAULT_INTERNAL_PATH + "/" + [...parentPath, leafSegment].join("/")
        );
      }

      // Se tem dropdown, procura recursivamente
      if (item.dropdown) {
        const found = findItemPath(item.dropdown, targetKey, currentPath);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  return findItemPath(MenuConfig, itemKey);
};

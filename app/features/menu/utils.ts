import Svg from "~/src/assets/svgs/_index";
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
      access: true,
    };
  }
  return views;
}
export const getIcon = (iconName: keyof typeof Svg) => Svg[iconName];

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

      if (key === targetKey) {
        const leafSegment = (item.path ?? key).replace(/^\/+/, "");
        const segments = [...parentPath, leafSegment].filter(Boolean);
        return segments.length === 0
          ? DEFAULT_INTERNAL_PATH
          : DEFAULT_INTERNAL_PATH + "/" + segments.join("/");
      }

      if (item.dropdown) {
        const found = findItemPath(item.dropdown, targetKey, currentPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  return findItemPath(MenuConfig, itemKey);
};

export type KeyPathResult = {
  keyChain: string[]; // ["atendimento","mercado_livre","perguntas_ml"]
  dotPath: string | null; // "atendimento.mercado_livre.perguntas_ml"
  parentDotPaths: string[]; // ["atendimento","atendimento.mercado_livre"]
};

export const findKeyPathByRoute = (
  menu: IMenuConfig,
  currentPath: string
): KeyPathResult => {
  const chain: string[] = [];

  const dfs = (node: IMenuConfig, acc: string[]): boolean => {
    for (const [key, item] of Object.entries(node)) {
      const rel = getRelativePath(key);

      // Match exato
      if (rel === currentPath) {
        chain.push(...acc, key);
        return true;
      }

      // Match para rotas dinâmicas: verifica se currentPath começa com rel + "/"
      // e se o item tem dinamic_id configurado
      if (rel && item.dinamic_id && currentPath.startsWith(rel + "/")) {
        // Verifica se há um segmento adicional após o path base
        const remainingPath = currentPath.slice(rel.length + 1);
        // Se não há mais "/" no remainingPath, significa que é o parâmetro dinâmico
        if (remainingPath && !remainingPath.includes("/")) {
          chain.push(...acc, key);
          return true;
        }
      }

      if (item.dropdown && dfs(item.dropdown, [...acc, key])) {
        return true;
      }
    }
    return false;
  };

  const found = dfs(menu, []);
  const dotPath = found ? chain.join(".") : null;
  const parentDotPaths = found
    ? chain.slice(0, -1).map((_, i) => chain.slice(0, i + 1).join("."))
    : [];

  return { keyChain: chain, dotPath, parentDotPaths };
};

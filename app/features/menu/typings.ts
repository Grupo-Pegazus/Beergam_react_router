import Svg from "../svg_icons";
export type MenuStatus = "green" | "yellow" | "red";

export interface IMenuItem {
    path?: string;
    label: string;
    status: string;
    dropdown?: Record<string, IMenuItem>;
    icon?: keyof typeof Svg;
    target?: string;
    active?: boolean;
    dinamic_id?: string;
  }
  
export type IMenuConfig = {
    [key: string]: IMenuItem;
};

export const MenuConfig = {
    inicio: {
        label: "Início",
        status: "green",
        icon: "home",
        path: "/",
    },
    atendimento: {
        label: "Atendimento",
        status: "yellow",
        icon: "chat",
        dropdown: {
          mercado_livre: {
            label: "Mercado Livre",
            status: "yellow",
            dropdown: {
              perguntas_ml: {
                label: "Perguntas",
                status: "yellow",
                path: "/perguntas",
              },
              reclamacoes_ml: {
                label: "Reclamações",
                status: "red",
                path: "/reclamacoes",
              },
              mensagens_ml: {
                label: "Mensagens",
                status: "red",
                path: "/mensagens",
              },
            },
          },
        },
    },
    anuncios: {
        label: "Anúncios",
        status: "red",
        path: "/anuncios",
        dinamic_id: "anuncio_id",
        icon: "bag",
    }
} satisfies IMenuConfig;

export class MenuClass {
  config: IMenuConfig;
  constructor(config: IMenuConfig) {
    this.config = config;
  }
  setMenu(views: MenuState) {
    for (const key in this.config) {
      this.config[key as MenuKeys] = {
        ...this.config[key as MenuKeys],
        active: views[key as MenuKeys].active,
      };
    }
    return this.config;
  }
  getMenu() {
    return this.config;
  }
}

export const MenuHanlder = new MenuClass(MenuConfig);

export type MenuKeys = keyof typeof MenuConfig;

export interface View
  extends Record<
    MenuKeys,
    {
      //Se quiser colocar mais coisas no allowed_views do usuário bastar adicionar nessa tipagem
      active: boolean;
    }
  > {}
export type MenuState = {
  [K in MenuKeys]: View[K];
};

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

export class AllowedViews {
  constructor(views?: Partial<MenuState>) {
    Object.assign(this, { ...getDefaultViews(), ...views });
  }
}

export const getIcon = (iconName: keyof typeof Svg) => Svg[iconName];

// Função para encontrar o item ativo e seus pais
// Função para encontrar o item ativo e seus pais
export const findActiveItemAndParents = (
  menuConfig: IMenuConfig,
  currentPath: string,
): { activeItem: IMenuItem | null; parentKeys: string[] } => {
  const parentKeys: string[] = [];

  const findInMenu = (
    menu: IMenuConfig,
    parentKey?: string,
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
  menuConfig: IMenuConfig,
): boolean => {
  const { activeItem, parentKeys } = findActiveItemAndParents(
    menuConfig,
    currentPath,
  );

  // Item é ativo se for o próprio item ou um dos pais
  return itemKey === activeItem?.path || parentKeys.includes(itemKey);
};


export const DEFAULT_INTERNAL_PATH = "/interno";

export const getRelativePath = (itemKey: string | undefined): string | undefined => {
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
        return DEFAULT_INTERNAL_PATH + "/" + [...parentPath, leafSegment].join("/");
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
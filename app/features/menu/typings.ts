import Svg from "../../src/assets/svgs";
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
  isOpen?: boolean;
  currentSelected?: boolean;
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
  },
} satisfies IMenuConfig;

export class MenuClass {
  config: IMenuConfig;
  constructor(config: IMenuConfig) {
    this.config = this.applyDefaults(config);
  }
  private applyDefaults(config: IMenuConfig): IMenuConfig {
    const withDefaults = (item: IMenuItem): IMenuItem => {
      const dropdown = item.dropdown
        ? Object.fromEntries(
            Object.entries(item.dropdown).map(([k, v]) => [k, withDefaults(v)])
          )
        : undefined;
      return {
        ...item,
        isOpen: item.isOpen ?? false,
        currentSelected: item.currentSelected ?? false,
        dropdown,
      };
    };
    return Object.fromEntries(
      Object.entries(config).map(([k, v]) => [k, withDefaults(v)])
    );
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

export type View = Record<
  MenuKeys,
  {
    //Se quiser colocar mais coisas no allowed_views do usuário bastar adicionar nessa tipagem
    active: boolean;
  }
>;
export type MenuState = {
  [K in MenuKeys]: View[K];
};

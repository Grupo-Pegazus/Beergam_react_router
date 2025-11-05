import Svg from "../../src/assets/svgs";
export type MenuStatus = "green" | "yellow" | "red";

export interface IMenuItem {
  path?: string;
  label: string;
  status: string;
  dropdown?: Record<string, IMenuItem>;
  icon?: keyof typeof Svg;
  target?: string;
  access?: boolean;
  dinamic_id?: string;
  isOpen?: boolean;
  currentSelected?: boolean;
  denyColabAccess?: boolean; //Se o item é acessível para o colaborador
  launched?: boolean; //Se o item foi lançado para o usuário
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
    launched: true,
  },
  vendas: {
    label: "Vendas",
    status: "yellow",
    icon: "bag",
    path: "/vendas",
  },
  anuncios: {
    label: "Anúncios",
    status: "red",
    path: "/anuncios",
    dinamic_id: "anuncio_id",
    icon: "bag",
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
  despesas: {
    label: "Despesas",
    status: "red",
    path: "/despesas",
    icon: "bag",
  },
  rastreio: {
    label: "Rastreio",
    status: "yellow",
    path: "/rastreio",
    icon: "bag",
  },
  produtos: {
    label: "Produtos",
    status: "yellow",
    path: "/produtos",
    icon: "bag",
  },
  calculadora: {
    label: "Calculadora",
    status: "yellow",
    path: "/calculadora",
    icon: "bag",
  },
  lucratividade: {
    label: "Lucratividade",
    status: "yellow",
    path: "/lucratividade",
    icon: "bag",
  },
  networking: {
    label: "Networking",
    status: "yellow",
    path: "/networking",
    icon: "bag",
    denyColabAccess: false,
  },
  gestao_interna: {
    label: "Gestão Interna",
    status: "yellow",
    path: "/gestao_interna",
    icon: "bag",
  },
} satisfies IMenuConfig;

export const MenuViewExtraInfo: Record<
  keyof typeof MenuConfig,
  { description: string }
> = {
  inicio: {
    description: "Área de início do sistema",
  },
  vendas: {
    description: "Área de vendas do sistema",
  },
  anuncios: {
    description: "Área de anúncios do sistema",
  },
  atendimento: {
    description: "Área de atendimento do sistema",
  },
  despesas: {
    description: "Área de despesas do sistema",
  },
  rastreio: {
    description: "Área de rastreio do sistema",
  },
  produtos: {
    description: "Área de produtos do sistema",
  },
  calculadora: {
    description: "Área de calculadora do sistema",
  },
  lucratividade: {
    description: "Área de lucratividade do sistema",
  },
  networking: {
    description: "Área de networking do sistema",
  },
  gestao_interna: {
    description: "Área de gestão interna do sistema",
  },
};

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
        denyColabAccess: item.denyColabAccess ?? false,
        launched: item.launched ?? false,
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
        access: views[key as MenuKeys].access,
      };
    }
    return this.config;
  }
  getMenu() {
    return this.config;
  }
}

export const MenuHandler = new MenuClass(MenuConfig);

export type MenuKeys = keyof typeof MenuConfig;

export type View = Record<
  MenuKeys,
  {
    //Se quiser colocar mais coisas no allowed_views do usuário bastar adicionar nessa tipagem
    access: boolean;
    notifications?: number;
  }
>;
export type MenuState = {
  [K in MenuKeys]: View[K];
};

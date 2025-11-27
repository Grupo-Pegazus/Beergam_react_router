import Svg from "../../src/assets/svgs/_index";
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
    icon: "graph",
    path: "/vendas",
    launched: true,
  },
  anuncios: {
    label: "Anúncios",
    status: "green",
    path: "/anuncios",
    dinamic_id: "anuncio_id",
    icon: "bag",
    launched: true,
  },
  atendimento: {
    label: "Atendimento",
    status: "red",
    icon: "chat",
    dropdown: {
      mercado_livre: {
        label: "Mercado Livre",
        status: "red",
        dropdown: {
          perguntas_ml: {
            label: "Perguntas",
            status: "red",
            path: "/perguntas",
            launched: true,
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
    status: "red",
    path: "/rastreio",
    icon: "bag",
  },
  produtos: {
    label: "Produtos",
    status: "yellow",
    icon: "box",
    path: "/produtos",
    launched: true,
    dropdown: {
      gestao: {
        label: "Gestão",
        status: "yellow",
        path: "/gestao",
        launched: true,
      },
      cadastro: {
        label: "Cadastro",
        status: "yellow",
        dropdown: {
          cadastro_simplificado: {
            label: "Simplificado",
            status: "yellow",
            path: "/cadastro_simplificado",
            launched: true,
          },
          cadastro_completo: {
            label: "Completo",
            status: "yellow",
            path: "/cadastro_completo",
            launched: true,
          },
        }
      },
      categorias: {
        label: "Categorias",
        status: "yellow",
        path: "/categorias",
        launched: true,
      },
      atributos: {
        label: "Atributos",
        status: "yellow",
        path: "/atributos",
        launched: true,
      },
      agendamento: {
        label: "Agendamento",
        status: "yellow",
        path: "/agendamento",
        launched: true,
      },
      estoque: {
        label: "Estoque",
        status: "yellow",
        path: "/estoque",
        launched: true,
      }
    }
  },
  calculadora: {
    label: "Calculadora",
    status: "green",
    path: "/calculadora",
    icon: "calculator",
    launched: true,
  },
  lucratividade: {
    label: "Lucratividade",
    status: "red",
    path: "/lucratividade",
    icon: "bag",
  },
  networking: {
    label: "Networking",
    status: "red",
    path: "/networking",
    icon: "bag",
    denyColabAccess: false,
  },
  gestao_interna: {
    label: "Gestão Interna",
    status: "red",
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

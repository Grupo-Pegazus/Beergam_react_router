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
  showMenu?: boolean; //Se o item deve aparecer no menu ou não, por padrão é true
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
    status: "green",
    icon: "graph",
    path: "/vendas",
    dinamic_id: "venda_id",
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
    status: "yellow",
    icon: "chat",
    launched: true,
    dropdown: {
      chat: {
        label: "Chat",
        status: "yellow",
        path: "/chat",
        launched: true,
      },
      mercado_livre: {
        label: "Mercado Livre",
        status: "green",
        launched: true,
        dropdown: {
          perguntas: {
            label: "Perguntas",
            status: "green",
            path: "/perguntas",
            launched: true,
          },
          reclamacoes: {
            label: "Reclamações",
            status: "green",
            path: "/reclamacoes",
            launched: true,
          },
        },
      },
    },
  },
  produtos: {
    label: "Produtos",
    status: "green",
    icon: "box",
    launched: true,
    dropdown: {
      gestao: {
        label: "Gestão",
        status: "green",
        path: "/gestao",
        launched: true,
        dinamic_id: "product_id",
      },
      cadastro: {
        label: "Cadastro",
        status: "green",
        launched: true,
        dropdown: {
          cadastro_simplificado: {
            label: "Simplificado",
            status: "green",
            path: "/cadastro_simplificado",
            launched: true,
          },
          cadastro_completo: {
            label: "Completo",
            status: "green",
            path: "/cadastro_completo",
            launched: true,
          },
        }
      },
      categorias: {
        label: "Categorias",
        status: "green",
        path: "/categorias",
        launched: true,
      },
      atributos: {
        label: "Atributos",
        status: "green",
        path: "/atributos",
        launched: true,
      },
      agendamento: {
        label: "Agendamento",
        status: "green",
        path: "/agendamento",
        launched: true,
      },
      editar: {
        label: "Editar",
        status: "green",
        path: "/editar",
        launched: true,
        dinamic_id: "public_id_prod",
        showMenu: false,
      },
      estoque: {
        label: "Estoque",
        status: "green",
        path: "/estoque",
        launched: true,
        dinamic_id: "product_id",
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
  financeiro: {
    label: "Financeiro",
    status: "green",
    icon: "currency_dollar",
    launched: true,
    dropdown: {
      relatorio_vendas: {
        label: "Relatório de Vendas",
        status: "green",
        path: "/relatorio_vendas",
        launched: true,
      }
    }
  }
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
  produtos: {
    description: "Área de produtos do sistema",
  },
  calculadora: {
    description: "Área de calculadora do sistema",
  },
  financeiro: {
    description: "Área de financeiro do sistema",
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
        showMenu: item.showMenu ?? true,
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

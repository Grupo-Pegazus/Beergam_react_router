import { type RouteConfig, index, route, prefix, layout,type RouteConfigEntry } from "@react-router/dev/routes";


interface IMenuRoute {
    label: string
    routes: RouteConfigEntry[]
}

class MenuRoute implements IMenuRoute {
    constructor(public label: string, public routes: RouteConfigEntry[]) {
    }
}



function withPrefix(prefixPath: string, routes: RouteConfigEntry[]): RouteConfigEntry[] {
  return [...prefix(prefixPath, routes)];
}

type MenuDinamic ={
    isDinamic: boolean;
    dinamicId: string;    
}


export interface IMenuItem {
    path?: string;
    label: string;
    status: string;
    dropdown?: Record<string, IMenuItem>;
    icon?: string;
    target?: string;
    active?: boolean;
    dinamic_id?: string;
  }
  
export type IMenuConfig = {
    [key: string]: IMenuItem;
};

const MenuConfig = {
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
    }
} satisfies IMenuConfig;


export function createMenuRoutes(): RouteConfigEntry[] {
    const routes: RouteConfigEntry[] = [];
    
    function processMenuItem(key: string, item: IMenuItem, parentPath: string[] = []): RouteConfigEntry[] {
        const itemRoutes: RouteConfigEntry[] = [];
        
        if (item.path) {
            // Só cria rota se TEM path
            if (item.path === "/") {
                itemRoutes.push(index("routes/inicio/route.tsx"));
            } else {
                const routeName = item.path.replace(/^\//, '');
                console.log("routeName", routeName);
                
                if (item.dinamic_id) {
                    // Para rotas dinâmicas, cria DUAS rotas:
                    // 1. Rota estática (lista)
                    itemRoutes.push(route(routeName, `routes/${key}/route.tsx`));
                    
                    // 2. Rota dinâmica (item específico)
                    const dynamicPath = `${routeName}/:${item.dinamic_id}`;
                    itemRoutes.push(route(dynamicPath, `routes/${key}/[${item.dinamic_id}]/route.tsx`));
                } else {
                    itemRoutes.push(route(routeName, `routes/${key}/route.tsx`));
                }
            }
        }
        
        if (item.dropdown) {
            // Se tem dropdown, processa os filhos (independente de ter path ou não)
            const childRoutes: RouteConfigEntry[] = [];
            const currentPath = [...parentPath, key];
            
            Object.entries(item.dropdown).forEach(([childKey, childItem]) => {
                const childRoutesList = processMenuItem(childKey, childItem, currentPath);
                childRoutes.push(...childRoutesList);
            });
            
            if (childRoutes.length > 0) {
                itemRoutes.push(...prefix(key, childRoutes));
            }
        }
        
        return itemRoutes;
    }
    
    Object.entries(MenuConfig).forEach(([key, item]) => {
        const itemRoutes = processMenuItem(key, item);
        routes.push(...itemRoutes);
    });
    
    console.log("🎯 Rotas criadas:", routes);
    return routes;
}

export default [
    index("routes/home.tsx"),
    layout("src/components/layouts/MenuLayout.tsx", withPrefix("interno", createMenuRoutes()))
] satisfies RouteConfig;
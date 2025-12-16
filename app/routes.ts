import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { type IMenuItem, MenuHandler } from "./features/menu/typings";
function withPrefix(
  prefixPath: string,
  routes: RouteConfigEntry[]
): RouteConfigEntry[] {
  return prefix(prefixPath, routes);
}

export function createMenuRoutes(): RouteConfigEntry[] {
  const routes: RouteConfigEntry[] = [];

  function buildRoutePath(key: string, parentPath: string[]): string {
    if (parentPath.length === 0) {
      return `routes/${key}/route.tsx`;
    }
    const fullPath = [...parentPath, key].join("/");
    return `routes/${fullPath}/route.tsx`;
  }

  function processMenuItem(
    key: string,
    item: IMenuItem,
    parentPath: string[] = [],
    parentItemPath?: string
  ): RouteConfigEntry[] {
    const itemRoutes: RouteConfigEntry[] = [];

    // Não cria rota se o path do filho for igual ao path do pai
    const shouldCreateRoute = item.path && item.path !== parentItemPath;

    if (shouldCreateRoute && item.path) {
      // Só cria rota se TEM path e é diferente do pai
      if (item.path === "/") {
        itemRoutes.push(index("routes/inicio/route.tsx"));
      } else {
        const routeName = item.path.replace(/^\//, "");

        if (item.dinamic_id) {
          // Para rotas dinâmicas, cria DUAS rotas:
          // 1. Rota estática (lista) - apenas se launched !== false
          if (item.launched !== false) {
            const routePath = buildRoutePath(key, parentPath);
            itemRoutes.push(route(routeName, routePath));
          }

          // 2. Rota dinâmica (item específico) - sempre cria se tem dinamic_id
          const dynamicPath = `${routeName}/:${item.dinamic_id}`;
          const dynamicRoutePath = buildRoutePath(key, parentPath).replace(
            "/route.tsx",
            `/[${item.dinamic_id}]/route.tsx`
          );
          itemRoutes.push(route(dynamicPath, dynamicRoutePath));
        } else {
          const routePath = buildRoutePath(key, parentPath);
          itemRoutes.push(route(routeName, routePath));
        }
      }
    }

    if (item.dropdown) {
      // Se tem dropdown, processa os filhos (independente de ter path ou não)
      const childRoutes: RouteConfigEntry[] = [];
      // Sempre inclui a key atual no parentPath para construir o caminho do arquivo corretamente
      // Mesmo quando não tem path próprio, a estrutura de pastas pode incluir a chave do item
      const currentPath = [...parentPath, key];

      Object.entries(item.dropdown).forEach(([childKey, childItem]) => {
        // Se o item tem launched: false, só processa se tiver dinamic_id (rota dinâmica)
        // Isso permite ter rotas dinâmicas sem aparecer no menu
        if (childItem.launched === false && !childItem.dinamic_id) {
          return; // Pula itens ocultos sem rota dinâmica
        }
        // Passa o path do item atual como parentItemPath para os filhos
        const childRoutesList = processMenuItem(
          childKey,
          childItem,
          currentPath,
          item.path
        );
        childRoutes.push(...childRoutesList);
      });

      if (childRoutes.length > 0) {
        // Sempre prefixa as rotas filhas com a chave do item na URL quando tem dropdown
        // Isso garante que a estrutura da URL corresponda à estrutura de pastas
        itemRoutes.push(...prefix(key, childRoutes));
      }
    }

    return itemRoutes;
  }

  Object.entries(MenuHandler.getMenu())
    .filter(([, item]) => item.launched)
    .forEach(([key, item]) => {
      const itemRoutes = processMenuItem(key, item);
      routes.push(...itemRoutes);
    });

  return routes;
}

export default [
  index("routes/home/route.tsx"),
  route("login", "routes/login/route.tsx"),
  route("registro", "routes/registro/route.tsx"),
  route("termos-de-servico", "routes/termos-de-servico/route.tsx"),
  layout(
    "features/auth/components/AuthLayout/AuthLayout.tsx",
    withPrefix("interno", [
      route("subscription", "routes/subscription/route.tsx"),
      route("choosen_account", "routes/choosen_account/route.tsx"),
      route("config", "routes/config/route.tsx"),
      layout(
        "features/menu/components/layout/MenuLayout.tsx",
        createMenuRoutes()
      ),
    ])
  ),
] satisfies RouteConfig;

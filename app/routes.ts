import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { type IMenuItem, MenuConfig } from "./features/menu/typings";
function withPrefix(
  prefixPath: string,
  routes: RouteConfigEntry[]
): RouteConfigEntry[] {
  return [...prefix(prefixPath, routes)];
}

export function createMenuRoutes(): RouteConfigEntry[] {
  const routes: RouteConfigEntry[] = [];

  function processMenuItem(
    key: string,
    item: IMenuItem,
    parentPath: string[] = []
  ): RouteConfigEntry[] {
    const itemRoutes: RouteConfigEntry[] = [];

    if (item.path) {
      // Só cria rota se TEM path
      if (item.path === "/") {
        itemRoutes.push(index("routes/inicio/route.tsx"));
      } else {
        const routeName = item.path.replace(/^\//, "");

        if (item.dinamic_id) {
          // Para rotas dinâmicas, cria DUAS rotas:
          // 1. Rota estática (lista)
          itemRoutes.push(route(routeName, `routes/${key}/route.tsx`));

          // 2. Rota dinâmica (item específico)
          const dynamicPath = `${routeName}/:${item.dinamic_id}`;
          itemRoutes.push(
            route(dynamicPath, `routes/${key}/[${item.dinamic_id}]/route.tsx`)
          );
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
        const childRoutesList = processMenuItem(
          childKey,
          childItem,
          currentPath
        );
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

  return routes;
}

export default [
  index("routes/home.tsx"),
  route("login", "routes/login/route.tsx"),
  layout(
    "src/components/layouts/MenuLayout.tsx",
    withPrefix("interno", createMenuRoutes())
  ),
] satisfies RouteConfig;

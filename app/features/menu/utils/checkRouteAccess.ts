import { MenuConfig, type MenuKeys, type MenuState } from "../typings";
import { findKeyPathByRoute } from "../utils";

/**
 * Rotas especiais que sempre devem ter acesso permitido
 * (não estão no menu mas são necessárias para funcionamento do sistema)
 */
const SPECIAL_ROUTES = [
  "/interno/config",
  "/interno/config?session=Minha Assinatura",
  "/interno/choosen_account",
];

/**
 * Verifica se o usuário tem acesso à rota atual baseado nas permissões allowed_views
 * 
 * @param currentPath - O caminho atual da rota (ex: "/interno/vendas")
 * @param allowedViews - As permissões do usuário (allowed_views)
 * @returns true se o usuário tem acesso, false caso contrário
 */
export function checkRouteAccess(
  currentPath: string,
  allowedViews: MenuState | undefined
): boolean {
  if (SPECIAL_ROUTES.includes(currentPath)) {
    return true;
  }

  if (!allowedViews) {
    return false;
  }

  const { keyChain } = findKeyPathByRoute(MenuConfig, currentPath);
  
  if (keyChain.length === 0) {
    return false;
  }

  for (let i = 0; i < keyChain.length; i++) {
    const key = keyChain[i];
    const isMainMenuKey = key in allowedViews;
    
    if (isMainMenuKey) {
      const hasAccess = allowedViews[key as MenuKeys]?.access ?? false;
      
      if (!hasAccess) {
        return false;
      }
    } else {
      let ancestorHasAccess = false;
      for (let j = i - 1; j >= 0; j--) {
        const ancestorKey = keyChain[j];
        if (ancestorKey in allowedViews) {
          ancestorHasAccess = allowedViews[ancestorKey as MenuKeys]?.access ?? false;
          break;
        }
      }
      
      if (!ancestorHasAccess) {
        return false;
      }
    }
  }
  
  return true;
}


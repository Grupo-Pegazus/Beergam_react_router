import { MenuConfig, type MenuKeys, type MenuState } from "../typings";
import { findKeyPathByRoute } from "../utils";

/**
 * Rotas especiais que sempre devem ter acesso permitido
 * (não estão no menu mas são necessárias para funcionamento do sistema)
 */
const SPECIAL_ROUTES = [
  "/interno/perfil",
  "/interno/config",
  "/interno/subscription",
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
  // Rotas especiais sempre têm acesso
  if (SPECIAL_ROUTES.includes(currentPath)) {
    return true;
  }

  // Se não há permissões definidas, nega acesso por padrão (segurança)
  if (!allowedViews) {
    return false;
  }

  // Encontra qual item do menu corresponde à rota atual
  const { keyChain } = findKeyPathByRoute(MenuConfig, currentPath);
  
  // Se não encontrou nenhuma correspondência no menu, nega acesso por segurança
  // (a menos que seja uma rota especial já tratada acima)
  if (keyChain.length === 0) {
    return false;
  }

  // Verifica acesso para cada item da cadeia
  // Se algum item da cadeia não tiver acesso, nega acesso
  for (let i = 0; i < keyChain.length; i++) {
    const key = keyChain[i] as MenuKeys;
    const hasAccess = allowedViews[key]?.access ?? false;
    
    // Se encontrou um item sem acesso, nega acesso
    if (!hasAccess) {
      return false;
    }
  }
  
  // Se todos os itens da cadeia têm acesso, permite
  return true;
}


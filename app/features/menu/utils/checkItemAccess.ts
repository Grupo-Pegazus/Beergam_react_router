import { type MenuKeys, type MenuState } from "../typings";

/**
 * Verifica se um item do menu (incluindo itens aninhados) tem acesso
 * 
 * IMPORTANTE: Como o MenuState só contém as chaves principais do menu (MenuKeys),
 * itens aninhados precisam verificar o acesso do pai. Se o pai não tiver acesso,
 * o item também não terá acesso.
 * 
 * @param itemKey - A chave do item (ex: "perguntas_ml" ou "atendimento")
 * @param parentKey - A chave do pai no formato dotPath (ex: "atendimento.mercado_livre")
 * @param allowedViews - As permissões do usuário (allowed_views)
 * @returns true se o usuário tem acesso, false caso contrário
 */
export function checkItemAccess(
  itemKey: string,
  parentKey: string | undefined,
  allowedViews: MenuState | undefined
): boolean {
  if (!allowedViews) {
    return false;
  }

  // Se não tem parentKey, é um item principal do menu
  // Verifica acesso direto no MenuState
  if (!parentKey) {
    return allowedViews[itemKey as MenuKeys]?.access ?? false;
  }

  // Para itens aninhados, verifica primeiro se a chave existe no MenuState
  // Se existir e tiver acesso definido, usa esse valor
  const hasDirectAccess = allowedViews[itemKey as MenuKeys]?.access;
  
  if (hasDirectAccess === true) {
    return true;
  }
  
  if (hasDirectAccess === false) {
    return false;
  }

  // Se não tem acesso direto definido (undefined), verifica o acesso do pai
  // IMPORTANTE: Itens aninhados só herdam acesso do pai se o backend não enviar
  // permissão individual para eles. Para ter controle individual, o backend
  // precisa enviar permissões também para os itens aninhados no allowed_views.
  const parentKeys = parentKey.split(".");
  const firstParentKey = parentKeys[0] as MenuKeys;
  const parentHasAccess = allowedViews[firstParentKey]?.access ?? false;
  
  // Se o pai não tem acesso, o item também não tem
  if (!parentHasAccess) {
    return false;
  }

  // Verifica se todos os pais intermediários também têm acesso
  for (let i = 1; i < parentKeys.length; i++) {
    const intermediateKey = parentKeys[i];
    const intermediateAccess = allowedViews[intermediateKey as MenuKeys]?.access;
    // Se algum pai intermediário tiver acesso negado explicitamente, nega acesso
    if (intermediateAccess === false) {
      return false;
    }
  }

  // Se todos os pais têm acesso e o item não tem permissão individual definida,
  // herda o acesso do pai (comportamento padrão quando backend não envia permissões individuais)
  return true;
}


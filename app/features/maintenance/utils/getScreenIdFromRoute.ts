import { MenuConfig } from "../../menu/typings";
import { findKeyPathByRoute } from "../../menu/utils";
import type { TScreenId } from "../typings";

/**
 * Mapeia uma rota (pathname) para o screenId correspondente.
 * 
 * Exemplos:
 * - "/interno/anuncios" -> "anuncios"
 * - "/interno/produtos/gestao" -> "produtos.gestao"
 * - "/interno/produtos/cadastro_simplificado" -> "produtos.cadastro.cadastro_simplificado"
 * 
 * @param pathname - O caminho da rota atual (ex: "/interno/vendas")
 * @returns O screenId correspondente ou null se não encontrar
 */
export function getScreenIdFromRoute(pathname: string): TScreenId | null {
  const { dotPath } = findKeyPathByRoute(MenuConfig, pathname);
  
  if (!dotPath) {
    return null;
  }
  
  return dotPath as TScreenId;
}

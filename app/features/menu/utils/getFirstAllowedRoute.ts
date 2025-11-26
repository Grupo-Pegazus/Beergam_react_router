import { MenuConfig, type MenuKeys } from "../typings";
import { getRelativePath } from "../utils";
import { isMaster } from "~/features/user/utils";
import type { IUser } from "~/features/user/typings/User";
import type { IColab } from "~/features/user/typings/Colab";

/**
 * Encontra a primeira rota permitida para o usuário baseado nas permissões allowed_views
 * 
 * @param user - O usuário (master ou colaborador)
 * @returns A primeira rota permitida ou "/interno" como fallback
 */
export function getFirstAllowedRoute(
  user: IUser | IColab | null | undefined
): string {
  // Se não há usuário, retorna rota padrão
  if (!user) {
    return "/interno";
  }

  // Masters sempre têm acesso a tudo, então retorna início
  if (isMaster(user)) {
    return "/interno";
  }

  // Para colaboradores, verifica allowed_views
  const allowedViews = user.details?.allowed_views;
  
  if (!allowedViews) {
    // Se não há permissões definidas, retorna rota padrão
    return "/interno";
  }

  // Procura a primeira página com acesso permitido
  const menuKeys = Object.keys(MenuConfig) as MenuKeys[];
  
  for (const key of menuKeys) {
    const hasAccess = allowedViews[key]?.access ?? false;
    
    if (hasAccess) {
      const route = getRelativePath(key);
      if (route) {
        return route;
      }
    }
  }

  // Se não encontrou nenhuma página permitida, retorna rota padrão
  // (isso não deveria acontecer, mas é um fallback de segurança)
  return "/interno";
}


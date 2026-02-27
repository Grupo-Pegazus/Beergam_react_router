import type { Subscription } from "../user/typings/BaseUser";

/**
 * Rotas acessíveis para usuários no plano Free.
 * Use match exato para rotas sem sub-rotas, e prefixo com "/" no final
 * para rotas que têm sub-rotas (ex: "/interno/config/").
 *
 * ATENÇÃO: "/interno" deve ser match exato para não liberar "/interno/vendas".
 */
const FREE_EXACT_ROUTES: readonly string[] = ["/interno"];

const FREE_PREFIX_ROUTES: readonly string[] = [
  "/interno/calculadora",
  "/interno/config",
];

/**
 * Verifica se a subscription atual é do plano Free (vitalício).
 */
export function isFree(subscription: Subscription | null | undefined): boolean {
  return subscription?.is_free_plan === true;
}

/**
 * Verifica se uma rota é acessível no plano Free.
 * - Match exato para rotas raiz (ex: /interno)
 * - startsWith para rotas com sub-rotas ou query strings (ex: /interno/config?session=...)
 */
export function isFreeAllowedRoute(pathname: string): boolean {
  const exactMatch = FREE_EXACT_ROUTES.some((route) => pathname === route);
  const prefixMatch = FREE_PREFIX_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  return exactMatch || prefixMatch;
}

import { useMemo } from "react";
import { useSearchParams } from "react-router";

const DEFAULT_PARAM_KEY = "page";

type UsePageFromSearchParamsOptions = {
  /**
   * Nome do parâmetro de busca na URL.
   * @default "page"
   */
  paramKey?: string;
  /**
   * Quando informado, o `page` retornado é limitado ao intervalo [1, totalPages].
   * Útil para evitar requisições com página inválida (ex.: ?page=999).
   */
  totalPages?: number;
};

/**
 * Lê o parâmetro `page` (ou `paramKey`) da URL e retorna um número válido (≥ 1).
 * Use junto com `PaginationBar` + `syncWithUrl` para paginação sincronizada com a URL.
 *
 * @example
 * const { page } = usePageFromSearchParams({ totalPages });
 * <PaginationBar page={page} syncWithUrl onChange={...} />
 */
export function usePageFromSearchParams(
  options: UsePageFromSearchParamsOptions = {}
): { page: number } {
  const { paramKey = DEFAULT_PARAM_KEY, totalPages } = options;
  const [searchParams] = useSearchParams();

  const page = useMemo(() => {
    const raw = searchParams.get(paramKey);
    const parsed = parseInt(raw ?? "1", 10);
    const base = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    if (typeof totalPages === "number" && totalPages >= 1) {
      return Math.min(base, totalPages);
    }
    return base;
  }, [searchParams, paramKey, totalPages]);

  return { page };
}

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { marketplaceService } from "../service";
import type { ImportProgress } from "../typings";

const POLLING_INTERVAL_MS = 4000;

/**
 * Erro com "Retry" na mensagem = backend está re-tentando, não é erro final.
 * Só para polling quando é "completed" ou erro definitivo (sem retry).
 */
function isTerminalState(data: ImportProgress | null | undefined): boolean {
  if (!data) return false;
  if (data.status === "completed") return true;
  if (data.status === "error") {
    const isRetrying = data.error_message?.toLowerCase().includes("retry");
    return !isRetrying;
  }
  return false;
}

/**
 * Hook que faz polling do progresso de importação de uma conta específica.
 * Usa refetchInterval do TanStack Query para polling automático,
 * parando quando o status é terminal (completed ou erro definitivo).
 */
export function useImportProgress(
  marketplaceShopId: string | null,
  enabled = true
) {
  const queryClient = useQueryClient();
  const hasCompletedRef = useRef(false);

  const queryKey = ["importProgress", marketplaceShopId] as const;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!marketplaceShopId) return null;
      const response =
        await marketplaceService.getImportProgress(marketplaceShopId);
      if (!response.success) {
        throw new Error(
          response.message || "Erro ao buscar progresso da importação"
        );
      }
      return response.data;
    },
    enabled: enabled && !!marketplaceShopId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (isTerminalState(data)) return false;
      return POLLING_INTERVAL_MS;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    if (!query.data) return;

    if (isTerminalState(query.data) && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
    }
  }, [query.data, queryClient]);

  useEffect(() => {
    if (!enabled || !marketplaceShopId) {
      hasCompletedRef.current = false;
    }
  }, [enabled, marketplaceShopId]);

  const reset = useCallback(() => {
    hasCompletedRef.current = false;
    queryClient.removeQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    progress: query.data as ImportProgress | null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    reset,
  };
}

/**
 * Hook que gerencia o polling de progresso para MÚLTIPLAS contas em processamento.
 * Substitui o antigo useAccountPolling com dados mais ricos do import_progress.
 */
export function useImportProgressMap(accountIds: string[]) {
  const queryClient = useQueryClient();
  const completedIdsRef = useRef<Set<string>>(new Set());

  const results = useQueries({
    queries: accountIds.map((id) => ({
      queryKey: ["importProgress", id] as const,
      queryFn: async (): Promise<ImportProgress | null> => {
        const response = await marketplaceService.getImportProgress(id);
        if (!response.success) return null;
        return response.data;
      },
      enabled: !!id,
      refetchInterval: (query: {
        state: { data: ImportProgress | null | undefined };
      }) => {
        if (isTerminalState(query.state.data)) return false;
        return POLLING_INTERVAL_MS;
      },
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 2,
    })),
  });

  useEffect(() => {
    results.forEach((result, index) => {
      const id = accountIds[index];
      if (!result.data || !id) return;

      if (isTerminalState(result.data) && !completedIdsRef.current.has(id)) {
        completedIdsRef.current.add(id);
        queryClient.invalidateQueries({ queryKey: ["marketplacesAccounts"] });
      }
    });
  }, [results, accountIds, queryClient]);

  const progressMap = new Map<string, ImportProgress | null>();
  accountIds.forEach((id, index) => {
    progressMap.set(id, results[index]?.data ?? null);
  });

  return progressMap;
}

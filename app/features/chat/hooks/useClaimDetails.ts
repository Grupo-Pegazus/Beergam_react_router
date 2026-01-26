import { useQuery } from "@tanstack/react-query";
import { reclamacoesService } from "~/features/reclamacoes/service";
import type { ApiResponse } from "~/features/apiClient/typings";
import type { Claim } from "~/features/reclamacoes/typings";

/**
 * Hook para buscar detalhes de uma reclamação específica.
 * 
 * @param claimId - ID da reclamação
 * @param enabled - Se a query deve ser executada (default: true se claimId estiver presente)
 */
export function useClaimDetails(claimId?: string | null, enabled = true) {
    const shouldFetch = enabled && Boolean(claimId);

    return useQuery<ApiResponse<Claim>>({
        queryKey: ["claims", "details", claimId],
        queryFn: async () => {
            if (!claimId) throw new Error("claimId é obrigatório");
            return reclamacoesService.get(claimId);
        },
        enabled: shouldFetch,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });
}

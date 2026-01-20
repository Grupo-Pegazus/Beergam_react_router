import { useQuery } from "@tanstack/react-query";
import { reclamacoesService } from "../service";
import { ClaimsMetrics } from "./ClaimsMetrics";
import type { ClaimsInsights } from "../typings";

/**
 * Bloco compacto para o início, exibindo métricas de reclamações.
 * Mantém a consulta isolada para respeitar SRP e poder ser reutilizado.
 */
export default function ClaimsOverviewHome() {
    const { data, isLoading } = useQuery({
        queryKey: ["claims", "metrics", "home"],
        queryFn: () => reclamacoesService.getMetrics(),
        staleTime: 1000 * 60 * 5,
    });

    const insights: ClaimsInsights | undefined =
        data?.success && data.data ? data.data.insights : undefined;

    return (
        <ClaimsMetrics
            insights={insights}
            loading={isLoading}
        />
    );
}

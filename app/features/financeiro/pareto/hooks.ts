import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { ApiResponse } from "~/features/apiClient/typings";
import { paretoService } from "./service";
import type {
    ParetoChartFilters,
    ParetoChartResponse,
    ParetoTableFilters,
    ParetoTableResponse,
} from "./typings";

export function useParetoChart(filters?: ParetoChartFilters) {
    return useQuery<ApiResponse<ParetoChartResponse>>({
        queryKey: ["pareto", "chart", filters],
        queryFn: async () => {
            const res = await paretoService.getChartData(filters);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar dados do gráfico Pareto");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function useParetoTable(filters?: ParetoTableFilters) {
    return useQuery<ApiResponse<ParetoTableResponse>>({
        queryKey: ["pareto", "table", filters],
        queryFn: async () => {
            const res = await paretoService.getTableData(filters);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar tabela Pareto");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
}

export interface ParetoFiltersState {
    period_alias: ParetoChartFilters["period_alias"];
    date_from?: string;
    date_to?: string;
    top_n: number;
    sort_by: ParetoTableFilters["sort_by"];
    sort_order: ParetoTableFilters["sort_order"];
    page: number;
    per_page: number;
}

function buildDefaultFilters(initial?: Partial<ParetoFiltersState>): ParetoFiltersState {
    return {
        period_alias: "90d",
        top_n: 20,
        sort_by: "revenue",
        sort_order: "desc",
        page: 1,
        per_page: 50,
        ...initial,
    };
}

export function useParetoFilters(initial?: Partial<ParetoFiltersState>) {
    const defaultState = useMemo(() => buildDefaultFilters(initial), [initial]);
    const [filters, setFilters] = useState<ParetoFiltersState>(defaultState);
    const [appliedFilters, setAppliedFilters] = useState<ParetoFiltersState>(defaultState);

    const chartFilters = useMemo<ParetoChartFilters>(
        () => ({
            period_alias: appliedFilters.period_alias,
            date_from: appliedFilters.date_from,
            date_to: appliedFilters.date_to,
            top_n: appliedFilters.top_n,
        }),
        [appliedFilters],
    );

    const tableFilters = useMemo<ParetoTableFilters>(
        () => ({
            period_alias: appliedFilters.period_alias,
            date_from: appliedFilters.date_from,
            date_to: appliedFilters.date_to,
            page: appliedFilters.page,
            per_page: appliedFilters.per_page,
            sort_by: appliedFilters.sort_by,
            sort_order: appliedFilters.sort_order,
        }),
        [appliedFilters],
    );

    const updateFilters = useCallback((next: ParetoFiltersState) => {
        setFilters(next);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultState);
        setAppliedFilters(defaultState);
    }, [defaultState]);

    const applyFilters = useCallback(
        (next?: ParetoFiltersState) => {
            if (next) {
                setFilters(next);
                setAppliedFilters(next);
                return;
            }
            setAppliedFilters(filters);
        },
        [filters],
    );

    const setPage = useCallback((page: number) => {
        setFilters((current) => ({ ...current, page }));
        setAppliedFilters((current) => ({ ...current, page }));
    }, []);

    return {
        filters,
        setFilters: updateFilters,
        resetFilters,
        chartFilters,
        tableFilters,
        setPage,
        applyFilters,
    };
}

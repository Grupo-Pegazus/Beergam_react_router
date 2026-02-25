import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { ApiResponse } from "~/features/apiClient/typings";
import { fullSuggestionService } from "./service";
import type { FullSuggestionFilters, FullSuggestionResponse } from "./typings";

export function useFullSuggestion(filters?: FullSuggestionFilters) {
    return useQuery<ApiResponse<FullSuggestionResponse>>({
        queryKey: ["full-suggestion", "summary", filters],
        queryFn: async () => {
            const res = await fullSuggestionService.getSuggestions(filters);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar sugestões de envio FULL");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
}

function buildDefaultFilters(initial?: Partial<FullSuggestionFilters>): FullSuggestionFilters {
    return {
        coverage_days: 30,
        period_alias: "30d",
        page: 1,
        per_page: 50,
        sort_by: "abc_class",
        sort_order: "asc",
        ...initial,
    };
}

export function useFullSuggestionFilters(initial?: Partial<FullSuggestionFilters>) {
    const defaultState = useMemo(() => buildDefaultFilters(initial), [initial]);
    const [filters, setFilters] = useState<FullSuggestionFilters>(defaultState);
    const [appliedFilters, setAppliedFilters] = useState<FullSuggestionFilters>(defaultState);

    const apiFilters = useMemo(() => appliedFilters, [appliedFilters]);

    const updateFilters = useCallback((next: FullSuggestionFilters) => {
        setFilters(next);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultState);
        setAppliedFilters(defaultState);
    }, [defaultState]);

    const applyFilters = useCallback(
        (next?: FullSuggestionFilters) => {
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
        apiFilters,
        setPage,
        applyFilters,
    };
}

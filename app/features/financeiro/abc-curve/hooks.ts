import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { ApiResponse } from "~/features/apiClient/typings";
import { abcCurveService } from "./service";
import type { ABCCurveFilters, ABCCurveResponse } from "./typings";

export function useABCCurve(filters?: ABCCurveFilters) {
    return useQuery<ApiResponse<ABCCurveResponse>>({
        queryKey: ["abc-curve", "by-sku", filters],
        queryFn: async () => {
            const res = await abcCurveService.getCurveBySku(filters);
            if (!res.success) {
                throw new Error(res.message || "Erro ao buscar Curva ABC por SKU");
            }
            return res;
        },
        staleTime: 1000 * 60 * 5,
    });
}

function buildDefaultFilters(initial?: Partial<ABCCurveFilters>): ABCCurveFilters {
    return {
        period_alias: "90d",
        page: 1,
        per_page: 50,
        sort_by: "abc_class",
        sort_order: "desc",
        ...initial,
    };
}

export function useABCCurveFilters(initial?: Partial<ABCCurveFilters>) {
    const defaultState = useMemo(() => buildDefaultFilters(initial), [initial]);
    const [filters, setFilters] = useState<ABCCurveFilters>(defaultState);
    const [appliedFilters, setAppliedFilters] = useState<ABCCurveFilters>(defaultState);

    const apiFilters = useMemo(() => appliedFilters, [appliedFilters]);

    const updateFilters = useCallback((next: ABCCurveFilters) => {
        setFilters(next);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultState);
        setAppliedFilters(defaultState);
    }, [defaultState]);

    const applyFilters = useCallback(
        (next?: ABCCurveFilters) => {
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
        setFilters((current) => ({
            ...current,
            page,
        }));
        setAppliedFilters((current) => ({
            ...current,
            page,
        }));
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



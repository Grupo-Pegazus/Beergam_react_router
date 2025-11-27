import { useCallback, useMemo, useState } from "react";
import type { ProductsFilters } from "../typings";
import type { ProdutosFiltersState } from "../components/Filters/types";

function buildDefaultState(
  initial?: Partial<ProdutosFiltersState>
): ProdutosFiltersState {
  return {
    statusFilter: "all",
    registrationTypeFilter: "all",
    searchType: "title",
    per_page: 20,
    page: 1,
    sort_by: "created_at",
    sort_order: "desc",
    ...initial,
  };
}

function sanitizeFilters(
  state: ProdutosFiltersState
): Partial<ProductsFilters> {
  const apiFilters: Partial<ProductsFilters> = {};

  if (state.title) {
    apiFilters.title = state.title;
  }

  if (state.sku) {
    apiFilters.sku = state.sku;
  }

  if (state.statusFilter && state.statusFilter !== "all") {
    apiFilters.status = state.statusFilter;
  }

  if (
    state.registrationTypeFilter &&
    state.registrationTypeFilter !== "all"
  ) {
    apiFilters.registration_type = state.registrationTypeFilter;
  }

  if (state.per_page) {
    apiFilters.per_page = state.per_page;
  }

  if (state.page) {
    apiFilters.page = state.page;
  }

  if (state.sort_by) {
    apiFilters.sort_by = state.sort_by;
  }

  if (state.sort_order) {
    apiFilters.sort_order = state.sort_order;
  }

  return apiFilters;
}

export function useProdutosFilters(initial?: Partial<ProdutosFiltersState>) {
  const defaultState = useMemo(() => buildDefaultState(initial), [initial]);
  const [filters, setFilters] = useState<ProdutosFiltersState>(defaultState);
  const [appliedFilters, setAppliedFilters] =
    useState<ProdutosFiltersState>(defaultState);

  const apiFilters = useMemo(
    () => sanitizeFilters(appliedFilters),
    [appliedFilters]
  );

  const updateFilters = useCallback((next: ProdutosFiltersState) => {
    setFilters(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultState);
    setAppliedFilters(defaultState);
  }, [defaultState]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const setPage = useCallback(
    (page: number) => {
      setFilters((current) => ({
        ...current,
        page,
      }));
      setAppliedFilters((current) => ({
        ...current,
        page,
      }));
    },
    []
  );

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,
    apiFilters,
    setPage,
    applyFilters,
  };
}


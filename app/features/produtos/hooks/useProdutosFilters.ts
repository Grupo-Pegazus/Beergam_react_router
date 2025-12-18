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
    has_variations: undefined,
    per_page: 10,
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

  // Texto livre (q) - busca em SKU ou título
  if (state.q?.trim()) {
    apiFilters.q = state.q.trim();
  }

  // Nome do produto (name) - filtro específico por título
  if (state.name?.trim()) {
    apiFilters.name = state.name.trim();
  }

  // Status
  if (state.statusFilter && state.statusFilter !== "all") {
    apiFilters.status = state.statusFilter;
  }

  // Tipo de registro - converte valores do frontend para formato do backend
  if (
    state.registrationTypeFilter &&
    state.registrationTypeFilter !== "all"
  ) {
    const rt = state.registrationTypeFilter.toLowerCase();
    // Backend aceita: "simplified", "simplificado", "simples" ou "complete", "completo", "completa"
    if (rt === "simplificado") {
      apiFilters.registration_type = "simplified";
    } else if (rt === "completo") {
      apiFilters.registration_type = "complete";
    } else {
      // Mantém o valor original caso seja outro formato
      apiFilters.registration_type = state.registrationTypeFilter;
    }
  }

  // Tem variações
  if (state.has_variations !== undefined && state.has_variations !== "all") {
    apiFilters.has_variations = state.has_variations === true;
  }

  // Nome da categoria
  if (state.category_name?.trim()) {
    apiFilters.category_name = state.category_name.trim();
  }

  // Paginação
  if (state.per_page) {
    apiFilters.per_page = state.per_page;
  }

  if (state.page) {
    apiFilters.page = state.page;
  }

  // Ordenação
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


import { useCallback, useMemo, useState } from "react";
import type { AdsFilters } from "../typings";
import type { AnunciosFiltersState } from "../components/Filters/types";

function buildDefaultState(
  initial?: Partial<AnunciosFiltersState>,
): AnunciosFiltersState {
  return {
    statusFilter: "all",
    anuncioTypeFilter: "all",
    deliveryTypeFilter: "all",
    searchType: "name",
    per_page: 20,
    ...initial,
  };
}

function sanitizeFilters(state: AnunciosFiltersState): Partial<AdsFilters> {
  const apiFilters: Partial<AdsFilters> = {};

  if (state.mlb) {
    apiFilters.mlb = state.mlb;
  }

  if (state.mlbu) {
    apiFilters.mlbu = state.mlbu;
  }

  if (state.sku) {
    apiFilters.sku = state.sku;
  }

  if (state.onlyCatalog) {
    apiFilters.only_catalog = true;
  }

  if (state.name) {
    apiFilters.name = state.name;
  }

  if (state.statusFilter && state.statusFilter !== "all") {
    apiFilters.status = state.statusFilter;
  }

  if (state.ad_type) {
    apiFilters.ad_type = state.ad_type;
  } else if (state.anuncioTypeFilter && state.anuncioTypeFilter !== "all") {
    apiFilters.ad_type = state.anuncioTypeFilter === "gold_special" ? "Classico" : "Premium";
  }

  // Processar filtro FLEX (tem prioridade sobre deliveryTypeFilter)
  if (state.flex) {
    apiFilters.logistic_type = "flex";
  } else if (state.logistic_type) {
    apiFilters.logistic_type = state.logistic_type;
  }

  if (state.category) {
    apiFilters.category = state.category;
  }

  if (state.per_page) {
    apiFilters.per_page = state.per_page;
  }

  if (state.page) {
    apiFilters.page = state.page;
  }

  if (state.active_days_min !== undefined) {
    apiFilters.active_days_min = state.active_days_min;
  }

  if (state.active_days_max !== undefined) {
    apiFilters.active_days_max = state.active_days_max;
  }

  if (state.sort_by) {
    apiFilters.sort_by = state.sort_by;
  }

  if (state.sort_order) {
    apiFilters.sort_order = state.sort_order;
  }

  if (state.has_variations !== undefined) {
    apiFilters.has_variations = state.has_variations;
  }

  if (state.price_min !== undefined) apiFilters.price_min = state.price_min;
  if (state.price_max !== undefined) apiFilters.price_max = state.price_max;
  if (state.stock_min !== undefined) apiFilters.stock_min = state.stock_min;
  if (state.stock_max !== undefined) apiFilters.stock_max = state.stock_max;
  if (state.sold_quantity_min !== undefined) apiFilters.sold_quantity_min = state.sold_quantity_min;
  if (state.sold_quantity_max !== undefined) apiFilters.sold_quantity_max = state.sold_quantity_max;
  if (state.withoutSales) apiFilters.sold_quantity_max = 0;
  if (state.conversion_rate_min !== undefined) apiFilters.conversion_rate_min = state.conversion_rate_min;
  if (state.conversion_rate_max !== undefined) apiFilters.conversion_rate_max = state.conversion_rate_max;
  if (state.geral_visits_min !== undefined) apiFilters.geral_visits_min = state.geral_visits_min;
  if (state.geral_visits_max !== undefined) apiFilters.geral_visits_max = state.geral_visits_max;
  if (state.freeShippingOnly) apiFilters.free_shipping = true;
  if (state.health_score_min !== undefined) apiFilters.health_score_min = state.health_score_min;
  if (state.health_score_max !== undefined) apiFilters.health_score_max = state.health_score_max;
  if (state.experience_score_min !== undefined) apiFilters.experience_score_min = state.experience_score_min;
  if (state.experience_score_max !== undefined) apiFilters.experience_score_max = state.experience_score_max;

  return apiFilters;
}

export function useAnunciosFilters(initial?: Partial<AnunciosFiltersState>) {
  const defaultState = useMemo(() => buildDefaultState(initial), [initial]);
  const [filters, setFilters] = useState<AnunciosFiltersState>(defaultState);
  const [appliedFilters, setAppliedFilters] =
    useState<AnunciosFiltersState>(defaultState);

  const apiFilters = useMemo(
    () => sanitizeFilters(appliedFilters),
    [appliedFilters],
  );

  const updateFilters = useCallback((next: AnunciosFiltersState) => {
    setFilters(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultState);
    setAppliedFilters(defaultState);
  }, [defaultState]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

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



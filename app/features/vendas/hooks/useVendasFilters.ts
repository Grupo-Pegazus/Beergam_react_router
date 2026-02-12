import { useCallback, useMemo, useState } from "react";
import type { OrdersFilters } from "../typings";
import type { VendasFiltersState } from "../components/Filters/types";

function buildDefaultState(initial?: Partial<VendasFiltersState>): VendasFiltersState {
  return {
    statusFilter: undefined,
    searchType: "order_id",
    dateCreatedFrom: undefined,
    dateCreatedTo: undefined,
    per_page: 20,
    page: 1,
    sort_by: "date_created",
    sort_order: "desc",
    ...initial,
  };
}

function sanitizeFilters(state: VendasFiltersState): Partial<OrdersFilters> {
  const apiFilters: Partial<OrdersFilters> = {};

  if (state.order_id) {
    apiFilters.order_id = state.order_id;
  }

  if (state.sku) {
    apiFilters.sku = state.sku;
  }

  if (state.buyer_nickname) {
    apiFilters.buyer_nickname = state.buyer_nickname;
  }

  if (state.mlb) {
    apiFilters.mlb = state.mlb;
  }

  if (state.statusFilter && state.statusFilter !== "all") {
    apiFilters.status = state.statusFilter;
  }

  const shipmentStatus = state.shipment_status || 
    (state.deliveryStatusFilter && state.deliveryStatusFilter !== "all" ? state.deliveryStatusFilter : undefined);
  
  if (shipmentStatus && shipmentStatus !== "all") {
    apiFilters.shipment_status = shipmentStatus;
  }

  // Mapeamento dos valores do filtro para os valores do backend (shipping_mode)
  const deliveryTypeToShippingMode: Record<string, string | undefined> = {
    all: undefined,
    agency: "xd_drop_off",
    full: "fulfillment",
    collection: "cross_docking",
    correios: "drop_off",
    me2: "me2",
    flex: "flex",
    not_specified: "not_specified",
  };

  if (state.deliveryTypeFilter && state.deliveryTypeFilter !== "all") {
    apiFilters.shipping_mode = deliveryTypeToShippingMode[state.deliveryTypeFilter] || state.deliveryTypeFilter;
  } else if (state.shipping_mode) {
    apiFilters.shipping_mode = state.shipping_mode;
  }

  if (state.dateCreatedFrom) {
    apiFilters.date_created_from = state.dateCreatedFrom;
  }

  if (state.dateCreatedTo) {
    apiFilters.date_created_to = state.dateCreatedTo;
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

  if (state.negative_margin === true) {
    apiFilters.negative_margin = true;
  }
  if (state.missing_costs === true) {
    apiFilters.missing_costs = true;
  }
  if (state.missing_taxes === true) {
    apiFilters.missing_taxes = true;
  }

  return apiFilters;
}

export function useVendasFilters(initial?: Partial<VendasFiltersState>) {
  const defaultState = useMemo(() => buildDefaultState(initial), [initial]);
  const [filters, setFilters] = useState<VendasFiltersState>(defaultState);
  const [appliedFilters, setAppliedFilters] = useState<VendasFiltersState>(defaultState);

  const apiFilters = useMemo(() => sanitizeFilters(appliedFilters), [appliedFilters]);

  /** Filtros para exportação: sempre usa o estado atual do formulário (filters),
   * sem paginação. Assim a exportação considera os filtros que o usuário está vendo,
   * mesmo antes de clicar em "Aplicar". */
  const filtersForExport = useMemo(() => {
    const sanitized = sanitizeFilters(filters);
    delete sanitized.page;
    delete sanitized.per_page;
    return sanitized;
  }, [filters]);

  const updateFilters = useCallback((next: VendasFiltersState) => {
    setFilters(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultState);
    setAppliedFilters(defaultState);
  }, [defaultState]);

  /** 
   * Aplica os filtros. Se `newFilters` for passado, atualiza ambos os estados.
   * Isso é útil quando os filtros vêm de um componente que gerencia estado local (ex: modal).
   */
  const applyFilters = useCallback((newFilters?: VendasFiltersState) => {
    if (newFilters) {
      setFilters(newFilters);
      setAppliedFilters(newFilters);
    } else {
      setAppliedFilters(filters);
    }
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
    filtersForExport,
    setPage,
    applyFilters,
  };
}


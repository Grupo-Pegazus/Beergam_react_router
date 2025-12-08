import { useCallback, useMemo, useState } from "react";
import type {
  FiltersState,
  UseFiltersOptions,
  UseFiltersReturn,
} from "../types";

/**
 * Hook genérico para gerenciar estado de filtros
 */
export function useFilters<T extends FiltersState = FiltersState>(
  options: UseFiltersOptions<T>,
): UseFiltersReturn<T> {
  const { initialState, sanitize, onApply } = options;

  const defaultState = useMemo(() => ({ ...initialState }), [initialState]);

  const [filters, setFilters] = useState<T>(defaultState);
  const [appliedFilters, setAppliedFilters] = useState<T>(defaultState);

  const apiFilters = useMemo(() => {
    if (sanitize) {
      return sanitize(appliedFilters);
    }
    return appliedFilters as Partial<T>;
  }, [appliedFilters, sanitize]);

  const resetFilters = useCallback(() => {
    setFilters(defaultState);
    setAppliedFilters(defaultState);
  }, [defaultState]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
    if (onApply) {
      onApply(filters);
    }
  }, [filters, onApply]);

  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  return {
    filters,
    setFilters,
    resetFilters,
    appliedFilters,
    apiFilters,
    applyFilters,
    updateFilter,
  };
}


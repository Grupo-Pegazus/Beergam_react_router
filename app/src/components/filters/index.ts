/**
 * Sistema de filtros genérico e reutilizável
 * 
 * Uso básico:
 * ```tsx
 * const { filters, setFilters, resetFilters, applyFilters, apiFilters } = useFilters({
 *   initialState: { status: 'all', type: 'all' },
 *   sanitize: (state) => ({ status: state.status === 'all' ? undefined : state.status })
 * });
 * 
 * <Filters
 *   value={filters}
 *   onChange={setFilters}
 *   onReset={resetFilters}
 *   onSubmit={applyFilters}
 *   configs={[
 *     { key: 'status', label: 'Status', options: [{ label: 'Todos', value: 'all' }] },
 *     { key: 'active', label: 'Ativo', defaultValue: false }
 *   ]}
 * />
 * ```
 */

export { Filters } from "./components/Filters";
export { FilterContainer } from "./components/FilterContainer";
export { FilterSelect } from "./components/FilterSelect";
export { FilterSwitch } from "./components/FilterSwitch";
export { FilterSearchInput } from "./components/FilterSearchInput";
export { FilterActions } from "./components/FilterActions";
export { useFilters } from "./hooks/useFilters";

export type {
  FilterOption,
  FilterSelectConfig,
  FilterSwitchConfig,
  FilterCustomConfig,
  FilterConfig,
  FilterFieldProps,
  FiltersState,
  FiltersProps,
  UseFiltersOptions,
  UseFiltersReturn,
} from "./types";

export type { FilterSearchInputProps } from "./components/FilterSearchInput";


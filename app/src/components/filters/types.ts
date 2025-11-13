export type FilterOption<T = string> = {
  label: string;
  value: T;
};

export type FilterSelectConfig<T extends string = string> = {
  key: string;
  label: string;
  options: Array<FilterOption<T>>;
  defaultValue?: T;
  transform?: (value: T) => unknown;
};

export type FilterSwitchConfig = {
  key: string;
  label: string;
  defaultValue?: boolean;
};

export type FilterCustomConfig = {
  key: string;
  label: string;
  render: (props: FilterFieldProps) => React.ReactNode;
};

export type FilterConfig =
  | FilterSelectConfig
  | FilterSwitchConfig
  | FilterCustomConfig;

export interface FilterFieldProps {
  value: unknown;
  onChange: (value: unknown) => void;
  label: string;
  disabled?: boolean;
}

export interface FiltersState {
  [key: string]: unknown;
}

export interface FiltersProps<T extends FiltersState = FiltersState> {
  value: T;
  onChange: (next: T) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
  configs: Array<FilterConfig>;
  layout?: "default" | "compact" | "custom";
  showActions?: boolean;
  resetLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
}

export interface UseFiltersOptions<T extends FiltersState = FiltersState> {
  initialState: T;
  sanitize?: (state: T) => Partial<T>;
  onApply?: (state: T) => void;
}

export interface UseFiltersReturn<T extends FiltersState = FiltersState> {
  filters: T;
  setFilters: (filters: T | ((prev: T) => T)) => void;
  resetFilters: () => void;
  appliedFilters: T;
  apiFilters: Partial<T>;
  applyFilters: () => void;
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
}


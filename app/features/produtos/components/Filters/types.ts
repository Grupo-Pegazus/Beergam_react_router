import type { ProductsFilters } from "../../typings";

export type ProdutoStatusFilter = "all" | "ACTIVE" | "INACTIVE";

export type RegistrationTypeFilter = "all" | "COMPLETE" | "SIMPLIFIED";

export interface ProdutosFiltersState extends Partial<ProductsFilters> {
  statusFilter?: ProdutoStatusFilter;
  registrationTypeFilter?: RegistrationTypeFilter;
  searchType?: "title" | "sku";
  q?: string;
  name?: string;
  has_variations?: boolean | "all";
  category_name?: string;
}

export interface ProdutosFiltersProps {
  value: ProdutosFiltersState;
  onChange: (next: ProdutosFiltersState) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}


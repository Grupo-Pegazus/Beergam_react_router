import type { ProductsFilters } from "../../typings";

export type ProdutoStatusFilter = "all" | "Ativo" | "Inativo";

export type RegistrationTypeFilter = "all" | "Completo" | "Simplificado";

export interface ProdutosFiltersState extends Partial<ProductsFilters> {
  statusFilter?: ProdutoStatusFilter;
  registrationTypeFilter?: RegistrationTypeFilter;
  searchType?: "title" | "sku";
}

export interface ProdutosFiltersProps {
  value: ProdutosFiltersState;
  onChange: (next: ProdutosFiltersState) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}


import type { ProductsFilters } from "../../typings";

export type ProdutoStatusFilter = "all" | "ACTIVE" | "INACTIVE";

export type RegistrationTypeFilter = "all" | "COMPLETE" | "SIMPLIFIED";

export interface ProdutosFiltersState extends Partial<ProductsFilters> {
  statusFilter?: ProdutoStatusFilter;
  registrationTypeFilter?: RegistrationTypeFilter;
  searchType?: "title" | "sku";
  // Campos auxiliares para UI
  q?: string; // Texto livre de busca
  name?: string; // Nome do produto
  has_variations?: boolean | "all"; // "all" para "todos", boolean para filtro específico
  category_name?: string;
}

export interface ProdutosFiltersProps {
  value: ProdutosFiltersState;
  onChange: (next: ProdutosFiltersState) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}


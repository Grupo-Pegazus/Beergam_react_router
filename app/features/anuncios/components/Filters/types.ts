import type { AdsFilters } from "../../typings";

export type AnuncioStatusFilter = "all" | "active" | "paused" | "closed";
export type AnuncioTypeFilter = "all" | "gold_special" | "gold_pro";
export type DeliveryTypeFilter =
  | "all"
  | "xd_drop_off"
  | "fulfillment"
  | "cross_docking"
  | "drop_off"
  | "me2"
  | "self_service"
  | "not_specified";

export interface AnunciosFiltersState
  extends Partial<AdsFilters> {
  statusFilter?: AnuncioStatusFilter;
  anuncioTypeFilter?: AnuncioTypeFilter;
  deliveryTypeFilter?: DeliveryTypeFilter;
  searchType?: "name" | "sku" | "mlb" | "mlbu";
  sponsoredOnly?: boolean;
  onSaleOnly?: boolean;
  withoutSales?: boolean;
  freeShippingOnly?: boolean;
  onlyCatalog?: boolean;
  classification?: string;
  health_score_min?: number;
  health_score_max?: number;
  experience_score_min?: number;
  experience_score_max?: number;
}

export interface AnunciosFiltersProps {
  value: AnunciosFiltersState;
  onChange: (next: AnunciosFiltersState) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
  classificationOptions?: Array<{ label: string; value: string }>;
}



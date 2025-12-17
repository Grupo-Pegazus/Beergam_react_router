import type { OrdersFilters } from "../../typings";

export type OrderStatusFilter =
  | "all"
  | "payment_required"
  | "payment_in_process"
  | "paid"
  | "cancelled";

export type DeliveryStatusFilter =
  | "all"
  | "ready_to_ship"
  | "handling"
  | "pending"
  | "shipped"
  | "delivered"

export type DeliveryTypeFilter =
  | "all"
  | "xd_drop_off"
  | "fulfillment"
  | "cross_docking"
  | "drop_off"
  | "me2"
  | "self_service"
  | "flex"
  | "not_specified";

export interface VendasFiltersState extends Partial<OrdersFilters> {
  statusFilter?: OrderStatusFilter;
  deliveryStatusFilter?: DeliveryStatusFilter;
  deliveryTypeFilter?: DeliveryTypeFilter;
  searchType?: "order_id" | "sku" | "buyer_nickname" | "mlb";
  dateCreatedFrom?: string;
  dateCreatedTo?: string;
  shipment_status?: DeliveryStatusFilter;
}

export interface VendasFiltersProps {
  value: VendasFiltersState;
  onChange: (next: VendasFiltersState) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isSubmitting?: boolean;
}


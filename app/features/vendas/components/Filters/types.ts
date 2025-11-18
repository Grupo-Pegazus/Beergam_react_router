import type { OrdersFilters } from "../../typings";

export type OrderStatusFilter =
  | "all"
  | "confirmed"
  | "payment_required"
  | "payment_in_process"
  | "paid"
  | "cancelled";

export type DeliveryStatusFilter =
  | "all"
  | "ready_to_ship"
  | "pending"
  | "shipped"
  | "delivered"

export interface VendasFiltersState extends Partial<OrdersFilters> {
  statusFilter?: OrderStatusFilter;
  deliveryStatusFilter?: DeliveryStatusFilter;
  searchType?: "order_id" | "sku" | "buyer_nickname";
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


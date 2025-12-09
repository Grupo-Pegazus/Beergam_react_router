import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import {
  FilterContainer,
  FilterSelect,
  FilterActions,
  FilterSearchInput,
  FilterDatePicker,
} from "~/src/components/filters";
import type { VendasFiltersProps, VendasFiltersState, OrderStatusFilter, DeliveryStatusFilter, DeliveryTypeFilter } from "./types";

const STATUS_OPTIONS: Array<{ label: string; value: OrderStatusFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Pago", value: "paid" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Pagamento necessário", value: "payment_required" },
  { label: "Pagamento em processo", value: "payment_in_process" },
];

const SEARCH_TYPE_OPTIONS = [
  { label: "Por número do pedido", value: "order_id" },
  { label: "Por SKU", value: "sku" },
  { label: "Por comprador", value: "buyer_nickname" },
];

const DELIVERY_STATUS_OPTIONS: Array<{ label: string; value: DeliveryStatusFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Pronto para enviar", value: "ready_to_ship" },
  { label: "Em processamento", value: "handling" },
  { label: "Pendente", value: "pending" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregue", value: "delivered" },
];

const DELIVERY_TYPE_OPTIONS: Array<{ label: string; value: DeliveryTypeFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Agência", value: "xd_drop_off" },
  { label: "FULL", value: "fulfillment" },
  { label: "Coleta", value: "cross_docking" },
  { label: "Correios", value: "drop_off" },
  { label: "Mercado Envios", value: "me2" },
  { label: "Flex", value: "self_service" },
  { label: "Não especificado", value: "not_specified" },
];
export default function VendasFilters({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
}: VendasFiltersProps) {
  const handleFilterChange = useCallback(
    (key: string, newValue: unknown) => {
      const updated: VendasFiltersState = { 
        ...value, 
        [key]: newValue 
      } as VendasFiltersState;

      if (key === "statusFilter") {
        updated.status =
          newValue === "all" ? undefined : (newValue as OrderStatusFilter);
      }
      if (key === "deliveryStatusFilter") {
        updated.shipment_status =
          newValue === "all" ? undefined : (newValue as DeliveryStatusFilter);
      }
      if (key === "deliveryTypeFilter") {
        updated.deliveryTypeFilter =
          newValue === "all" ? undefined : (newValue as DeliveryTypeFilter);
        updated.shipping_mode =
          newValue === "all" ? undefined : newValue as DeliveryTypeFilter;
      }

      onChange(updated);
    },
    [value, onChange]
  );

  const statusValue = useMemo(
    () => (value.statusFilter ?? "all") as OrderStatusFilter,
    [value.statusFilter]
  );

  const deliveryStatusValue = useMemo(
    () => (value.deliveryStatusFilter ?? "all") as DeliveryStatusFilter,
    [value.deliveryStatusFilter]
  );

  const deliveryTypeValue = useMemo(
    () => (value.deliveryTypeFilter ?? "all") as DeliveryTypeFilter,
    [value.deliveryTypeFilter]
  );

  const currentSearchType = useMemo(() => {
    if (value.searchType) {
      return value.searchType;
    }
    if (value.order_id) return "order_id";
    if (value.sku) return "sku";
    if (value.buyer_nickname) return "buyer_nickname";
    return "order_id";
  }, [value.searchType, value.order_id, value.sku, value.buyer_nickname]);

  const searchValue = useMemo(() => {
    return value.order_id || value.sku || value.buyer_nickname || "";
  }, [value.order_id, value.sku, value.buyer_nickname]);

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      const updated = { ...value };

      if (!updated.searchType) {
        updated.searchType = currentSearchType;
      }

      delete updated.order_id;
      delete updated.sku;
      delete updated.buyer_nickname;

      if (searchTerm.trim()) {
        const typeToUse = updated.searchType || currentSearchType;
        if (typeToUse === "order_id") {
          updated.order_id = searchTerm;
        } else if (typeToUse === "sku") {
          updated.sku = searchTerm;
        } else if (typeToUse === "buyer_nickname") {
          updated.buyer_nickname = searchTerm;
        }
      } else {
        delete updated.searchType;
      }

      onChange(updated);
    },
    [value, currentSearchType, onChange]
  );

  const handleSearchTypeChange = useCallback(
    (searchType: string) => {
      const updated = { ...value };
      const currentValue = searchValue;

      updated.searchType = searchType as "order_id" | "sku" | "buyer_nickname";

      delete updated.order_id;
      delete updated.sku;
      delete updated.buyer_nickname;

      if (currentValue.trim()) {
        if (searchType === "order_id") {
          updated.order_id = currentValue;
        } else if (searchType === "sku") {
          updated.sku = currentValue;
        } else if (searchType === "buyer_nickname") {
          updated.buyer_nickname = currentValue;
        }
      }

      onChange(updated);
    },
    [value, searchValue, onChange]
  );

  const isoToDateInput = useCallback((iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const handleDateFromChange = useCallback(
    (date: string | undefined) => {
      const iso = date ? new Date(date).toISOString() : undefined;
      onChange({
        ...value,
        dateCreatedFrom: iso,
        date_created_from: iso,
      });
    },
    [value, onChange]
  );

  const handleDateToChange = useCallback(
    (date: string | undefined) => {
      const iso = date ? new Date(date).toISOString() : undefined;
      onChange({
        ...value,
        dateCreatedTo: iso,
        date_created_to: iso,
      });
    },
    [value, onChange]
  );

  const dateFromValue = useMemo(() => {
    return isoToDateInput(value.dateCreatedFrom || value.date_created_from);
  }, [isoToDateInput, value.dateCreatedFrom, value.date_created_from]);

  const dateToValue = useMemo(() => {
    return isoToDateInput(value.dateCreatedTo || value.date_created_to);
  }, [isoToDateInput, value.dateCreatedTo, value.date_created_to]);

  const sections = useMemo(
    () => [
      <Stack
        key="search-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }}>
          <FilterSearchInput
            value={searchValue}
            onChange={handleSearchChange}
            label="Pesquisar"
            placeholder="Digite para pesquisar..."
            searchType={currentSearchType}
            onSearchTypeChange={handleSearchTypeChange}
            searchTypeOptions={SEARCH_TYPE_OPTIONS}
          />
        </div>
      </Stack>,

      <Stack
        key="filters-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect
            value={statusValue}
            onChange={(newValue) => handleFilterChange("statusFilter", newValue)}
            label="Status do pedido"
            options={STATUS_OPTIONS}
            defaultValue="all"
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect
            value={deliveryStatusValue}
            onChange={(newValue) => handleFilterChange("deliveryStatusFilter", newValue)}
            label="Status da entrega"
            options={DELIVERY_STATUS_OPTIONS}
            defaultValue="all"
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect
            value={deliveryTypeValue}
            onChange={(newValue) => handleFilterChange("deliveryTypeFilter", newValue)}
            label="Forma de entrega"
            options={DELIVERY_TYPE_OPTIONS}
            defaultValue="all"
          />
        </div>
      </Stack>,
      <Stack
        key="date-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }}>
          <FilterDatePicker
            label="Data de criação (de)"
            value={dateFromValue}
            onChange={handleDateFromChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterDatePicker
            label="Data de criação (até)"
            value={dateToValue}
            onChange={handleDateToChange}
          />
        </div>
      </Stack>,
    ],
    [
      searchValue,
      currentSearchType,
      handleSearchChange,
      handleSearchTypeChange,
      statusValue,
      handleFilterChange,
      dateFromValue,
      dateToValue,
      handleDateFromChange,
      handleDateToChange,
    ]
  );

  return (
    <FilterContainer sections={sections}>
      <FilterActions
        onReset={onReset}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </FilterContainer>
  );
}


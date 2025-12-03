import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import {
  FilterContainer,
  FilterSelect,
  FilterActions,
  FilterSearchInput,
} from "~/src/components/filters";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { type Dayjs } from "dayjs";
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

  const handleDateFromChange = useCallback(
    (date: Dayjs | null) => {
      onChange({
        ...value,
        dateCreatedFrom: date ? date.toISOString() : undefined,
        date_created_from: date ? date.toISOString() : undefined,
      });
    },
    [value, onChange]
  );

  const handleDateToChange = useCallback(
    (date: Dayjs | null) => {
      onChange({
        ...value,
        dateCreatedTo: date ? date.toISOString() : undefined,
        date_created_to: date ? date.toISOString() : undefined,
      });
    },
    [value, onChange]
  );

  const dateFromValue = useMemo(() => {
    return value.dateCreatedFrom || value.date_created_from
      ? dayjs(value.dateCreatedFrom || value.date_created_from)
      : null;
  }, [value.dateCreatedFrom, value.date_created_from]);

  const dateToValue = useMemo(() => {
    return value.dateCreatedTo || value.date_created_to
      ? dayjs(value.dateCreatedTo || value.date_created_to)
      : null;
  }, [value.dateCreatedTo, value.date_created_to]);

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
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
            localeText={
              ptBR.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label="Data de criação (de)"
              value={dateFromValue}
              onChange={handleDateFromChange}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <div style={{ flex: 1 }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
            localeText={
              ptBR.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label="Data de criação (até)"
              value={dateToValue}
              onChange={handleDateToChange}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
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


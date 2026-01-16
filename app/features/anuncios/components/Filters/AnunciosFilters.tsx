import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import { FilterContainer, FilterSelect, FilterSwitch, FilterActions, FilterSearchInput } from "~/src/components/filters";
import { ActiveTimeFilter } from "./ActiveTimeFilter";
import type {
  AnunciosFiltersProps,
  AnuncioStatusFilter,
  AnuncioTypeFilter,
  DeliveryTypeFilter,
} from "./types";

const STATUS_OPTIONS: Array<{ label: string; value: AnuncioStatusFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "active" },
  { label: "Pausados", value: "paused" },
  { label: "Fechados", value: "closed" },
];

const AD_TYPE_OPTIONS: Array<{ label: string; value: AnuncioTypeFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Clássico", value: "gold_special" },
  { label: "Premium", value: "gold_pro" },
];

const DELIVERY_OPTIONS: Array<{ label: string; value: DeliveryTypeFilter }> = [
  { label: "Todas", value: "all" },
  { label: "Agência", value: "xd_drop_off" },
  { label: "FULL", value: "fulfillment" },
  { label: "Coleta", value: "cross_docking" },
  { label: "Correios", value: "drop_off" },
  { label: "Mercado Envios", value: "me2" },
  { label: "Flex", value: "self_service" },
  { label: "Não especificado", value: "not_specified" },
];

const SEARCH_TYPE_OPTIONS = [
  { label: "Por nome", value: "name" },
  { label: "Por SKU", value: "sku" },
  { label: "Por MLB", value: "mlb" },
  { label: "Por MLB-U", value: "mlbu" },
];


export default function AnunciosFilters({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
}: AnunciosFiltersProps) {
  const handleActiveTimeChange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      onChange({
        ...value,
        active_days_min: min,
        active_days_max: max,
      });
    },
    [value, onChange],
  );

  // Wrapper para onChange que aplica transformações necessárias
  const handleFilterChange = useCallback(
    (key: string, newValue: unknown) => {
      const updated = { ...value, [key]: newValue };

      // Aplicar transformações específicas
      if (key === "statusFilter") {
        updated.status =
          newValue === "all" ? undefined : (newValue as AnuncioStatusFilter);
      }

      if (key === "anuncioTypeFilter") {
        updated.ad_type =
          newValue === "all"
            ? undefined
            : (newValue as AnuncioTypeFilter);
      }

      if (key === "deliveryTypeFilter") {
        updated.logistic_type =
          newValue === "all" ? undefined : (newValue as string);
      }

      onChange(updated);
    },
    [value, onChange],
  );

  const deliveryValue = useMemo(
    () => (value.deliveryTypeFilter ?? "all") as DeliveryTypeFilter,
    [value.deliveryTypeFilter],
  );

  const statusValue = useMemo(
    () => (value.statusFilter ?? "all") as AnuncioStatusFilter,
    [value.statusFilter],
  );

  const anuncioTypeValue = useMemo(
    () => (value.anuncioTypeFilter ?? "all") as AnuncioTypeFilter,
    [value.anuncioTypeFilter],
  );

  const withoutSalesValue = useMemo(
    () => Boolean(value.withoutSales),
    [value.withoutSales],
  );

  const catalogOnlyValue = useMemo(
    () => Boolean(value.onlyCatalog),
    [value.onlyCatalog],
  );

  const currentSearchType = useMemo(() => {
    if (value.searchType) {
      return value.searchType;
    }
    if (value.name) return "name";
    if (value.sku) return "sku";
    if (value.mlb) return "mlb";
    if (value.mlbu) return "mlbu";
    return "name";
  }, [value.searchType, value.name, value.sku, value.mlb, value.mlbu]);

  const searchValue = useMemo(() => {
    return (
      value.name ||
      value.sku ||
      value.mlb ||
      value.mlbu ||
      ""
    );
  }, [value.name, value.sku, value.mlb, value.mlbu]);

  // Handler para mudança do campo de pesquisa
  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      const updated = { ...value };
      
      // Garantir que o searchType está definido
      if (!updated.searchType) {
        updated.searchType = currentSearchType;
      }

      // Limpar todos os campos de pesquisa
      delete updated.name;
      delete updated.sku;
      delete updated.mlb;
      delete updated.mlbu;

      // Definir apenas o campo do tipo atual
      if (searchTerm.trim()) {
        const typeToUse = updated.searchType || currentSearchType;
        if (typeToUse === "name") {
          updated.name = searchTerm;
        } else if (typeToUse === "sku") {
          updated.sku = searchTerm;
        } else if (typeToUse === "mlb") {
          updated.mlb = searchTerm;
        } else if (typeToUse === "mlbu") {
          updated.mlbu = searchTerm;
        }
      } else {
        // Se o campo está vazio, limpar também o searchType
        delete updated.searchType;
      }

      onChange(updated);
    },
    [value, currentSearchType, onChange],
  );

  // Handler para mudança do tipo de pesquisa
  const handleSearchTypeChange = useCallback(
    (searchType: string) => {
      const updated = { ...value };
      const currentValue = searchValue;

      // Definir o tipo de pesquisa explicitamente
      updated.searchType = searchType as "name" | "sku" | "mlb" | "mlbu";

      // Limpar todos os campos de pesquisa
      delete updated.name;
      delete updated.sku;
      delete updated.mlb;
      delete updated.mlbu;

      // Se havia um valor, aplicar no novo tipo
      if (currentValue.trim()) {
        if (searchType === "name") {
          updated.name = currentValue;
        } else if (searchType === "sku") {
          updated.sku = currentValue;
        } else if (searchType === "mlb") {
          updated.mlb = currentValue;
        } else if (searchType === "mlbu") {
          updated.mlbu = currentValue;
        }
      }

      onChange(updated);
    },
    [value, searchValue, onChange],
  );

  const sections = useMemo(
    () => [
      // Seção de pesquisa
      <Stack
        key="search-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSearchInput
            value={searchValue}
            onChange={handleSearchChange}
            label="Pesquisar"
            placeholder="Digite para pesquisar..."
            searchType={currentSearchType}
            onSearchTypeChange={handleSearchTypeChange}
            searchTypeOptions={SEARCH_TYPE_OPTIONS}
            widthType="full"
            onEnterPress={onSubmit}
          />
        </div>
      </Stack>,

      // Primeira seção: Forma de entrega + Switch
      <Stack
        key="first-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="space-between"
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect
            value={deliveryValue}
            onChange={(newValue) => handleFilterChange("deliveryTypeFilter", newValue)}
            label="Forma de entrega"
            options={DELIVERY_OPTIONS}
            defaultValue="all"
            widthType="full"
          />
        </div>
        <FilterSwitch
          value={withoutSalesValue}
          onChange={(newValue) => handleFilterChange("withoutSales", newValue)}
          label="Somente anúncios sem venda"
          defaultValue={false}
        />
        <FilterSwitch
          value={catalogOnlyValue}
          onChange={(newValue) => handleFilterChange("onlyCatalog", newValue)}
          label="Somente anúncios de catálogo"
          defaultValue={false}
        />
      </Stack>,

      // Segunda seção: Status, Tipo e Tempo
      <Stack
        key="second-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect
            value={statusValue}
            onChange={(newValue) => handleFilterChange("statusFilter", newValue)}
            label="Status do anúncio"
            options={STATUS_OPTIONS}
            defaultValue="all"
            widthType="full"
          />
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect
            value={anuncioTypeValue}
            onChange={(newValue) => handleFilterChange("anuncioTypeFilter", newValue)}
            label="Tipo do anúncio"
            options={AD_TYPE_OPTIONS}
            defaultValue="all"
            widthType="full"
          />
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <ActiveTimeFilter
            value={value}
            label="Tempo do anúncio"
            minKey="active_days_min"
            maxKey="active_days_max"
            onMinMaxChange={handleActiveTimeChange}
            widthType="full"
          />
        </div>
      </Stack>,
    ],
    [
      searchValue,
      currentSearchType,
      handleSearchChange,
      handleSearchTypeChange,
      deliveryValue,
      statusValue,
      anuncioTypeValue,
      withoutSalesValue,
      catalogOnlyValue,
      value,
      handleFilterChange,
      handleActiveTimeChange,
    ],
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

import { Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { FilterActions, FilterContainer, FilterSearchInput, FilterSelect, FilterSwitch } from "~/src/components/filters";
import { Fields } from "~/src/components/utils/_fields";
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

export const AD_TYPE_OPTIONS: Array<{ label: string; value: AnuncioTypeFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Clássico", value: "gold_special" },
  { label: "Premium", value: "gold_pro" },
];

export const DELIVERY_OPTIONS: Array<{ label: string; value: DeliveryTypeFilter }> = [
  { label: "Todas", value: "all" },
  { label: "Agência", value: "xd_drop_off" },
  { label: "FULL", value: "fulfillment" },
  { label: "Coleta", value: "cross_docking" },
  { label: "Correios", value: "drop_off" },
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

  const handlePriceChange = useCallback(
    (key: "price_min" | "price_max", numValue: number | string | undefined) => {
      const updated = { ...value };
      const parsed =
        numValue === undefined || numValue === ""
          ? undefined
          : typeof numValue === "number"
            ? numValue
            : Number(numValue);
      const final = parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;
      if (key === "price_min") updated.price_min = final;
      else if (key === "price_max") updated.price_max = final;
      onChange(updated);
    },
    [value, onChange],
  );

  const handleStockChange = useCallback(
    (key: "stock_min" | "stock_max", numValue: number | string | undefined) => {
      const updated = { ...value };
      const parsed =
        numValue === undefined || numValue === ""
          ? undefined
          : typeof numValue === "number"
            ? numValue
            : Number(numValue);
      const final = parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;
      if (key === "stock_min") updated.stock_min = final;
      else if (key === "stock_max") updated.stock_max = final;
      onChange(updated);
    },
    [value, onChange],
  );

  const handleHealthScoreChange = useCallback(
    (key: "health_score_min" | "health_score_max", numValue: number | string | undefined) => {
      const updated = { ...value };
      const parsed =
        numValue === undefined || numValue === ""
          ? undefined
          : typeof numValue === "number"
            ? numValue
            : Number(numValue);
      const final = parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;
      if (key === "health_score_min") updated.health_score_min = final;
      else if (key === "health_score_max") updated.health_score_max = final;
      onChange(updated);
    },
    [value, onChange],
  );

  const handleExperienceScoreChange = useCallback(
    (key: "experience_score_min" | "experience_score_max", numValue: number | string | undefined) => {
      const updated = { ...value };
      const parsed =
        numValue === undefined || numValue === ""
          ? undefined
          : typeof numValue === "number"
            ? numValue
            : Number(numValue);
      const final = parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;
      if (key === "experience_score_min") updated.experience_score_min = final;
      else if (key === "experience_score_max") updated.experience_score_max = final;
      onChange(updated);
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

  const priceMinValue = value.price_min;
  const priceMaxValue = value.price_max;
  const stockMinValue = value.stock_min;
  const stockMaxValue = value.stock_max;

  const healthScoreMinValue = value.health_score_min;
  const healthScoreMaxValue = value.health_score_max;
  const experienceScoreMinValue = value.experience_score_min;
  const experienceScoreMaxValue = value.experience_score_max;

  const flexValue = useMemo(
    () => Boolean(value.flex),
    [value.flex],
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
          value={flexValue}
          onChange={(newValue) => handleFilterChange("flex", newValue)}
          label="Somente anúncios FLEX"
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

      // Terceira seção: Preço e Estoque (mínimo e máximo)
      <Stack
        key="price-stock-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Preço mínimo
            </Typography>
            <Fields.numericInput
              widthType="full"
              prefix="R$"
              format="currency"
              value={priceMinValue}
              onChange={(v) => handlePriceChange("price_min", v)}
              placeholder="0,00"
              disabled={isSubmitting}
              min={0}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Preço máximo
            </Typography>
            <Fields.numericInput
              widthType="full"
              prefix="R$"
              format="currency"
              value={priceMaxValue}
              onChange={(v) => handlePriceChange("price_max", v)}
              placeholder="0,00"
              disabled={isSubmitting}
              min={0}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Estoque mínimo
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="integer"
              value={stockMinValue}
              onChange={(v) => handleStockChange("stock_min", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Estoque máximo
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="integer"
              value={stockMaxValue}
              onChange={(v) => handleStockChange("stock_max", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
      </Stack>,

      // Quarta seção: Experiência e Qualidade (mínimo e máximo)
      <Stack
        key="experience-health-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Qualidade mínima
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="decimal"
              decimalScale={2}
              value={healthScoreMinValue}
              onChange={(v) => handleHealthScoreChange("health_score_min", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              max={100}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Qualidade máxima
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="decimal"
              decimalScale={2}
              value={healthScoreMaxValue}
              onChange={(v) => handleHealthScoreChange("health_score_max", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              max={100}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Experiência mínima
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="decimal"
              decimalScale={2}
              value={experienceScoreMinValue}
              onChange={(v) => handleExperienceScoreChange("experience_score_min", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              max={100}
              tailWindClasses="rounded-3xl"
            />
          </div>
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Typography
              variant="subtitle2"
              className="text-beergam-typography-secondary"
              fontWeight={600}
            >
              Experiência máxima
            </Typography>
            <Fields.numericInput
              widthType="full"
              format="decimal"
              decimalScale={2}
              value={experienceScoreMaxValue}
              onChange={(v) => handleExperienceScoreChange("experience_score_max", v)}
              placeholder="0"
              disabled={isSubmitting}
              min={0}
              max={100}
              tailWindClasses="rounded-3xl"
            />
          </div>
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
      priceMinValue,
      priceMaxValue,
      handlePriceChange,
      stockMinValue,
      stockMaxValue,
      handleStockChange,
      healthScoreMinValue,
      healthScoreMaxValue,
      handleHealthScoreChange,
      experienceScoreMinValue,
      experienceScoreMaxValue,
      handleExperienceScoreChange,
      isSubmitting,
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

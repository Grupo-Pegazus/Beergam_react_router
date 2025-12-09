import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import {
  FilterContainer,
  FilterSelect,
  FilterActions,
  FilterSearchInput,
} from "~/src/components/filters";
import type {
  ProdutosFiltersProps,
  ProdutoStatusFilter,
  RegistrationTypeFilter,
} from "./types";

const STATUS_OPTIONS: Array<{ label: string; value: ProdutoStatusFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "ACTIVE" },
  { label: "Inativos", value: "INACTIVE" },
];

const REGISTRATION_TYPE_OPTIONS: Array<{
  label: string;
  value: RegistrationTypeFilter;
}> = [
  { label: "Todos", value: "all" },
  { label: "Completo", value: "COMPLETE" },
  { label: "Simplificado", value: "SIMPLIFIED" },
];

export default function ProdutosFilters({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
}: ProdutosFiltersProps) {
  const handleFilterChange = useCallback(
    (key: string, newValue: unknown) => {
      const updated = { ...value, [key]: newValue };

      if (key === "statusFilter") {
        updated.status =
          newValue === "all" ? undefined : (newValue as ProdutoStatusFilter);
      }

      if (key === "registrationTypeFilter") {
        updated.registration_type =
          newValue === "all"
            ? undefined
            : (newValue as RegistrationTypeFilter);
      }

      if (key === "has_variations") {
        updated.has_variations =
          newValue === "all" ? undefined : (newValue as boolean | "all");
      }

      if (key === "category_name") {
        updated.category_name =
          newValue === "" || newValue === null ? undefined : (newValue as string);
      }

      onChange(updated);
    },
    [value, onChange]
  );

  const statusValue = useMemo(
    () => (value.statusFilter ?? "all") as ProdutoStatusFilter,
    [value.statusFilter]
  );

  const registrationTypeValue = useMemo(
    () => (value.registrationTypeFilter ?? "all") as RegistrationTypeFilter,
    [value.registrationTypeFilter]
  );

  const hasVariationsValue = useMemo(
    () => (value.has_variations ?? "all") as boolean | "all",
    [value.has_variations]
  );

  const categoryNameValue = useMemo(
    () => value.category_name || "",
    [value.category_name]
  );

  // Campo de busca unificado (q) - busca em SKU ou título
  const searchValue = useMemo(() => {
    return value.q || "";
  }, [value.q]);

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      const updated = { ...value };

      if (searchTerm.trim()) {
        updated.q = searchTerm.trim();
      } else {
        delete updated.q;
      }

      delete updated.searchType;

      onChange(updated);
    },
    [value, onChange]
  );

  const sections = useMemo(
    () => [
      <Stack
        key="search-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSearchInput
            value={searchValue}
            onChange={handleSearchChange}
            label="Pesquisar (SKU ou título)"
            placeholder="Digite SKU ou título do produto..."
            fullWidth={true}
            widthType="full"
          />
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSearchInput
            value={categoryNameValue}
            onChange={(val) => handleFilterChange("category_name", val)}
            label="Categoria"
            placeholder="Digite o nome da categoria..."
            fullWidth={true}
            widthType="full"
          />
        </div>
      </Stack>,

      <Stack
        key="filters-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect
            value={statusValue}
            onChange={(newValue) => handleFilterChange("statusFilter", newValue)}
            label="Status"
            options={STATUS_OPTIONS}
            defaultValue="all"
            widthType="full"
          />
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect
            value={registrationTypeValue}
            onChange={(newValue) =>
              handleFilterChange("registrationTypeFilter", newValue)
            }
            label="Tipo de cadastro"
            options={REGISTRATION_TYPE_OPTIONS}
            defaultValue="all"
            widthType="full"
          />
        </div>
        <div style={{ flex: 1 }} className="md:w-auto w-full">
          <FilterSelect<"all" | "true" | "false">
            value={
              hasVariationsValue === "all"
                ? "all"
                : hasVariationsValue === true
                  ? "true"
                  : "false"
            }
            onChange={(newValue) => {
              const val =
                newValue === "all"
                  ? "all"
                  : newValue === "true"
                    ? true
                    : false;
              handleFilterChange("has_variations", val);
            }}
            label="Variações"
            options={[
              { label: "Todos", value: "all" },
              { label: "Com variações", value: "true" },
              { label: "Sem variações", value: "false" },
            ]}
            defaultValue="all"
            widthType="full"
          />
        </div>
      </Stack>,
    ],
    [
      searchValue,
      categoryNameValue,
      handleSearchChange,
      statusValue,
      registrationTypeValue,
      hasVariationsValue,
      handleFilterChange,
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


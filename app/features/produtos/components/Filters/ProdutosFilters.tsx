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
  { label: "Ativos", value: "Ativo" },
  { label: "Inativos", value: "Inativo" },
];

const REGISTRATION_TYPE_OPTIONS: Array<{
  label: string;
  value: RegistrationTypeFilter;
}> = [
  { label: "Todos", value: "all" },
  { label: "Completo", value: "Completo" },
  { label: "Simplificado", value: "Simplificado" },
];

const SEARCH_TYPE_OPTIONS = [
  { label: "Por título", value: "title" },
  { label: "Por SKU", value: "sku" },
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

  const currentSearchType = useMemo(() => {
    if (value.searchType) {
      return value.searchType;
    }
    if (value.title) return "title";
    if (value.sku) return "sku";
    return "title";
  }, [value.searchType, value.title, value.sku]);

  const searchValue = useMemo(() => {
    return value.title || value.sku || "";
  }, [value.title, value.sku]);

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      const updated = { ...value };

      if (!updated.searchType) {
        updated.searchType = currentSearchType;
      }

      delete updated.title;
      delete updated.sku;

      if (searchTerm.trim()) {
        const typeToUse = updated.searchType || currentSearchType;
        if (typeToUse === "title") {
          updated.title = searchTerm;
        } else if (typeToUse === "sku") {
          updated.sku = searchTerm;
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

      updated.searchType = searchType as "title" | "sku";

      delete updated.title;
      delete updated.sku;

      if (currentValue.trim()) {
        if (searchType === "title") {
          updated.title = currentValue;
        } else if (searchType === "sku") {
          updated.sku = currentValue;
        }
      }

      onChange(updated);
    },
    [value, searchValue, onChange]
  );

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
            label="Status"
            options={STATUS_OPTIONS}
            defaultValue="all"
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect
            value={registrationTypeValue}
            onChange={(newValue) =>
              handleFilterChange("registrationTypeFilter", newValue)
            }
            label="Tipo de cadastro"
            options={REGISTRATION_TYPE_OPTIONS}
            defaultValue="all"
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
      registrationTypeValue,
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


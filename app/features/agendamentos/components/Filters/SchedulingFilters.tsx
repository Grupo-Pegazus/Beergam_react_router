import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import {
  FilterContainer,
  FilterSelect,
  FilterSearchInput,
  FilterDatePicker,
} from "~/src/components/filters";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type {
  SchedulingFiltersProps,
  SchedulingTypeFilter,
  SchedulingStatusFilter,
} from "./types";
import {
  SchedulingType,
  SchedulingStatus,
} from "../../typings";

const TYPE_OPTIONS: Array<{ label: string; value: SchedulingTypeFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Entrada", value: SchedulingType.ENTRY },
  { label: "Saída", value: SchedulingType.EXIT },
];

const STATUS_OPTIONS: Array<{
  label: string;
  value: SchedulingStatusFilter;
}> = [
  { label: "Todos", value: "all" },
  { label: "Pendente", value: SchedulingStatus.PENDING },
  { label: "Confirmado", value: SchedulingStatus.CONFIRMED },
  { label: "Cancelado", value: SchedulingStatus.CANCELLED },
];

export default function SchedulingFilters({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting,
}: SchedulingFiltersProps) {

  const handleFilterChange = useCallback(
    (key: string, newValue: unknown) => {
      const updated = { ...value };

      if (key === "type") {
        updated.type =
          newValue === "all" ? undefined : (newValue as SchedulingType);
      }

      if (key === "status") {
        updated.status =
          newValue === "all" ? undefined : (newValue as SchedulingStatus);
      }

      if (key === "title") {
        updated.title =
          newValue === "" || newValue === null ? undefined : (newValue as string);
      }

      if (key === "date_from") {
        updated.date_from =
          newValue === "" || newValue === null ? undefined : (newValue as string);
      }

      if (key === "date_to") {
        updated.date_to =
          newValue === "" || newValue === null ? undefined : (newValue as string);
      }

      onChange(updated);
    },
    [value, onChange]
  );

  const typeValue = useMemo(
    () => (value.type ?? "all") as SchedulingTypeFilter,
    [value.type]
  );

  const statusValue = useMemo(
    () => (value.status ?? "all") as SchedulingStatusFilter,
    [value.status]
  );

  const titleValue = useMemo(() => value.title || "", [value.title]);

  const dateFromValue = useMemo(() => value.date_from || "", [value.date_from]);
  const dateToValue = useMemo(() => value.date_to || "", [value.date_to]);

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      const updated = { ...value };

      if (searchTerm.trim()) {
        updated.title = searchTerm.trim();
      } else {
        delete updated.title;
      }

      onChange(updated);
    },
    [value, onChange]
  );

  const handleDateChange = useCallback(
    (key: "date_from" | "date_to", dateValue: string) => {
      handleFilterChange(key, dateValue || null);
    },
    [handleFilterChange]
  );

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    } else {
      onChange({});
    }
  }, [onChange, onReset]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      value.type ||
      value.status ||
      value.title ||
      value.date_from ||
      value.date_to
    );
  }, [value]);

  return (
    <FilterContainer>
      <Stack spacing={2}>
        {/* Busca principal */}
        <FilterSearchInput
          value={titleValue}
          onChange={handleSearchChange}
          placeholder="Pesquisar por N° de pedido, nota fiscal ou destinatário..."
          disabled={isSubmitting}
          onEnterPress={onSubmit}
        />

        {/* Filtros principais */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
        >
          <FilterSelect
            label="Tipo"
            value={typeValue}
            onChange={(value) => handleFilterChange("type", value)}
            options={TYPE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            disabled={isSubmitting}
          />

          <FilterSelect
            label="Status"
            value={statusValue}
            onChange={(value) => handleFilterChange("status", value)}
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            disabled={isSubmitting}
          />
          <FilterDatePicker
            label="Data inicial"
            value={dateFromValue}
            onChange={(value) => handleDateChange("date_from", value ?? "")}
            disabled={isSubmitting}
          />

        <FilterDatePicker
          label="Data final"
          value={dateToValue}
          onChange={(value) => handleDateChange("date_to", value ?? "")}
          disabled={isSubmitting}
        />
        </Stack>


        {/* Ações */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
          justifyContent="flex-end"
        >

          {hasActiveFilters && (
            <BeergamButton
              title="Limpar Filtros"
              mainColor="beergam-gray"
              animationStyle="fade"
              onClick={handleReset}
              disabled={isSubmitting}
              type="button"
            />
          )}

          {onSubmit && (
            <BeergamButton
              title="Filtrar"
              mainColor="beergam-orange"
              animationStyle="slider"
              onClick={onSubmit}
              disabled={isSubmitting}
              type="button"
            />
          )}
        </Stack>
      </Stack>
    </FilterContainer>
  );
}


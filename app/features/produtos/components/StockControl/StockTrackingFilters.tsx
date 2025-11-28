import { useMemo, useCallback } from "react";
import { Stack } from "@mui/material";
import { FilterContainer, FilterSelect } from "~/src/components/filters";
import type { StockTrackingFilters as StockTrackingFiltersType } from "../../typings";

interface StockTrackingFiltersProps {
  value: Partial<StockTrackingFiltersType>;
  onChange: (filters: Partial<StockTrackingFiltersType>) => void;
}

const MODIFICATION_TYPE_OPTIONS: Array<{
  label: string;
  value: "ENTRY" | "EXIT" | "all";
}> = [
  { label: "Todos", value: "all" },
  { label: "Entradas", value: "ENTRY" },
  { label: "Saídas", value: "EXIT" },
];

export default function StockTrackingFilters({
  value,
  onChange,
}: StockTrackingFiltersProps) {
  const handleFilterChange = useCallback(
    (key: string, newValue: unknown) => {
      const updated = { ...value };

      if (key === "modification_type") {
        if (newValue === "all") {
          delete updated.modification_type;
        } else {
          updated.modification_type = newValue as "ENTRY" | "EXIT";
        }
      }

      onChange(updated);
    },
    [value, onChange]
  );

  const modificationTypeValue = useMemo(
    () => (value.modification_type ?? "all") as "ENTRY" | "EXIT" | "all",
    [value.modification_type]
  );

  const sections = useMemo(
    () => [
      <Stack
        key="filters-section"
        direction={{ xs: "column", md: "row" }}
        spacing={3}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect<"ENTRY" | "EXIT" | "all">
            value={modificationTypeValue}
            onChange={(newValue) =>
              handleFilterChange("modification_type", newValue)
            }
            label="Tipo de Movimentação"
            options={MODIFICATION_TYPE_OPTIONS}
            defaultValue="all"
          />
        </div>
      </Stack>,
    ],
    [modificationTypeValue, handleFilterChange]
  );

  return <FilterContainer sections={sections} />;
}


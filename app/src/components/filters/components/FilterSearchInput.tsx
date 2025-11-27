import { useCallback, useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import type { FilterOption } from "../types";
import { Fields } from "~/src/components/utils/_fields";

export interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  searchType?: string;
  onSearchTypeChange?: (type: string) => void;
  searchTypeOptions?: Array<FilterOption<string>>;
  fullWidth?: boolean;
}

export function FilterSearchInput({
  value,
  onChange,
  label,
  placeholder = "Pesquisar...",
  disabled = false,
  searchType,
  onSearchTypeChange,
  searchTypeOptions,
  fullWidth = true,
}: FilterSearchInputProps) {
  const currentSearchType = useMemo(
    () => searchType ?? searchTypeOptions?.[0]?.value ?? "",
    [searchType, searchTypeOptions],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  const handleSearchTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onSearchTypeChange) {
        onSearchTypeChange(event.target.value);
      }
    },
    [onSearchTypeChange],
  );

  const hasSearchType = Boolean(searchTypeOptions && searchTypeOptions.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      )}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "flex-start" }}
      >
        <Fields.input
          value={value ?? ""}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          tailWindClasses="rounded-3xl"
        />
        {hasSearchType && (
          <Fields.select
            value={currentSearchType}
            onChange={handleSearchTypeChange}
            disabled={disabled}
            options={searchTypeOptions?.map((opt) => ({ value: opt.value, label: opt.label })) || []}
            tailWindClasses="rounded-3xl w-full sm:w-auto sm:min-w-[180px]"
          />
        )}
      </Stack>
    </div>
  );
}

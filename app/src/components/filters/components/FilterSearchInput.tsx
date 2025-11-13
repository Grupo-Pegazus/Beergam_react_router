import { useCallback, useMemo } from "react";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { FilterOption } from "../types";

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <TextField
          fullWidth
          value={value ?? ""}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#fff",
            },
          }}
        />
        {hasSearchType && (
          <TextField
            select
            value={currentSearchType}
            onChange={handleSearchTypeChange}
            disabled={disabled}
            size="small"
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: 180 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#fff",
              },
            }}
          >
            {searchTypeOptions?.map((option) => (
              <MenuItem key={String(option.value)} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>
    </div>
  );
}

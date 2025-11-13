import { useCallback, useMemo, type ReactElement } from "react";
import { Stack } from "@mui/material";
import { FilterContainer } from "./FilterContainer";
import { FilterSelect } from "./FilterSelect";
import { FilterSwitch } from "./FilterSwitch";
import { FilterActions } from "./FilterActions";
import type {
  FiltersProps,
  FiltersState,
  FilterConfig,
  FilterSelectConfig,
  FilterSwitchConfig,
  FilterCustomConfig,
} from "../types";

/**
 * Componente principal de filtros genérico e reutilizável
 * Seguindo princípios SOLID:
 * - Single Responsibility: renderiza filtros baseado em configuração
 * - Open/Closed: extensível via FilterCustomConfig
 * - Dependency Inversion: depende de abstrações (FilterConfig)
 */
export function Filters<T extends FiltersState = FiltersState>({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting = false,
  configs,
  layout = "default",
  showActions = true,
  resetLabel,
  submitLabel,
  submittingLabel,
}: FiltersProps<T>) {
  const updateFilter = useCallback(
    (key: string, newValue: unknown) => {
      onChange({
        ...value,
        [key]: newValue,
      } as T);
    },
    [value, onChange],
  );

  const renderFilter = useCallback(
    (config: FilterConfig) => {
      const filterValue = value[config.key];
      const fieldProps = {
        value: filterValue,
        onChange: (newValue: unknown) => updateFilter(config.key, newValue),
        label: config.label,
      };

      if ("options" in config) {
        const selectConfig = config as FilterSelectConfig;
        return (
          <FilterSelect
            {...fieldProps}
            options={selectConfig.options}
            defaultValue={selectConfig.defaultValue}
          />
        );
      }

      if ("render" in config) {
        const customConfig = config as FilterCustomConfig;
        return customConfig.render(fieldProps);
      }

      const switchConfig = config as FilterSwitchConfig;
      return (
        <FilterSwitch
          {...fieldProps}
          defaultValue={switchConfig.defaultValue}
        />
      );
    },
    [value, updateFilter],
  );

  const sections = useMemo(() => {
    if (layout === "compact") {
      return [
        <Stack
          key="filters"
          direction={{ xs: "column", md: "row" }}
          spacing={3}
        >
          {configs.map((config) => (
            <div key={config.key} style={{ flex: 1 }}>
              {renderFilter(config)}
            </div>
          ))}
        </Stack>,
      ];
    }

    // Layout padrão: agrupa em seções lógicas
    const selectConfigs = configs.filter(
      (c): c is FilterSelectConfig => "options" in c,
    );
    const switchConfigs = configs.filter(
      (c): c is FilterSwitchConfig => !("options" in c) && !("render" in c),
    );
    const customConfigs = configs.filter(
      (c): c is FilterCustomConfig => "render" in c,
    );

    const sections: Array<ReactElement> = [];

    if (selectConfigs.length > 0 || customConfigs.length > 0) {
      sections.push(
        <Stack
          key="selects"
          direction={{ xs: "column", md: "row" }}
          spacing={3}
        >
          {selectConfigs.map((config) => (
            <div key={config.key} style={{ flex: 1 }}>
              {renderFilter(config)}
            </div>
          ))}
          {customConfigs.map((config) => (
            <div key={config.key} style={{ flex: 1 }}>
              {renderFilter(config)}
            </div>
          ))}
        </Stack>,
      );
    }

    if (switchConfigs.length > 0) {
      sections.push(
        <Stack
          key="switches"
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
        >
          {switchConfigs.map((config) => (
            <div key={config.key}>{renderFilter(config)}</div>
          ))}
        </Stack>,
      );
    }

    return sections;
  }, [configs, layout, renderFilter]);

  return (
    <FilterContainer sections={sections}>
      {showActions && (
        <FilterActions
          onReset={onReset}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          resetLabel={resetLabel}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
        />
      )}
    </FilterContainer>
  );
}


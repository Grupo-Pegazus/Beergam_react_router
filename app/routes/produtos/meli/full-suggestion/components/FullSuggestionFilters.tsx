import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import type { FullSuggestionFilters } from "~/features/produtos/meli/full-suggestion/typings";
import { FilterActions, FilterContainer, FilterDateRangePicker, FilterSelect } from "~/src/components/filters";
import { Fields } from "~/src/components/utils/_fields";

const DEFAULT_START = dayjs().subtract(30, "day").format("YYYY-MM-DD");
const DEFAULT_END = dayjs().format("YYYY-MM-DD");

const PERIOD_OPTIONS = [
    { label: "Hoje", value: "today" },
    { label: "Ontem", value: "yesterday" },
    { label: "7 dias", value: "7d" },
    { label: "30 dias", value: "30d" },
    { label: "90 dias", value: "90d" },
    { label: "Personalizado", value: "custom" },
];

const SORT_OPTIONS = [
    { value: "abc_class", label: "Classe ABC" },
    { value: "suggested_quantity", label: "Qtd. sugerida" },
    { value: "sales_in_period", label: "Vendas no período" },
    { value: "daily_avg_sales", label: "Média diária" },
    { value: "current_full_stock", label: "Estoque FULL" },
    { value: "estimated_investment", label: "Investimento" },
    { value: "sku", label: "SKU" },
];

const SORT_ORDER_OPTIONS = [
    { value: "asc", label: "Crescente" },
    { value: "desc", label: "Decrescente" },
];

export interface FullSuggestionFiltersProps {
    value: FullSuggestionFilters;
    onChange: (next: FullSuggestionFilters) => void;
    onReset: () => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
}

export default function FullSuggestionFiltersSection({
    value,
    onChange,
    onReset,
    onSubmit,
    isSubmitting,
}: FullSuggestionFiltersProps) {
    const effectivePeriod = value.period_alias ?? "30d";

    const handlePeriodChange = useCallback(
        (alias: string) => {
            onChange({
                ...value,
                period_alias: alias as FullSuggestionFilters["period_alias"],
                date_from: alias === "custom" ? value.date_from : undefined,
                date_to: alias === "custom" ? value.date_to : undefined,
                page: 1,
            });
        },
        [onChange, value],
    );

    const handleDateRangeChange = useCallback(
        (range: { start: string; end: string }) => {
            onChange({ ...value, period_alias: "custom", date_from: range.start, date_to: range.end, page: 1 });
        },
        [onChange, value],
    );

    const displayDateRange = {
        start: value.date_from ?? DEFAULT_START,
        end: value.date_to ?? DEFAULT_END,
    };

    const sections = useMemo(
        () => [
            <Stack
                key="row-1"
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", md: "flex-end" }}
                flexWrap="wrap"
            >
                <div className="w-full md:max-w-[180px]">
                    <Fields.wrapper>
                        <Fields.label text="Cobertura desejada (dias)" />
                        <Fields.numericInput
                            value={value.coverage_days ?? undefined}
                            onChange={(v) => onChange({ ...value, coverage_days: v !== undefined ? Number(v) : undefined, page: 1 })}
                            format="integer"
                            min={1}
                            max={365}
                            placeholder="Ex: 30"
                            widthType="full"
                        />
                    </Fields.wrapper>
                </div>

                <div className="w-full md:max-w-xs">
                    <FilterSelect
                        label="Período de análise"
                        value={effectivePeriod}
                        onChange={(v) => handlePeriodChange(v as string)}
                        options={PERIOD_OPTIONS}
                        defaultValue="30d"
                        widthType="full"
                    />
                </div>

                {effectivePeriod === "custom" && (
                    <div className="w-full md:max-w-sm">
                        <FilterDateRangePicker
                            label="Data inicial e final"
                            widthType="full"
                            value={displayDateRange}
                            onChange={handleDateRangeChange}
                        />
                    </div>
                )}

                <div className="w-full md:w-auto">
                    <FilterSelect
                        label="Ordenar por"
                        value={value.sort_by ?? "abc_class"}
                        onChange={(v) => onChange({ ...value, sort_by: v as FullSuggestionFilters["sort_by"], page: 1 })}
                        options={SORT_OPTIONS}
                        defaultValue="abc_class"
                        widthType="full"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <FilterSelect
                        label="Ordem"
                        value={value.sort_order ?? "asc"}
                        onChange={(v) => onChange({ ...value, sort_order: v as FullSuggestionFilters["sort_order"], page: 1 })}
                        options={SORT_ORDER_OPTIONS}
                        defaultValue="asc"
                        widthType="full"
                    />
                </div>
            </Stack>,
        ],
        [displayDateRange, effectivePeriod, handleDateRangeChange, handlePeriodChange, onChange, value],
    );

    return (
        <FilterContainer sections={sections}>
            <FilterActions onReset={onReset} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </FilterContainer>
    );
}

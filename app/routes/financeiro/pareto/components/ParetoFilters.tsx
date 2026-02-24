import { useCallback, useMemo } from "react";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import type { ParetoMetric } from "~/features/financeiro/pareto/typings";
import {
    FilterActions,
    FilterContainer,
    FilterDateRangePicker,
    FilterSelect,
} from "~/src/components/filters";

const DEFAULT_START = dayjs().subtract(90, "day").format("YYYY-MM-DD");
const DEFAULT_END = dayjs().format("YYYY-MM-DD");

const PERIOD_OPTIONS: Array<{ label: string; value: string }> = [
    { label: "Hoje", value: "today" },
    { label: "Ontem", value: "yesterday" },
    { label: "7 dias", value: "7d" },
    { label: "30 dias", value: "30d" },
    { label: "90 dias", value: "90d" },
    { label: "Personalizado", value: "custom" },
];

const METRIC_OPTIONS: Array<{ label: string; value: ParetoMetric }> = [
    { label: "Faturamento", value: "revenue" },
    { label: "Unidades", value: "units" },
    { label: "Lucro", value: "profit" },
];

const TOP_N_OPTIONS: Array<{ label: string; value: string }> = [
    { label: "Top 5", value: "5" },
    { label: "Top 10", value: "10" },
    { label: "Top 15", value: "15" },
    { label: "Top 20", value: "20" },
    { label: "Top 30", value: "30" },
    { label: "Top 50", value: "50" },
];

const SORT_OPTIONS = [
    { value: "revenue", label: "Faturamento" },
    { value: "units", label: "Unidades" },
    { value: "profit", label: "Lucro" },
    { value: "sku", label: "SKU" },
];

const SORT_ORDER_OPTIONS = [
    { value: "desc", label: "Decrescente" },
    { value: "asc", label: "Crescente" },
];

interface ParetoFiltersState {
    metric: ParetoMetric;
    period_alias?: string;
    date_from?: string;
    date_to?: string;
    top_n: number;
    sort_by?: string;
    sort_order?: string;
    page: number;
    per_page: number;
}

export interface ParetoFiltersProps {
    value: ParetoFiltersState;
    onChange: (next: ParetoFiltersState) => void;
    onReset: () => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
}

export default function ParetoFiltersSection({
    value,
    onChange,
    onReset,
    onSubmit,
    isSubmitting,
}: ParetoFiltersProps) {
    const effectivePeriodAlias = value.period_alias ?? "90d";

    const handleDateRangeChange = useCallback(
        (range: { start: string; end: string }) => {
            onChange({
                ...value,
                period_alias: "custom",
                date_from: range.start,
                date_to: range.end,
                page: 1,
            });
        },
        [onChange, value],
    );

    const handlePeriodChange = useCallback(
        (alias: string) => {
            onChange({
                ...value,
                period_alias: alias,
                date_from: alias === "custom" ? value.date_from : undefined,
                date_to: alias === "custom" ? value.date_to : undefined,
                page: 1,
            });
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
            >
                <div className="w-full md:max-w-xs">
                    <FilterSelect
                        label="Período"
                        value={effectivePeriodAlias}
                        onChange={(newValue) => handlePeriodChange(newValue as string)}
                        options={PERIOD_OPTIONS}
                        defaultValue="90d"
                        widthType="full"
                    />
                </div>

                {effectivePeriodAlias === "custom" && (
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
                        label="Métrica"
                        value={value.metric}
                        onChange={(newValue) =>
                            onChange({
                                ...value,
                                metric: newValue as ParetoMetric,
                                sort_by: newValue as string,
                                page: 1,
                            })
                        }
                        options={METRIC_OPTIONS}
                        defaultValue="revenue"
                        widthType="full"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <FilterSelect
                        label="Top N (Gráfico)"
                        value={String(value.top_n)}
                        onChange={(newValue) =>
                            onChange({
                                ...value,
                                top_n: Number(newValue),
                            })
                        }
                        options={TOP_N_OPTIONS}
                        defaultValue="20"
                        widthType="full"
                    />
                </div>
            </Stack>,

            <Stack
                key="row-2"
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", md: "flex-end" }}
            >
                <div className="w-full md:w-auto">
                    <FilterSelect
                        label="Ordenar por (Tabela)"
                        value={(value.sort_by ?? "revenue") as string}
                        onChange={(newValue) =>
                            onChange({
                                ...value,
                                sort_by: newValue as ParetoFiltersState["sort_by"],
                                page: 1,
                            })
                        }
                        options={SORT_OPTIONS}
                        defaultValue="revenue"
                        widthType="full"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <FilterSelect
                        label="Ordem"
                        value={(value.sort_order ?? "desc") as string}
                        onChange={(newValue) =>
                            onChange({
                                ...value,
                                sort_order: newValue as ParetoFiltersState["sort_order"],
                                page: 1,
                            })
                        }
                        options={SORT_ORDER_OPTIONS}
                        defaultValue="desc"
                        widthType="full"
                    />
                </div>
            </Stack>,
        ],
        [displayDateRange, effectivePeriodAlias, handleDateRangeChange, handlePeriodChange, onChange, value],
    );

    return (
        <FilterContainer sections={sections}>
            <FilterActions onReset={onReset} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </FilterContainer>
    );
}

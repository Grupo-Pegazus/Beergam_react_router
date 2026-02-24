import { useCallback, useMemo } from "react";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import type { ABCCurveClass, ABCCurveFilters } from "~/features/financeiro/abc-curve/typings";
import {
    FilterActions,
    FilterContainer,
    FilterDateRangePicker,
    FilterSelect,
    FilterSwitch,
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

const SORT_OPTIONS = [
    { value: "abc_class", label: "Classe ABC" },
    { value: "revenue", label: "Faturamento" },
    { value: "units", label: "Unidades" },
    { value: "sku", label: "SKU" },
];

const SORT_ORDER_OPTIONS = [
    { value: "desc", label: "Decrescente" },
    { value: "asc", label: "Crescente" },
];

const ABC_CLASSES: ABCCurveClass[] = ["A", "B", "C"];

export interface ABCCurveFiltersProps {
    value: ABCCurveFilters;
    onChange: (next: ABCCurveFilters) => void;
    onReset: () => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
}

export default function ABCCurveFiltersSection({
    value,
    onChange,
    onReset,
    onSubmit,
    isSubmitting,
}: ABCCurveFiltersProps) {
    const effectivePeriodAlias = value.period_alias ?? "90d";

    const classColors: Record<ABCCurveClass, string> = useMemo(
        () => ({
            A: "bg-beergam-green-primary/20 text-beergam-green-primary border-beergam-green-primary",
            B: "bg-beergam-orange/20 text-beergam-orange border-beergam-orange",
            C: "bg-beergam-gray/20 text-beergam-typography-secondary border-beergam-input-border",
        }),
        [],
    );

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
                period_alias: alias as ABCCurveFilters["period_alias"],
                date_from: alias === "custom" ? value.date_from : undefined,
                date_to: alias === "custom" ? value.date_to : undefined,
                page: 1,
            });
        },
        [onChange, value],
    );

    const handleToggleClass = useCallback(
        (cls: ABCCurveClass) => {
            const current = value.class_in ?? [];
            const exists = current.includes(cls);
            const next = exists ? current.filter((c) => c !== cls) : [...current, cls];
            onChange({ ...value, class_in: next.length > 0 ? next : undefined, page: 1 });
        },
        [onChange, value],
    );

    const handleHasProductChange = useCallback(
        (next: boolean) => {
            onChange({
                ...value,
                has_product: next ? true : undefined,
                page: 1,
            });
        },
        [onChange, value],
    );

    const periodValue = useMemo(
        () => (effectivePeriodAlias as ABCCurveFilters["period_alias"] | undefined) ?? "90d",
        [effectivePeriodAlias],
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
                        value={periodValue as string}
                        onChange={(newValue) => handlePeriodChange(newValue as string)}
                        options={PERIOD_OPTIONS}
                        defaultValue="90d"
                        widthType="full"
                    />
                </div>

                {periodValue === "custom" && (
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
                        value={(value.sort_by ?? "abc_class") as string}
                        onChange={(newValue) =>
                            onChange({
                                ...value,
                                sort_by: newValue as ABCCurveFilters["sort_by"],
                                page: 1,
                            })
                        }
                        options={SORT_OPTIONS}
                        defaultValue="abc_class"
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
                                sort_order: newValue as ABCCurveFilters["sort_order"],
                                page: 1,
                            })
                        }
                        options={SORT_ORDER_OPTIONS}
                        defaultValue="desc"
                        widthType="full"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <FilterSwitch
                        label="Apenas SKUs com produto cadastrado internamente"
                        value={value.has_product === true}
                        onChange={(next) => handleHasProductChange(Boolean(next))}
                    />
                </div>
            </Stack>,

            <div key="row-2" className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-beergam-typography-secondary">Classe ABC</span>
                <div className="flex flex-wrap gap-1.5">
                    {ABC_CLASSES.map((cls) => {
                        const isActive = value.class_in?.includes(cls) ?? false;
                        return (
                            <button
                                key={cls}
                                type="button"
                                onClick={() => handleToggleClass(cls)}
                                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border-2 transition-all duration-200 cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] ${
                                    isActive
                                        ? classColors[cls]
                                        : "bg-beergam-mui-paper text-beergam-typography-secondary border-beergam-input-border hover:border-beergam-primary"
                                }`}
                            >
                                Classe {cls}
                            </button>
                        );
                    })}
                </div>
            </div>,
        ],
        [
            classColors,
            displayDateRange,
            effectivePeriodAlias,
            handleDateRangeChange,
            handleHasProductChange,
            handlePeriodChange,
            handleToggleClass,
            onChange,
            value,
        ],
    );

    return (
        <FilterContainer sections={sections}>
            <FilterActions onReset={onReset} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </FilterContainer>
    );
}

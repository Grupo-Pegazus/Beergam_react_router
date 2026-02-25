import { useMemo, useState } from "react";
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import type { ParetoChartResponse, ParetoMetric } from "~/features/financeiro/pareto/typings";
import MainCards from "~/src/components/ui/MainCards";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    chartAxisStyle,
    chartGridStyle,
    type ChartConfig,
} from "~/src/components/ui/Chart";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface ParetoChartProps {
    data: ParetoChartResponse;
}

type ChartType = "bar" | "area";

const METRIC_OPTIONS: Array<{ value: ParetoMetric; label: string }> = [
    { value: "revenue", label: "Faturamento" },
    { value: "units", label: "Unidades" },
    { value: "profit", label: "Lucro" },
];

const CHART_TYPE_OPTIONS: Array<{ value: ChartType; label: string }> = [
    { value: "bar", label: "Barras" },
    { value: "area", label: "Área" },
];

function formatMetricValue(metric: ParetoMetric, value: number): string {
    if (metric === "units") return String(value);
    return formatCurrency(value);
}

interface SelectorButtonGroupProps<T extends string> {
    options: Array<{ value: T; label: string }>;
    selected: T;
    onSelect: (value: T) => void;
}

function SelectorButtonGroup<T extends string>({
    options,
    selected,
    onSelect,
}: SelectorButtonGroupProps<T>) {
    return (
        <div className="flex items-center gap-1 rounded-lg bg-beergam-input-background p-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelect(opt.value)}
                    className={`
                        px-3 py-1 rounded-md text-xs font-medium transition-all
                        ${
                            selected === opt.value
                                ? "bg-beergam-primary text-beergam-background shadow-sm"
                                : "text-beergam-typography-secondary hover:text-beergam-typography-primary"
                        }
                    `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default function ParetoChart({ data }: ParetoChartProps) {
    const [metric, setMetric] = useState<ParetoMetric>("revenue");
    const [chartType, setChartType] = useState<ChartType>("bar");

    const activeData = data.chart_data[metric];
    const metricLabel = METRIC_OPTIONS.find((o) => o.value === metric)?.label ?? "Valor";

    const chartData = useMemo(
        () =>
            activeData.map((item) => ({
                name: item.sku,
                valor: item.value,
                acumulado: +(item.cumulative_share * 100).toFixed(1),
            })),
        [activeData],
    );

    const chartConfig: ChartConfig = useMemo(
        () => ({
            valor: {
                label: metricLabel,
                color: "var(--color-beergam-orange)",
            },
            acumulado: {
                label: "% Acumulado",
                color: "var(--color-beergam-blue)",
            },
        }),
        [metricLabel],
    );

    if (chartData.length === 0) {
        return (
            <MainCards>
                <div className="flex items-center justify-center p-8">
                    <p className="text-beergam-typography-secondary">
                        Nenhum dado encontrado para os filtros selecionados.
                    </p>
                </div>
            </MainCards>
        );
    }

    return (
        <MainCards>
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-beergam-typography-secondary">
                        Top{" "}
                        <span className="font-semibold text-beergam-typography-primary">
                            {chartData.length}
                        </span>{" "}
                        SKUs por {metricLabel.toLowerCase()}. A linha azul indica o percentual
                        acumulado — a linha pontilhada marca o limiar de 80%.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <SelectorButtonGroup
                            options={METRIC_OPTIONS}
                            selected={metric}
                            onSelect={setMetric}
                        />
                        <SelectorButtonGroup
                            options={CHART_TYPE_OPTIONS}
                            selected={chartType}
                            onSelect={setChartType}
                        />
                    </div>
                </div>

                <div className="h-[300px] md:h-[400px] w-full overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ComposedChart data={chartData} accessibilityLayer>
                            <CartesianGrid {...chartGridStyle} vertical={false} />
                            <XAxis
                                dataKey="name"
                                {...chartAxisStyle}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                tick={{
                                    fontSize: 9,
                                    fill: "var(--color-beergam-typography-secondary)",
                                }}
                            />
                            <YAxis
                                yAxisId="left"
                                {...chartAxisStyle}
                                tickFormatter={(v) => formatMetricValue(metric, Number(v))}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                {...chartAxisStyle}
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                            />

                            <ReferenceLine
                                yAxisId="right"
                                y={80}
                                stroke="var(--color-beergam-red)"
                                strokeDasharray="6 4"
                                strokeWidth={1.5}
                                label={{
                                    value: "80%",
                                    position: "right",
                                    fill: "var(--color-beergam-red)",
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        title="Pareto"
                                        valueFormatter={(value, dataKey) => {
                                            if (dataKey === "acumulado") return `${value}%`;
                                            return formatMetricValue(metric, Number(value));
                                        }}
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />

                            {chartType === "bar" ? (
                                <Bar
                                    yAxisId="left"
                                    dataKey="valor"
                                    fill="var(--color-valor)"
                                    radius={[4, 4, 0, 0]}
                                    minPointSize={1}
                                />
                            ) : (
                                <Area
                                    yAxisId="left"
                                    dataKey="valor"
                                    type="monotone"
                                    fill="var(--color-valor)"
                                    stroke="var(--color-valor)"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            )}

                            <Line
                                yAxisId="right"
                                dataKey="acumulado"
                                type="monotone"
                                stroke="var(--color-acumulado)"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "var(--color-acumulado)" }}
                                activeDot={{ r: 5 }}
                            />
                        </ComposedChart>
                    </ChartContainer>
                </div>
            </div>
        </MainCards>
    );
}

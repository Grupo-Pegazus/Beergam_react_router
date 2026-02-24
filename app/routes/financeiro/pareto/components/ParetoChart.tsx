import { useMemo } from "react";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import type { ParetoChartResponse } from "~/features/financeiro/pareto/typings";
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

const METRIC_LABELS: Record<string, string> = {
    revenue: "Faturamento",
    units: "Unidades",
    profit: "Lucro",
};

function formatMetricValue(metric: string, value: number): string {
    if (metric === "units") return String(value);
    return formatCurrency(value);
}

export default function ParetoChart({ data }: ParetoChartProps) {
    const metricLabel = METRIC_LABELS[data.metric] ?? "Valor";

    const chartData = useMemo(
        () =>
            data.chart_data.map((item) => ({
                name: item.sku,
                title: item.title ?? item.sku,
                valor: item.value,
                acumulado: +(item.cumulative_share * 100).toFixed(1),
            })),
        [data.chart_data],
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

    const hasData = chartData.length > 0;

    if (!hasData) {
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
            <div className="space-y-2">
                <p className="text-xs text-beergam-typography-secondary">
                    Top <span className="font-semibold text-beergam-typography-primary">{chartData.length}</span> SKUs
                    por {metricLabel.toLowerCase()}. A linha azul indica o percentual acumulado
                    — a linha pontilhada marca o limiar de 80%.
                </p>
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
                                tick={{ fontSize: 9, fill: "var(--color-beergam-typography-secondary)" }}
                            />
                            <YAxis
                                yAxisId="left"
                                {...chartAxisStyle}
                                tickFormatter={(value) => formatMetricValue(data.metric, Number(value))}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                {...chartAxisStyle}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
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
                                        valueFormatter={(value, name) => {
                                            if (name === "acumulado") return `${value}%`;
                                            return formatMetricValue(data.metric, Number(value));
                                        }}
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />

                            <Bar
                                yAxisId="left"
                                dataKey="valor"
                                fill="var(--color-valor)"
                                radius={[4, 4, 0, 0]}
                                minPointSize={1}
                            />
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

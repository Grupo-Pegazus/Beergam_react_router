import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ABCCurveResponse } from "~/features/financeiro/abc-curve/typings";
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

interface ABCCurveDistributionChartProps {
    data: ABCCurveResponse;
}

export default function ABCCurveDistributionChart({ data }: ABCCurveDistributionChartProps) {
    const chartData = useMemo(() => {
        const { classes } = data.summary;
        return (["A", "B", "C"] as const).map((cls) => {
            const clsData = classes[cls];
            return {
                classe: `Classe ${cls}`,
                faturamento: clsData?.revenue ?? 0,
                skus: clsData?.count ?? 0,
                share: (clsData?.share ?? 0) * 100,
            };
        });
    }, [data]);

    const chartConfig: ChartConfig = {
        faturamento: {
            label: "Faturamento",
            color: "var(--color-beergam-orange)",
        },
        skus: {
            label: "Qtd. SKUs",
            color: "var(--color-beergam-blue)",
        },
    };

    const totalRevenue = data.summary.total_revenue;

    return (
        <MainCards>
            <div className="space-y-2">
                <p className="text-xs text-beergam-typography-secondary">
                    Distribuição de{" "}
                    <span className="font-semibold text-beergam-typography-primary">{formatCurrency(totalRevenue)}</span>{" "}
                    em faturamento entre as classes A, B e C.
                </p>
                <div className="h-[250px] md:h-[320px] w-full overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={chartData} accessibilityLayer>
                            <CartesianGrid {...chartGridStyle} vertical={false} />
                            <XAxis dataKey="classe" {...chartAxisStyle} />
                            <YAxis
                                {...chartAxisStyle}
                                tickFormatter={(value) => formatCurrency(Number(value))}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        title="Curva ABC"
                                        valueFormatter={(value) => formatCurrency(Number(value))}
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                dataKey="faturamento"
                                fill="var(--color-faturamento)"
                                radius={[4, 4, 0, 0]}
                                minPointSize={1}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </MainCards>
    );
}

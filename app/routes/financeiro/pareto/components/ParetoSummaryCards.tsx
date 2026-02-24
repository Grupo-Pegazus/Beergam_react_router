import type { ParetoChartResponse } from "~/features/financeiro/pareto/typings";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import StatCard from "~/src/components/ui/StatCard";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface ParetoSummaryCardsProps {
    data: ParetoChartResponse;
}

const METRIC_LABELS: Record<string, string> = {
    revenue: "Faturamento Total",
    units: "Unidades Totais",
    profit: "Lucro Total",
};

function formatMetricValue(metric: string, value: number): string {
    if (metric === "units") return String(value);
    return formatCurrency(value);
}

export default function ParetoSummaryCards({ data }: ParetoSummaryCardsProps) {
    const { summary } = data;
    const metricLabel = METRIC_LABELS[summary.metric] ?? "Valor Total";

    return (
        <MainCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard
                title="Total de SKUs"
                icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                color="blue"
                value={
                    <TextCensored censorshipKey="pareto_resumo">
                        {summary.total_skus}
                    </TextCensored>
                }
            />
            <StatCard
                title={metricLabel}
                icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                color="green"
                value={
                    <TextCensored censorshipKey="pareto_resumo">
                        {formatMetricValue(summary.metric, summary.total_value)}
                    </TextCensored>
                }
            />
            <StatCard
                title="SKUs na Linha 80%"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="orange"
            >
                <div className="flex flex-col gap-0.5">
                    <TextCensored censorshipKey="pareto_resumo">
                        <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
                            {summary.pareto_line_skus} SKUs
                        </h3>
                    </TextCensored>
                    <p className="text-[11px] text-beergam-typography-tertiary!">
                        representam 80% do valor
                    </p>
                </div>
            </StatCard>
            <StatCard
                title="% SKUs (80/20)"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="amber"
            >
                <div className="flex flex-col gap-0.5">
                    <TextCensored censorshipKey="pareto_resumo">
                        <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
                            {summary.pareto_line_pct.toFixed(1)}%
                        </h3>
                    </TextCensored>
                    <p className="text-[11px] text-beergam-typography-tertiary!">
                        dos SKUs concentram 80% do total
                    </p>
                </div>
            </StatCard>
        </MainCards>
    );
}

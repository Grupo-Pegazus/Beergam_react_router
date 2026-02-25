import type { ParetoChartResponse } from "~/features/financeiro/pareto/typings";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import StatCard from "~/src/components/ui/StatCard";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface ParetoSummaryCardsProps {
    data: ParetoChartResponse;
}

export default function ParetoSummaryCards({ data }: ParetoSummaryCardsProps) {
    const { summary } = data;

    return (
        <>
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
                title="Faturamento Total"
                icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                color="green"
                value={
                    <TextCensored censorshipKey="pareto_resumo">
                        {formatCurrency(summary.total_revenue)}
                    </TextCensored>
                }
            />
            <StatCard
                title="Lucro Total"
                icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                color="amber"
                value={
                    <TextCensored censorshipKey="pareto_resumo">
                        {formatCurrency(summary.total_profit)}
                    </TextCensored>
                }
            />
            <StatCard
                title="Unidades Totais"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="orange"
                value={
                    <TextCensored censorshipKey="pareto_resumo">
                        {summary.total_units}
                    </TextCensored>
                }
            />

        </MainCards>
        <MainCards className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <StatCard
                title="SKUs (80% Faturamento)"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="green"
            >
                <ParetoLineInfo
                    skus={summary.pareto_line_skus_revenue}
                    pct={summary.pareto_line_pct_revenue}
                />
            </StatCard>

            <StatCard
                title="SKUs (80% Unidades)"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="blue"
            >
                <ParetoLineInfo
                    skus={summary.pareto_line_skus_units}
                    pct={summary.pareto_line_pct_units}
                />
            </StatCard>

            <StatCard
                title="SKUs (80% Lucro)"
                icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                color="amber"
            >
                <ParetoLineInfo
                    skus={summary.pareto_line_skus_profit}
                    pct={summary.pareto_line_pct_profit}
                />
            </StatCard>
        </MainCards>
        </>
    );
}

interface ParetoLineInfoProps {
    skus: number;
    pct: number;
}

function ParetoLineInfo({ skus, pct }: ParetoLineInfoProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <TextCensored censorshipKey="pareto_resumo">
                <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
                    {skus} SKUs
                </h3>
            </TextCensored>
            <p className="text-[11px] text-beergam-typography-tertiary!">
                {pct.toFixed(1)}% dos SKUs concentram 80%
            </p>
        </div>
    );
}

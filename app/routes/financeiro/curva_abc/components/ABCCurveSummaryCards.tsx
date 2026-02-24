import type { ABCCurveResponse } from "~/features/financeiro/abc-curve/typings";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import StatCard from "~/src/components/ui/StatCard";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface ABCCurveSummaryCardsProps {
    data: ABCCurveResponse;
}

export default function ABCCurveSummaryCards({ data }: ABCCurveSummaryCardsProps) {
    const { summary } = data;

    const classConfig = [
        { key: "A" as const, label: "Classe A", desc: "alto impacto", color: "green" as const },
        { key: "B" as const, label: "Classe B", desc: "médio impacto", color: "orange" as const },
        { key: "C" as const, label: "Classe C", desc: "baixo impacto", color: "slate" as const },
    ];

    return (
        <MainCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
            <StatCard
                title="Total de SKUs"
                icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                color="blue"
                value={
                    <TextCensored censorshipKey="curva_abc_resumo">
                        {summary.total_skus}
                    </TextCensored>
                }
            />
            <StatCard
                title="Faturamento Total"
                icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                color="green"
                value={
                    <TextCensored censorshipKey="curva_abc_resumo">
                        {formatCurrency(summary.total_revenue)}
                    </TextCensored>
                }
            />
            {classConfig.map(({ key, label, desc, color }) => {
                const cls = summary.classes[key];
                if (!cls) return null;
                return (
                    <StatCard
                        key={key}
                        title={label}
                        icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                        color={color}
                    >
                        <div className="flex flex-col gap-0.5">
                            <TextCensored censorshipKey="curva_abc_resumo">
                                <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
                                    {cls.count} SKUs · {(cls.share * 100).toFixed(1)}%
                                </h3>
                            </TextCensored>
                            <p className="text-[11px] text-beergam-typography-tertiary! capitalize">{desc}</p>
                        </div>
                    </StatCard>
                );
            })}
        </MainCards>
    );
}

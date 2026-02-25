import type { FullSuggestionResponse } from "~/features/produtos/meli/full-suggestion/typings";
import Svg from "~/src/assets/svgs/_index";
import MainCards from "~/src/components/ui/MainCards";
import StatCard from "~/src/components/ui/StatCard";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface FullSuggestionSummaryCardsProps {
    data: FullSuggestionResponse;
}

export default function FullSuggestionSummaryCards({ data }: FullSuggestionSummaryCardsProps) {
    const { summary } = data;

    const totalInvestmentLabel = summary.total_investment !== null && summary.total_investment !== undefined
        ? formatCurrency(summary.total_investment)
        : "—";

    return (
        <MainCards className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <StatCard
                title="Anúncios FULL"
                icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                color="blue"
                value={
                    <TextCensored censorshipKey="full_suggestion_resumo">
                        {summary.total_items}
                    </TextCensored>
                }
            />

            <StatCard
                title="Unidades sugeridas"
                icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                color="green"
                value={
                    <TextCensored censorshipKey="full_suggestion_resumo">
                        {summary.total_suggestion_units}
                    </TextCensored>
                }
            />

            <StatCard
                title="Investimento estimado"
                icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                color="purple"
            >
                <TextCensored censorshipKey="full_suggestion_resumo">
                    <p className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
                        {totalInvestmentLabel}
                    </p>
                </TextCensored>
            </StatCard>

            <StatCard
                title="Sem vendas no período"
                icon={<Svg.arrow_trending_down tailWindClasses="h-5 w-5" />}
                color="orange"
                value={
                    <TextCensored censorshipKey="full_suggestion_resumo">
                        {summary.no_sales_count}
                    </TextCensored>
                }
            />

            <StatCard
                title="Sem estoque FULL"
                icon={<Svg.low_stock tailWindClasses="h-5 w-5" />}
                color="red"
                value={
                    <TextCensored censorshipKey="full_suggestion_resumo">
                        {summary.no_stock_count}
                    </TextCensored>
                }
            />
        </MainCards>
    );
}

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Tooltip } from "react-tooltip";
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
} from "recharts";
import { useIncomingsBySku, useInvoicingMetrics, useInvoicingMetricsByMonths } from "~/features/invoicing/hooks";
import authStore from "~/features/store-zustand";
import SkuProfitabilityList from "~/routes/financeiro/components/SkuProfitabilityList";
import Svg from "~/src/assets/svgs/_index";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	chartAxisStyle,
	chartFormatters,
	chartGridStyle,
	type ChartConfig,
} from "~/src/components/ui/Chart";
import Section from "~/src/components/ui/Section";
import StatCard from "~/src/components/ui/StatCard";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
interface SectionContent{
    value: string;
    period: string;
    percentage?: string | number | null | undefined;
}
type PercentageBadgeProps = {
    percentage?: string | number | null | undefined;
} 

function getPercentageNumber({number, target}: {number: number | null, target: number | null}): string | null {
	if (number == null || target == null) return null;
	if(number == 0){
		number = 1;
	};
	if(target == 0){
		target = 1;
	};
	const value = number - target;
	const percentage = value / target * 100;
    return percentage.toFixed(2);
}

export default function LucratividadePage() {
	const {data: invoicingMetrics, isLoading: isLoadingInvoicingMetrics} = useInvoicingMetrics();
	const {data: invoicingMetricsByMonths, isLoading: isLoadingInvoicingMetricsByMonths} = useInvoicingMetricsByMonths();
	const {data: incomingsBySku, isLoading: isLoadingIncomingsBySku} = useIncomingsBySku();
  const subscription = authStore.use.subscription() ?? null;
  const isBasePlan = subscription?.plan.display_name === 'Operacional';

  // Calcula os nomes dos meses dinamicamente
  const monthNames = {
    "30": dayjs().locale("pt-br").format("MMMM"), // Mês atual
    "60": dayjs().subtract(1, "month").locale("pt-br").format("MMMM"), // Mês anterior
    "90": dayjs().subtract(2, "month").locale("pt-br").format("MMMM"), // 2 meses atrás
  };
  function PercentageBadge({ percentage }: PercentageBadgeProps) {
    const isUnknown = percentage === null || percentage === undefined;
    const percentageValue = isUnknown ? 0 : parseFloat(percentage.toString());
    const isNegative = percentageValue < 0 && !isUnknown;
    const percentageColor = isUnknown ? 'bg-beergam-gray/20' : isNegative ? 'bg-beergam-red/20' : percentageValue > 20 ? 'bg-beergam-green-primary/20' : 'bg-beergam-yellow/20';
    const percentageTextColor = isUnknown ? 'text-beergam-gray' : isNegative ? 'text-beergam-red' : percentageValue > 20 ? 'text-beergam-green-primary' : 'text-beergam-yellow';
    return <div data-tooltip-id={`percentage-badge-${percentage}`} className={`p-1 px-2 rounded-lg flex items-center w-fit mb-2 gap-1 justify-center ${percentageColor}`}>
      <p className={`${percentageTextColor}!`}>{isUnknown ? '?' : `${percentage}%`}</p>
      { !isUnknown && (isNegative ? <Svg.arrow_trending_down tailWindClasses="h-4 w-4 text-beergam-red" /> : <Svg.arrow_trending_up tailWindClasses={`h-4 w-4 ${percentageTextColor}`} />)}
      {
        isUnknown && <Tooltip content={isBasePlan ? 'Informação indisponível para o plano atual.' : 'Informação indisponível.'} id={`percentage-badge-${percentage}`}></Tooltip>
      }
    </div>
  }
    function SectionContent({ index, value, period, percentage, canShowPercentage = false }: SectionContent & { index: number, canShowPercentage?: boolean }) {
        return(
            <>
            <div className={`border-r h-full grid content-end ${index != 2 ? 'border-r-beergam-primary' : 'border-r-transparent'}`}>
                        {canShowPercentage && <PercentageBadge percentage={percentage} />}
                        <h3 className="text-[18px]! text-beergam-primary font-bold">{value}</h3>
                        <p className="text-[12px] text-beergam-typography-tertiary! capitalize">{period}</p>
                    </div>
            </>
        )
    }

    function SectionContentCard({ contents }: { contents: (SectionContent & { canShowPercentage?: boolean })[] }) {
        return(
            <>
            <div className="grid grid-cols-3 gap-2 items-baseline">
                {contents.map((content, index) => (
                    <SectionContent index={index} key={content.period} canShowPercentage={content.canShowPercentage} {...content} />
                ))}
            </div>
            {/* <p className="text-xl! mt-2"><span className="text-beergam-primary text-xl! font-bold">Total:</span> {total}</p> */}
            </>
        )
    }
   return( <>
    <Section title="Faturamento">
        <div className="grid grid-cols-2 gap-4">
            <StatCard
                  title="Total Bruto Acumulado"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_bruto ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_bruto ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_bruto ?? "0"), period: "90 dias" }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Acumulado"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_liquido ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_liquido ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_liquido ?? "0"), period: "90 dias" }]} />
                </StatCard>
            <StatCard
                  title="Total Bruto Mensal"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard contents={[{ canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.gross ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.gross ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.gross ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.gross ?? null}) : null }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Mensal"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.net ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.net ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.net ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.net ?? null}) : null }]} />
                </StatCard>
                <StatCard
                  title="Total Bruto + Frete Recebido"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
                <StatCard
                  title="Retorno do FLEX"
                  icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
        </div>
    </Section>
    <Section title="Custos">
    <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
            <StatCard
                  title="Custos com Comissões"
                  icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete (Comprador)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete (Vendedor)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos de Produto"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
        </div>
        <div className="grid grid-cols-3 gap-4">
      
    </div>
    </div>
    
    </Section>
    <Section title="Distribuição de Vendas por Faixa de Preço">
      {/** Mock de distribuição de vendas por faixa de preço em 30, 60 e 90 dias */}
      {(() => {
        const chartConfig: ChartConfig = {
          vendas30: {
            label: "Últimos 30 dias",
            color: "var(--color-beergam-orange)",
          },
          vendas60: {
            label: "Últimos 60 dias",
            color: "var(--color-beergam-blue)",
          },
          vendas90: {
            label: "Últimos 90 dias",
            color: "var(--color-beergam-green)",
          },
          total: {
            label: "Total",
            color: "var(--color-beergam-gray)",
          },
        };

        const data = [
          {
            faixa: "Até R$ 29,99",
            vendas30: 120,
            vendas60: 80,
            vendas90: 50,
            total: 250,
          },
          {
            faixa: "R$ 30 a R$ 49,99",
            vendas30: 110,
            vendas60: 70,
            vendas90: 40,
            total: 240,
          },
          {
            faixa: "R$ 50 a R$ 99,99",
            vendas30: 90,
            vendas60: 60,
            vendas90: 30,
            total: 220,
          },
          {
            faixa: "R$ 100 a R$ 199,99",
            vendas30: 70,
            vendas60: 50,
            vendas90: 30,
            total: 150,
          },
          {
            faixa: "R$ 200 a R$ 499,99",
            vendas30: 50,
            vendas60: 40,
            vendas90: 30,
            total: 120,
          },
          {
            faixa: "R$ 500 a R$ 999,99",
            vendas30: 30,
            vendas60: 25,
            vendas90: 15,
            total: 70,
          },
          {
            faixa: "R$ 1.000,00 a R$ 1.999,99",
            vendas30: 20,
            vendas60: 10,
            vendas90: 5,
            total: 35,
          },
          {
            faixa: "Mais de R$ 2.000,00",
            vendas30: 10,
            vendas60: 5,
            vendas90: 0,
            total: 15,
          },
        ];

        const totalVendas = data.reduce(
          (acc, item) =>
            acc + item.vendas30 + item.vendas60 + item.vendas90,
          0,
        );

        return (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-beergam-typography-secondary">
              Distribuição simulada de{" "}
              <span className="font-semibold">{totalVendas}</span> vendas por
              faixa de preço.
            </p>
            <div className="h-[320px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={data} accessibilityLayer>
                  <CartesianGrid {...chartGridStyle} vertical={false} />
                  <XAxis
                    dataKey="faixa"
                    {...chartAxisStyle}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    {...chartAxisStyle}
                    tickFormatter={chartFormatters.number}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                      title="AAaa"
                        valueFormatter={(value) =>
                          `${chartFormatters.number(Number(value))} vendas`
                        }
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[4, 4, 0, 0]}
                    minPointSize={1}
                  />
                  <Bar
                    dataKey="vendas30"
                    fill="var(--color-vendas30)"
                    radius={[4, 4, 0, 0]}
                    minPointSize={1}
                  />
                  <Bar
                    dataKey="vendas60"
                    fill="var(--color-vendas60)"
                    radius={[4, 4, 0, 0]}
                    minPointSize={1}
                  />
                  <Bar
                    dataKey="vendas90"
                    fill="var(--color-vendas90)"
                    radius={[4, 4, 0, 0]}
                    minPointSize={1}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        );
      })()}
    </Section>
    <Section title="Lucro por SKU">
      {isLoadingIncomingsBySku ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-beergam-typography-secondary">Carregando...</p>
        </div>
      ) : (
        <SkuProfitabilityList incomingsBySku={incomingsBySku?.data} />
      )}
    </Section>
    </>
   )
}
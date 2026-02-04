import { Alert, Skeleton } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMemo } from "react";
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
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
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

    function SectionContentCard({ contents, isLoading }: { contents: (SectionContent & { canShowPercentage?: boolean})[], isLoading?: boolean }) {
        
      return(
            <AsyncBoundary ErrorFallback={() => (
              <Alert severity="error">
                Não foi possível carregar o conteúdo.
              </Alert>
            )} isLoading={isLoading} Skeleton={() => (
        <div className="grid grid-cols-3 gap-2 items-baseline">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton
            sx={{ bgcolor: 'var(--color-beergam-gray)' }}
              variant="text"
              height={30}
              className="rounded-lg"
            />
              <Skeleton
            sx={{ bgcolor: 'var(--color-beergam-gray)' }}
              variant="text"
              height={20}
              className="rounded-lg"
            />
            </div>
          ))}
        </div>
      )}>
            <div className="grid grid-cols-3 gap-2 items-baseline">
                {contents.map((content, index) => (
                    <SectionContent index={index} key={content.period} canShowPercentage={content.canShowPercentage} {...content} />
                ))}
            </div>
            {/* <p className="text-xl! mt-2"><span className="text-beergam-primary text-xl! font-bold">Total:</span> {total}</p> */}
            </AsyncBoundary>
        )
    }
   return( <>
    <Section title="Faturamento">
        <div className="grid grid-cols-2 gap-4">
            <StatCard
                  title="Total Bruto Acumulado"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_bruto ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_bruto ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_bruto ?? "0"), period: "90 dias" }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Acumulado"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_liquido ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_liquido ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_liquido ?? "0"), period: "90 dias" }]} />
                </StatCard>
            <StatCard
                  title="Total Bruto Mensal"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard isLoading={isLoadingInvoicingMetricsByMonths} contents={[{ canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.gross ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.gross ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.gross ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.gross ?? null}) : null }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Mensal"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetricsByMonths} contents={[{ canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.net ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.net ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.net ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.net ?? null}) : null }]} />
                </StatCard>
                <StatCard
                  title="Total Bruto + Frete Recebido"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: "R$ 1.000,00", period: "30 dias" }, { value: "R$ 2.000,00", period: "60 dias" }, { value: "R$ 3.000,00", period: "90 dias" }]} />
                </StatCard>
                {/* <StatCard
                  title="Retorno do FLEX"
                  icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.self_service_return ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.self_service_return ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.self_service_return ?? "0"), period: "90 dias" }]} />
                </StatCard> */}
        </div>
    </Section>
    <Section title="Custos">
    <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
                  <StatCard
                  title="Custos com Frete (Comprador)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.shipping?.buyer ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.shipping?.buyer ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.shipping?.buyer ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete (Vendedor)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.shipping?.seller ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.shipping?.seller ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.shipping?.seller ?? "0"), period: "90 dias" }]} />
                </StatCard>
                            <StatCard
                  title="Custos com Comissões"
                  icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.comissions ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.comissions ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.comissions ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos de Produto"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.internal_costs ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.internal_costs ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.internal_costs ?? "0"), period: "90 dias" }]} />
                </StatCard>
        </div>
        <div className="grid grid-cols-3 gap-4">
      
    </div>
    </div>
    
    </Section>
    <Section title="Distribuição de Vendas por Faixa de Preço">
      {(() => {
        // Ordem das faixas de preço (conforme definido no enum)
        const priceRangesOrder: Array<"Até R$ 29,99" | "R$ 30 a R$ 49,99" | "R$ 50 a R$ 99,99" | "R$ 100 a R$ 199,99" | "R$ 200 a R$ 499,99" | "R$ 500 a R$ 999,99" | "R$ 1.000,00 a R$ 1.999,99" | "Mais de R$ 2.000,00"> = [
          "Até R$ 29,99",
          "R$ 30 a R$ 49,99",
          "R$ 50 a R$ 99,99",
          "R$ 100 a R$ 199,99",
          "R$ 200 a R$ 499,99",
          "R$ 500 a R$ 999,99",
          "R$ 1.000,00 a R$ 1.999,99",
          "Mais de R$ 2.000,00",
        ];

        // Transforma os dados de price_ranges em formato para o gráfico
        const chartData = useMemo(() => {
          const priceRanges30 = (invoicingMetrics?.data?.["30"]?.price_ranges ?? {}) as Record<string, number>;
          const priceRanges60 = (invoicingMetrics?.data?.["60"]?.price_ranges ?? {}) as Record<string, number>;
          const priceRanges90 = (invoicingMetrics?.data?.["90"]?.price_ranges ?? {}) as Record<string, number>;

          return priceRangesOrder.map((faixa) => {
            const vendas30 = priceRanges30[faixa] ?? 0;
            const vendas60 = priceRanges60[faixa] ?? 0;
            const vendas90 = priceRanges90[faixa] ?? 0;
            const total = vendas30 + vendas60 + vendas90;

            return {
              faixa,
              vendas30,
              vendas60,
              vendas90,
              total,
            };
          });
        }, [invoicingMetrics?.data]);

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

        const totalVendas = chartData.reduce(
          (acc, item) =>
            acc + item.vendas30 + item.vendas60 + item.vendas90,
          0,
        );

        return (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-beergam-typography-secondary">
              Distribuição de{" "}
              <span className="font-semibold">{totalVendas}</span> vendas.
            </p>
            <div className="h-[320px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={chartData} accessibilityLayer>
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
import { Skeleton, Stack } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useIncomingsBySku, useInvoicingMetrics, useInvoicingMetricsByMonths, useSelfServiceReturn } from "~/features/invoicing/hooks";
import authStore from "~/features/store-zustand";
import SkuProfitabilityList from "~/routes/financeiro/components/SkuProfitabilityList";
import Svg from "~/src/assets/svgs/_index";
import { BeergamAlert } from "~/src/components/ui/BeergamAlert";
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
import { Fields } from "~/src/components/utils/_fields";
import { useCensorship } from "~/src/components/utils/Censorship/CensorshipContext";
import { CensorshipWrapper } from "~/src/components/utils/Censorship/CensorshipWrapper";
import { TextCensored } from "~/src/components/utils/Censorship/TextCensored";
import type { TPREDEFINED_CENSORSHIP_KEYS } from "~/src/components/utils/Censorship/typings";
import { FilterDateRangePicker } from "~/src/components/filters";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
interface SectionContent{
    value: string;
    period: string;
    percentage?: string | number | null | undefined;
    percentageText?: string | number | null | undefined;
}
type PercentageBadgeProps = {
    percentage?: string | number | null | undefined;
    showPercentageSymbol?: boolean;
    isRedCondition?: (value: number) => boolean;
    isGreenCondition?: (value: number) => boolean;
    percentageText?: string | number | null | undefined;
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

const DEFAULT_SKU_DATE_FROM = dayjs().subtract(30, "day").format("YYYY-MM-DD");
const DEFAULT_SKU_DATE_TO = dayjs().format("YYYY-MM-DD");

export default function LucratividadePage() {
	const [skuDateRange, setSkuDateRange] = useState<{ start: string; end: string }>({
		start: DEFAULT_SKU_DATE_FROM,
		end: DEFAULT_SKU_DATE_TO,
	});

  const {data: invoicingMetrics, isLoading: isLoadingInvoicingMetrics} = useInvoicingMetrics();
	const {data: invoicingMetricsByMonths, isLoading: isLoadingInvoicingMetricsByMonths} = useInvoicingMetricsByMonths();
	const {data: incomingsBySku, isLoading: isLoadingIncomingsBySku} = useIncomingsBySku({
		start_date: skuDateRange.start,
		end_date: skuDateRange.end,
	});
  const subscription = authStore.use.subscription() ?? null;
  const user = authStore.use.user();
  const isBasePlan = subscription?.plan.display_name === 'Operacional';
  const {data: selfServiceReturn, isLoading: isLoadingSelfServiceReturn} = useSelfServiceReturn();

  // Pega o valor do flex do usuário (apenas IUser tem esse campo, IColab não)
  const pricePerSelfServiceReturn =
    (user?.details && "meli_flex_shipping_fee" in user.details
      ? user.details.meli_flex_shipping_fee
      : null) ?? 0;

  // Função helper para calcular o resultado do Flex: valor_recebido_do_flex - (input * total_orders)
  const calculateFlexResult = (period: "30" | "60" | "90"): number => {
    const valorRecebido = selfServiceReturn?.data?.[period]?.valor_recebido_do_flex ?? 0;
    const totalOrders = selfServiceReturn?.data?.[period]?.total_orders ?? 0;
    return valorRecebido - (pricePerSelfServiceReturn * totalOrders);
  };

  function getFlexSpent(period: "30" | "60" | "90"): number {
    const totalOrders = selfServiceReturn?.data?.[period]?.total_orders ?? 0;
    const inputValue = pricePerSelfServiceReturn ?? 0;
    return inputValue * totalOrders;
  }

  // Calcula os nomes dos meses dinamicamente
  const monthNames = {
    "30": dayjs().locale("pt-br").format("MMMM"), // Mês atual
    "60": dayjs().subtract(1, "month").locale("pt-br").format("MMMM"), // Mês anterior
    "90": dayjs().subtract(2, "month").locale("pt-br").format("MMMM"), // 2 meses atrás
  };
  function PercentageBadge({ 
    percentage, 
    showPercentageSymbol = true,
    isRedCondition,
    isGreenCondition,
    percentageText
  }: PercentageBadgeProps) {
    const isUnknown = percentage === null || percentage === undefined;
    const percentageValue = isUnknown ? 0 : parseFloat(percentage.toString());
    
    // Determina a cor baseado nas condições customizadas ou na lógica padrão
    // A cor é sempre determinada pelo valor de percentage, não por percentageText
    let isRed = false;
    let isGreen = false;
    
    if (!isUnknown) {
      if (isRedCondition) {
        isRed = isRedCondition(percentageValue);
      } else {
        isRed = percentageValue < 0;
      }
      
      if (isGreenCondition) {
        isGreen = isGreenCondition(percentageValue);
      } else {
        isGreen = percentageValue > 20;
      }
    }
    
    const percentageColor = isUnknown 
      ? 'bg-beergam-gray/20' 
      : isRed 
        ? 'bg-beergam-red/20' 
        : isGreen 
          ? 'bg-beergam-green-primary/20' 
          : 'bg-beergam-yellow/20';
    
    const percentageTextColor = isUnknown 
      ? 'text-beergam-gray' 
      : isRed 
        ? 'text-beergam-red' 
        : isGreen 
          ? 'text-beergam-green-primary' 
          : 'text-beergam-yellow';
    
    // Usa percentageText se disponível, caso contrário usa percentage
    const textToDisplay = percentageText !== null && percentageText !== undefined 
      ? percentageText.toString()
      : isUnknown 
        ? '?' 
        : showPercentageSymbol 
          ? `${percentage}%` 
          : percentage.toString();
    
    return <div data-tooltip-id={`percentage-badge-${percentage}`} className={`p-1 px-2 rounded-lg flex items-center w-fit mb-2 gap-1 justify-center text-xs md:text-sm ${percentageColor}`}>
      <p className={`${percentageTextColor}!`}>{textToDisplay}</p>
      { !isUnknown && (isRed ? <Svg.arrow_trending_down tailWindClasses="h-3 w-3 md:h-4 md:w-4 text-beergam-red" /> : <Svg.arrow_trending_up tailWindClasses={`h-3 w-3 md:h-4 md:w-4 ${percentageTextColor}`} />)}
      {
        isUnknown && <Tooltip content={isBasePlan ? 'Informação indisponível para o plano atual.' : 'Informação indisponível.'} id={`percentage-badge-${percentage}`}></Tooltip>
      }
    </div>
  }
    function SectionContent({ censorshipKey, topText, index, value, period, percentage, canShowPercentage = false, showPercentageSymbol, isRedCondition, isGreenCondition, percentageText }: SectionContent & { censorshipKey: TPREDEFINED_CENSORSHIP_KEYS, topText?: string, index: number, canShowPercentage?: boolean, showPercentageSymbol?: boolean, isRedCondition?: (value: number) => boolean, isGreenCondition?: (value: number) => boolean, percentageText?: string | number | null | undefined }) {
        const { isCensored } = useCensorship();
        const censored = censorshipKey ? isCensored(censorshipKey) : false;
        return(
            <>
            <div className={`h-full grid content-end border-b border-b-beergam-primary pb-2 md:border-b-0 md:border-r md:pr-2 ${index != 2 ? 'md:border-r-beergam-primary' : 'md:border-r-transparent'}`}>
                        {canShowPercentage && <PercentageBadge percentage={percentage} showPercentageSymbol={showPercentageSymbol} isRedCondition={isRedCondition} isGreenCondition={isGreenCondition} percentageText={percentageText} />}
                        {topText && <p className="text-[11px] md:text-[12px] capitalize">{topText}</p>}
                        <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold wrap-break-word"><TextCensored forceCensor={censored} censorshipKey={censorshipKey}>{value}</TextCensored></h3>
                        <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary! capitalize">{period}</p>
                    </div>
            </>
        )
    }

    function SectionContentCard({ censorshipKey, contents, isLoading }: { censorshipKey: TPREDEFINED_CENSORSHIP_KEYS, contents: (SectionContent & { canShowPercentage?: boolean, topText?: string, showPercentageSymbol?: boolean, isRedCondition?: (value: number) => boolean, isGreenCondition?: (value: number) => boolean, percentageText?: string | number | null | undefined})[], isLoading?: boolean }) {
        
      return(
            <AsyncBoundary ErrorFallback={() => (
              <BeergamAlert severity="error">
                Não foi possível carregar o conteúdo.
              </BeergamAlert>
            )} isLoading={isLoading} Skeleton={() => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-baseline">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:items-baseline">
                {contents.map((content, index) => (
                    <SectionContent censorshipKey={censorshipKey} topText={content.topText} index={index} key={content.period} canShowPercentage={content.canShowPercentage} {...content} />
                ))}
            </div>
            {/* <p className="text-xl! mt-2"><span className="text-beergam-primary text-xl! font-bold">Total:</span> {total}</p> */}
            </AsyncBoundary>
        )
    }
   return( <div className="w-full min-w-0 overflow-x-hidden">
    <CensorshipWrapper censorshipKey={"lucratividade_faturamento"}>
    <Section title="Faturamento">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
                  title="Total Bruto Acumulado"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard censorshipKey="lucratividade_faturamento" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_bruto ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_bruto ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_bruto ?? "0"), period: "90 dias" }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Acumulado"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_faturamento" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.faturamento_liquido ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.faturamento_liquido ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.faturamento_liquido ?? "0"), period: "90 dias" }]} />
                </StatCard>
            <StatCard
                  title="Total Bruto Mensal"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard censorshipKey="lucratividade_faturamento" isLoading={isLoadingInvoicingMetricsByMonths} contents={[{ canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.gross ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.gross ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0}) : null }, { canShowPercentage: true ,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.gross ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.gross ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.gross ?? null}) : null }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido Mensal"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_faturamento" isLoading={isLoadingInvoicingMetricsByMonths} contents={[{ canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["30"]?.net ?? "0"), period: monthNames["30"], percentage: invoicingMetricsByMonths?.data?.["30"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["30"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["60"]?.net ?? "0"), period: monthNames["60"], percentage: invoicingMetricsByMonths?.data?.["60"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["60"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0}) : null }, { canShowPercentage: true,value: formatCurrency(invoicingMetricsByMonths?.data?.["90"]?.net ?? "0"), period: monthNames["90"], percentage: invoicingMetricsByMonths?.data?.["90"] ? getPercentageNumber({number: invoicingMetricsByMonths?.data?.["90"]?.net ?? 0, target: invoicingMetricsByMonths?.data?.["120"]?.net ?? null}) : null }]} />
                </StatCard>

        </div>
        
    </Section>
    </CensorshipWrapper>
    <CensorshipWrapper censorshipKey={"lucratividade_flex" as TPREDEFINED_CENSORSHIP_KEYS}>
      <Section title="Flex"> 
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <StatCard
                    title="Faturamento Acumulado"
                    input={
                    {component: (
                      <span className="text-sm font-medium text-beergam-typography-primary">
                        {formatCurrency(pricePerSelfServiceReturn)}
                      </span>
                    ), label: "Valor pago no flex por pedido"}
                    }
                    icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}
                  >
                      <SectionContentCard censorshipKey="lucratividade_flex" isLoading={isLoadingSelfServiceReturn} contents={[{ value: formatCurrency(selfServiceReturn?.data?.["30"]?.valor_recebido_do_flex ?? "0"), period: "30 dias", topText: `${selfServiceReturn?.data?.["30"]?.total_orders ?? 0} pedidos` }, { value: formatCurrency(selfServiceReturn?.data?.["60"]?.valor_recebido_do_flex ?? "0"), period: "60 dias", topText: `${selfServiceReturn?.data?.["60"]?.total_orders ?? 0} pedidos` }, { value: formatCurrency(selfServiceReturn?.data?.["90"]?.valor_recebido_do_flex ?? "0"), period: "90 dias", topText: `${selfServiceReturn?.data?.["90"]?.total_orders ?? 0} pedidos` }]} />
                  </StatCard>
                  <StatCard
                    title="Custos Acumulado"
                    icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}

                  >
                      <SectionContentCard censorshipKey="lucratividade_flex" isLoading={isLoadingSelfServiceReturn} contents={[{ value: formatCurrency(getFlexSpent("30").toString()), period: "30 dias", }, { value: formatCurrency(getFlexSpent("60").toString()), period: "60 dias", }, { value: formatCurrency(getFlexSpent("90").toString()), period: "90 dias", }]} />
                  </StatCard>
                  <StatCard
                    title="Lucratividade Acumulada"
                    icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}
                  >
                      <SectionContentCard censorshipKey="lucratividade_flex" isLoading={isLoadingSelfServiceReturn} contents={[{ value: formatCurrency(calculateFlexResult("30").toString()), period: "30 dias", canShowPercentage: true, percentage: calculateFlexResult("30"), percentageText: (() => {
                        return ``;
                      })(), }, { value: formatCurrency(calculateFlexResult("60").toString()), period: "60 dias", canShowPercentage: true, percentage: calculateFlexResult("60"), percentageText: (() => {
                        return ``;
                      })(), }, { value: formatCurrency(calculateFlexResult("90").toString()), period: "90 dias", canShowPercentage: true, percentage: calculateFlexResult("90"), percentageText: (() => {
                        return ``;
                      })(), }]} />
                  </StatCard>
            </div>
          </div>
      </Section>
       </CensorshipWrapper>
    <Section title="Custos">
        <CensorshipWrapper censorshipKey={"lucratividade_custos" as TPREDEFINED_CENSORSHIP_KEYS}>
    <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                  title="Custos com Frete Acumulado (Comprador)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.shipping?.buyer ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.shipping?.buyer ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.shipping?.buyer ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete Acumulado (Vendedor)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.shipping?.seller ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.shipping?.seller ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.shipping?.seller ?? "0"), period: "90 dias" }]} />
                </StatCard>
                            <StatCard
                  title="Custos com Comissões Acumulado"
                  icon={<Svg.box_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.comissions ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.comissions ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.comissions ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos de Produto Acumulado"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.internal_costs ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.internal_costs ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.internal_costs ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Embalagem Acumulado"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.package_costs ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.package_costs ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.package_costs ?? "0"), period: "90 dias" }]} />
                </StatCard>
                  <StatCard
                  title="Custos Extra Acumulado"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard censorshipKey="lucratividade_custos" isLoading={isLoadingInvoicingMetrics} contents={[{ value: formatCurrency(invoicingMetrics?.data?.["30"]?.costs?.extra_costs ?? "0"), period: "30 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["60"]?.costs?.extra_costs ?? "0"), period: "60 dias" }, { value: formatCurrency(invoicingMetrics?.data?.["90"]?.costs?.extra_costs ?? "0"), period: "90 dias" }]} />
                </StatCard>
        </div>
        <div className="grid grid-cols-3 gap-4">
      
    </div>
    </div>
        </CensorshipWrapper>
    </Section>
    <CensorshipWrapper canChange={false} censorshipKey={"lucratividade_distribuicao_vendas" as TPREDEFINED_CENSORSHIP_KEYS}>
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
              <div className="h-[250px] md:h-[320px] w-full overflow-hidden">
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
     </CensorshipWrapper>
     <CensorshipWrapper censorshipKey={"lucratividade_lucro_sku" as TPREDEFINED_CENSORSHIP_KEYS}>
    <Section title="Lucro por SKU">
        <div className="mb-3 w-full max-w-sm">
          <FilterDateRangePicker
            label="Período"
            value={skuDateRange}
            onChange={setSkuDateRange}
            widthType="full"
          />
        </div>

      {isLoadingIncomingsBySku ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-beergam-typography-secondary">Carregando...</p>
        </div>
      ) : (
        incomingsBySku?.data && incomingsBySku?.data.length > 0 ? <SkuProfitabilityList incomingsBySku={incomingsBySku?.data} /> : 
        <div className="flex items-center justify-center p-8">
          <p className="text-beergam-typography-secondary">Nenhum dado encontrado para o período selecionado.</p>
        </div>
      )}
        
    </Section>
    </CensorshipWrapper>
    </div>
   )
}
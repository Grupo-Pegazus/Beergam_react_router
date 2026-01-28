import { Tooltip } from "react-tooltip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import authStore from "~/features/store-zustand";
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
interface SectionContent{
    value: string;
    period: "7" | "15" | "30" | "60" | "90";
    percentage?: string | number;
}
type PercentageBadgeProps = {
    percentage?: string | number | null | undefined;
} 

export default function LucratividadePage() {
  const subscription = authStore.use.subscription() ?? null;
  const isBasePlan = subscription?.plan.display_name === 'Operacional';
  function PercentageBadge({ percentage }: PercentageBadgeProps) {
    const isUnknown = percentage === null || percentage === undefined;
    const percentageValue = isUnknown ? 0 : parseFloat(percentage.toString());
    const isNegative = percentageValue < 0 && !isUnknown;
    const percentageColor = isUnknown ? 'bg-beergam-gray/20' : isNegative ? 'bg-beergam-red/20' : percentageValue > 20 ? 'bg-beergam-green-primary/20' : 'bg-beergam-yellow/20';
    const percentageTextColor = isUnknown ? 'text-beergam-gray' : isNegative ? 'text-beergam-red' : percentageValue > 20 ? 'text-beergam-green-primary' : 'text-beergam-yellow';
    return <div data-tooltip-id={`percentage-badge-${percentage}`} className={`p-1 px-2 rounded-lg flex items-center w-fit mb-2 gap-1 justify-center ${percentageColor}`}>
      <p className={`${percentageTextColor}!`}>{isUnknown ? '?' : `${percentageValue}%`}</p>
      { !isUnknown && (isNegative ? <Svg.arrow_trending_down tailWindClasses="h-4 w-4 text-beergam-red" /> : <Svg.arrow_trending_up tailWindClasses={`h-4 w-4 ${percentageTextColor}`} />)}
      {
        isUnknown && <Tooltip content={isBasePlan ? 'Informação indisponível para o plano atual.' : 'Informação indisponível.'} id={`percentage-badge-${percentage}`}></Tooltip>
      }
    </div>
  }
    function SectionContent({ index, value, period, percentage }: SectionContent & { index: number }) {
        return(
            <>
            <div className={`border-r h-full grid content-end ${index != 2 ? 'border-r-beergam-primary' : 'border-r-transparent'}`}>
                        <PercentageBadge percentage={percentage} />
                        <h3 className="text-[18px]! text-beergam-primary font-bold">{value}</h3>
                        <p className="text-[12px] text-beergam-typography-tertiary!">{period} dias</p>
                    </div>
            </>
        )
    }

    function SectionContentCard({ contents }: { contents: SectionContent[] }) {
        return(
            <>
            <div className="grid grid-cols-3 gap-2 items-baseline">
                {contents.map((content, index) => (
                    <SectionContent index={index} key={content.period} {...content} />
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
                  title="Total Bruto"
                  icon={<Svg.graph_solid tailWindClasses="h-5 w-5" />}
                >
                   <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30", percentage: "10.32" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90", percentage: "30" }]} />
                </StatCard>
                <StatCard
                  title="Total Líquido"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
                </StatCard>
                <StatCard
                  title="Total Bruto + Frete Recebido"
                  icon={<Svg.currency_dollar_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
                </StatCard>
                <StatCard
                  title="Retorno do FLEX"
                  icon={<Svg.star_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
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
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete (Comprador)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
                </StatCard>
                  <StatCard
                  title="Custos com Frete (Vendedor)"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
                </StatCard>
                  <StatCard
                  title="Custos de Produto"
                  icon={<Svg.truck_solid tailWindClasses="h-5 w-5" />}
                >
                    <SectionContentCard contents={[{ value: "R$ 1.000,00", period: "30" }, { value: "R$ 2.000,00", period: "60" }, { value: "R$ 3.000,00", period: "90" }]} />
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
    </>
   )
}
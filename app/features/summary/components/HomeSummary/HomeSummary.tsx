import { Skeleton } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useHomeSummary } from "../../hooks";

type PeriodFilter = 1 | 7 | 15 | 30 | 90;

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 1, label: "1 dia" },
  { value: 7, label: "7 dias" },
  { value: 15, label: "15 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
];

type PeriodButtonProps = {
  option: { value: PeriodFilter; label: string };
  isSelected: boolean;
  onSelect: (value: PeriodFilter) => void;
};

const PeriodButton = memo(
  ({ option, isSelected, onSelect }: PeriodButtonProps) => {
    const handleClick = useCallback(() => {
      onSelect(option.value);
    }, [option.value, onSelect]);

    const className = useMemo(
      () =>
        [
          "px-3 py-2 rounded-lg text-xs sm:text-sm font-medium",
          "transition-all duration-200 min-h-[36px]",
          "touch-manipulation",
          isSelected
            ? "bg-beergam-primary text-white shadow-md"
            : "bg-beergam-button-background-primary text-beergam-typography-secondary hover:bg-beergam-primary/95 hover:text-beergam-white",
        ].join(" "),
      [isSelected]
    );

    return (
      <button onClick={handleClick} className={className} type="button">
        {option.label}
      </button>
    );
  }
);

PeriodButton.displayName = "PeriodButton";

const HomeSummarySkeleton = memo(() => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-wrap gap-2">
      {PERIOD_OPTIONS.map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={80}
          height={36}
          className="rounded-lg"
        />
      ))}
    </div>
    <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={120}
          className="rounded-lg"
        />
      ))}
    </div>
    <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={100}
          className="rounded-lg"
        />
      ))}
    </div>
  </div>
));

HomeSummarySkeleton.displayName = "HomeSummarySkeleton";

const ErrorFallback = memo(() => (
  <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
    Não foi possível carregar o resumo da home.
  </div>
));

ErrorFallback.displayName = "ErrorFallback";

export default function HomeSummary() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(1);

  const { data, isLoading, error } = useHomeSummary(selectedPeriod);

  const summaryData = useMemo(() => {
    if (!data?.success || !data.data) {
      return null;
    }
    return data.data;
  }, [data]);

  const handlePeriodChange = useCallback((period: PeriodFilter) => {
    setSelectedPeriod(period);
  }, []);

  const marginPercentual = useMemo(() => {
    if (!summaryData) return "0%";
    return `${(summaryData.margem_percentual * 100).toFixed(2)}%`;
  }, [summaryData]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={HomeSummarySkeleton}
      ErrorFallback={ErrorFallback}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Filtros de período */}
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <PeriodButton
              key={option.value}
              option={option}
              isSelected={selectedPeriod === option.value}
              onSelect={handlePeriodChange}
            />
          ))}
        </div>

        {summaryData && (
          <>
            {/* Métricas principais - Mobile: empilhadas, Desktop: lado a lado */}
            <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
              {/* Faturamento */}
              <CensorshipWrapper censorshipKey="home_summary_faturamento_bruto">
                <StatCard
                  title="Faturamento"
                  icon={<Svg.currency_dollar tailWindClasses="h-5 w-5" />}
                >
                  <div className="text-lg md:text-xl lg:text-2xl font-bold">
                    <TextCensored
                      className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                      censorshipKey="home_summary_faturamento_bruto"
                    >
                      {formatCurrency(summaryData.faturamento_bruto)}
                    </TextCensored>
                  </div>
                </StatCard>
              </CensorshipWrapper>

              {/* Lucro */}
              <CensorshipWrapper censorshipKey="home_summary_lucro_liquido">
                <StatCard
                  title="Lucro"
                  icon={<Svg.graph tailWindClasses="h-5 w-5" />}
                >
                  <div className="flex flex-col gap-1">
                    <TextCensored
                      censorshipKey="home_summary_lucro_liquido"
                      className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                    >
                      {formatCurrency(summaryData.lucro_liquido)}
                    </TextCensored>
                    <TextCensored
                      censorshipKey="home_summary_lucro_liquido"
                      className="text-xs! md:text-sm! mt-1!"
                    >
                      ({marginPercentual})
                    </TextCensored>
                  </div>
                </StatCard>
              </CensorshipWrapper>
            </div>

            {/* Grid de métricas secundárias - Mobile: 2 colunas, Desktop: 4 colunas */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
              {/* Vendas */}
              <CensorshipWrapper censorshipKey="home_summary_vendas">
                <StatCard
                  title="Vendas"
                  icon={<Svg.bag tailWindClasses="h-5 w-5" />}
                >
                  <TextCensored
                    censorshipKey="home_summary_vendas"
                    className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                  >
                    {summaryData.unidades} unidades
                  </TextCensored>
                </StatCard>
              </CensorshipWrapper>

              {/* Ticket médio */}
              <CensorshipWrapper censorshipKey="home_summary_ticket_medio">
                <StatCard
                  title="Ticket médio"
                  icon={<Svg.currency_dollar tailWindClasses="h-5 w-5" />}
                >
                  <TextCensored
                    censorshipKey="home_summary_ticket_medio"
                    className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                  >
                    {formatCurrency(summaryData.ticket_medio)}
                  </TextCensored>
                </StatCard>
              </CensorshipWrapper>
              {/* Lucro médio */}
              <CensorshipWrapper censorshipKey="home_summary_lucro_medio">
                <StatCard
                  title="Lucro médio"
                  icon={<Svg.graph tailWindClasses="h-5 w-5" />}
                >
                  <TextCensored
                    censorshipKey="home_summary_lucro_medio"
                    className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                  >
                    {formatCurrency(summaryData.lucro_medio)}
                  </TextCensored>
                </StatCard>
              </CensorshipWrapper>
              {/* Canceladas */}
              <CensorshipWrapper censorshipKey="home_summary_canceladas">
                <StatCard
                  title="Canceladas"
                  icon={<Svg.circle_x tailWindClasses="h-5 w-5" />}
                >
                  <div className="flex flex-col gap-1">
                    <TextCensored
                      censorshipKey="home_summary_canceladas"
                      className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                    >
                      {summaryData.canceladas.quantidade}
                    </TextCensored>
                    <TextCensored
                      censorshipKey="home_summary_canceladas"
                      className="text-xs! md:text-sm! mt-1!"
                    >
                      ({formatCurrency(summaryData.canceladas.valor_total)})
                    </TextCensored>
                  </div>
                </StatCard>
              </CensorshipWrapper>
            </div>
          </>
        )}
      </div>
    </AsyncBoundary>
  );
}

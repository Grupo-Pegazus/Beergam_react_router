import { Skeleton, Stack, Typography } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { FilterDateRangePicker } from "~/src/components/filters";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import SecondaryButton from "~/src/components/ui/SecondaryButton";
import StatCard from "~/src/components/ui/StatCard";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
import { dateStringToISO } from "~/src/utils/date";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useHomeSummary } from "../../hooks";

type PeriodFilter = 0 | 1 | 7 | 15 | 30 | 90 | "custom";

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 0, label: "Hoje" },
  { value: 1, label: "Ontem" },
  { value: 7, label: "7 dias" },
  { value: 15, label: "15 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: "custom", label: "Personalizado" },
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

    return (
      <SecondaryButton isSelected={isSelected} onSelect={handleClick}>
        {option.label}
      </SecondaryButton>
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
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const filters = useMemo(
    () => ({
      period: selectedPeriod,
      date_from:
        selectedPeriod === "custom" && dateRange?.start
          ? dateStringToISO(dateRange.start)
          : undefined,
      date_to:
        selectedPeriod === "custom" && dateRange?.end
          ? dateStringToISO(dateRange.end)
          : undefined,
    }),
    [selectedPeriod, dateRange]
  );

  const { data, isLoading, error } = useHomeSummary(filters);

  const summaryData = useMemo(() => {
    if (!data?.success || !data.data) {
      return null;
    }
    return data.data;
  }, [data]);

  const handlePeriodChange = useCallback((period: PeriodFilter) => {
    setSelectedPeriod(period);
    if (period !== "custom") {
      setDateRange(null);
    }
  }, []);

  const handleDateRangeChange = useCallback((value: { start: string; end: string }) => {
    setDateRange(value);
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
        <div className="flex flex-col gap-2">
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

          {selectedPeriod === "custom" && (
            <div className="mt-2 w-full max-w-sm">
              <FilterDateRangePicker
                label="Período"
                value={dateRange}
                onChange={handleDateRangeChange}
                widthType="full"
                defaultOpen
              />
            </div>
          )}
        </div>

        {selectedPeriod === "custom" && (!dateRange?.start || !dateRange?.end) ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] rounded-lg border border-dashed border-beergam-typography-secondary! bg-beergam-section-background p-4">
            <p className="text-center text-sm md:text-base text-beergam-typography-secondary!">
              Selecione o intervalo de datas para visualizar o resumo.
            </p>
          </div>
        ) : (
          summaryData && (
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
                  title="Vendas e Unidades"
                  icon={<Svg.bag tailWindClasses="h-5 w-5" />}
                >
                  <TextCensored
                    censorshipKey="home_summary_vendas"
                    className="text-lg! md:text-xl! lg:text-2xl! font-bold!"
                  >
                    {summaryData.vendas} vendas | {summaryData.unidades} unidades
                  </TextCensored>
                </StatCard>
              </CensorshipWrapper>

              {/* Ticket médio */}
              <CensorshipWrapper censorshipKey="home_summary_ticket_medio">
                <StatCard
                  title="Ticket Médio"
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
        )
        )}
      </div>
    </AsyncBoundary>
  );
}

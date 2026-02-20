import { createElement, memo, useCallback, useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import SecondaryButton from "~/src/components/ui/SecondaryButton";
import StatCard from "~/src/components/ui/StatCard";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useOrdersMetrics } from "../../hooks";
import MetricasCardsSkeleton from "./MetricasCardsSkeleton";
import type { DeliveryStatusFilter } from "../Filters/types";

function createSvgIcon(iconName: keyof typeof Svg, className: string) {
  return createElement(Svg[iconName], {
    tailWindClasses: className,
  } as Record<string, unknown>);
}

type PeriodFilter = 0 | 1 | 7 | 15 | 30 | 90;

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 0, label: "Hoje" },
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

    return (
      <SecondaryButton isSelected={isSelected} onSelect={handleClick}>
        {option.label}
      </SecondaryButton>
    );
  }
);

PeriodButton.displayName = "PeriodButton";

type StatusCensorshipKey =
  | "vendas_resumo_status_prontas_para_enviar"
  | "vendas_resumo_status_pendentes"
  | "vendas_resumo_status_em_transito"
  | "vendas_resumo_status_concluidas";

type RevenueCensorshipKey =
  | "vendas_resumo_faturamento_bruto"
  | "vendas_resumo_faturamento_liquido"
  | "vendas_resumo_media_faturamento_diario";

interface SummaryCardDefinition {
  key: string;
  censorshipKey: StatusCensorshipKey | RevenueCensorshipKey;
  label: string;
  icon: keyof typeof Svg;
  color: "slate" | "yellow" | "blue" | "green" | "orange";
  formatter?: (value: string | number) => string;
  deliveryStatusFilter?: DeliveryStatusFilter;
}

interface MetricasCardsProps {
  onStatusCardClick?: (
    deliveryStatusFilter: DeliveryStatusFilter,
    periodDays: PeriodFilter
  ) => void;
}

const SUMMARY_CARDS: SummaryCardDefinition[] = [
  {
    key: "prontas_para_enviar",
    censorshipKey: "vendas_resumo_status_prontas_para_enviar",
    label: "Prontas para enviar",
    icon: "in_box_stack",
    color: "yellow",
    deliveryStatusFilter: "ready_to_ship",
  },
  {
    key: "pendentes",
    censorshipKey: "vendas_resumo_status_pendentes",
    label: "Pendentes",
    icon: "warning_circle",
    color: "orange",
    deliveryStatusFilter: "pending",
  },
  {
    key: "em_transito",
    censorshipKey: "vendas_resumo_status_em_transito",
    label: "Em trânsito",
    icon: "truck",
    color: "blue",
    deliveryStatusFilter: "shipped",
  },
  {
    key: "concluidas",
    censorshipKey: "vendas_resumo_status_concluidas",
    label: "Concluídas",
    icon: "check_circle",
    color: "green",
    deliveryStatusFilter: "delivered",
  },
];

const REVENUE_CARDS: SummaryCardDefinition[] = [
  {
    key: "faturamento_bruto",
    label: "Total Bruto",
    icon: "currency_dollar",
    color: "blue",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_faturamento_bruto",
  },
  {
    key: "faturamento_liquido",
    label: "Total Líquido",
    icon: "currency_dollar",
    color: "green",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_faturamento_liquido",
  },
  {
    key: "media_faturamento_diario",
    label: "Média Diária",
    icon: "graph",
    color: "slate",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_media_faturamento_diario",
  },
];

export default function MetricasCards({ onStatusCardClick }: MetricasCardsProps = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(90);
  const { data, isLoading, error } = useOrdersMetrics(selectedPeriod);

  const handlePeriodChange = useCallback((period: PeriodFilter) => {
    setSelectedPeriod(period);
  }, []);

  const ordersByStatus = useMemo(() => {
    if (!data?.success || !data.data) {
      return {
        prontas_para_enviar: 0,
        em_transito: 0,
        concluidas: 0,
      };
    }
    return data.data.orders_by_status;
  }, [data]);

  const revenueData = useMemo(() => {
    if (!data?.success || !data.data) {
      return {
        faturamento_bruto: "0",
        faturamento_liquido: "0",
        media_faturamento_diario: "0",
      };
    }
    return {
      faturamento_bruto: data.data.faturamento_bruto,
      faturamento_liquido: data.data.faturamento_liquido,
      media_faturamento_diario: data.data.media_faturamento_diario,
    };
  }, [data]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={MetricasCardsSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar as métricas de vendas.
        </div>
      )}
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

        <div>
          <h4 className="text-xs md:text-sm font-semibold text-beergam-typography-secondary mb-2 md:mb-3">
            Suas vendas
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {SUMMARY_CARDS.map((card) => {
              const value =
                ordersByStatus[card.key as keyof typeof ordersByStatus];
              return (
                <CensorshipWrapper
                  key={card.key}
                  censorshipKey={card.censorshipKey}
                >
                  <StatCard
                    censorshipKey={card.censorshipKey}
                    icon={createSvgIcon(card.icon, "h-5 w-5")}
                    title={card.label}
                    value={value}
                    variant="soft"
                    color={card.color}
                    onClick={
                      card.deliveryStatusFilter && onStatusCardClick
                        ? () => onStatusCardClick(card.deliveryStatusFilter!, selectedPeriod)
                        : undefined
                    }
                  />
                </CensorshipWrapper>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs md:text-sm font-semibold text-beergam-typography-secondary mb-2 md:mb-3">
            Faturamento
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {REVENUE_CARDS.map((card) => {
              const value = revenueData[card.key as keyof typeof revenueData];
              const formattedValue = card.formatter
                ? card.formatter(value)
                : value;
              return (
                <CensorshipWrapper
                  key={card.key}
                  censorshipKey={card.censorshipKey}
                >
                  <StatCard
                    censorshipKey={card.censorshipKey}
                    icon={createSvgIcon(card.icon, "h-5 w-5 text-beergam-white")}
                    title={card.label}
                    value={formattedValue}
                    variant="soft"
                    color={card.color}
                  />
                </CensorshipWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </AsyncBoundary>
  );
}

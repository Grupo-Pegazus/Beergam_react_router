import { Skeleton } from "@mui/material";
import { createElement, useMemo } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useOrdersMetrics } from "../../hooks";

interface SummaryCardDefinition {
  key: string;
  label: string;
  icon: keyof typeof Svg;
  color: "slate" | "yellow" | "blue" | "green" | "orange";
  formatter?: (value: string | number) => string;
}

const QUICK_STATUS_CARDS: SummaryCardDefinition[] = [
  {
    key: "prontas_para_enviar",
    label: "Prontas para enviar",
    icon: "in_box_stack",
    color: "yellow",
  },
  {
    key: "pendentes",
    label: "Pendentes",
    icon: "warning_circle",
    color: "orange",
  },
  {
    key: "em_transito",
    label: "Em trânsito",
    icon: "truck",
    color: "blue",
  },
  {
    key: "concluidas",
    label: "Concluídas",
    icon: "check_circle",
    color: "green",
  },
];

const REVENUE_CARDS: SummaryCardDefinition[] = [
  {
    key: "faturamento_bruto",
    label: "Faturamento Bruto",
    icon: "currency_dollar",
    color: "blue",
    formatter: formatCurrency,
  },
  {
    key: "faturamento_liquido",
    label: "Faturamento Líquido",
    icon: "currency_dollar",
    color: "green",
    formatter: formatCurrency,
  },
  {
    key: "media_faturamento_diario",
    label: "Média diária",
    icon: "graph",
    color: "slate",
    formatter: formatCurrency,
  },
];

export default function VendasResumo() {
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
  } = useOrdersMetrics(90);

  const ordersByStatus = useMemo(() => {
    if (!metricsData?.success || !metricsData.data) {
      return {
        prontas_para_enviar: 0,
        em_transito: 0,
        concluidas: 0,
      };
    }
    return {
      prontas_para_enviar:
        metricsData.data.orders_by_status.prontas_para_enviar,
      em_transito: metricsData.data.orders_by_status.em_transito,
      concluidas: metricsData.data.orders_by_status.concluidas,
    };
  }, [metricsData]);

  const revenueMetrics = useMemo(() => {
    if (!metricsData?.success || !metricsData.data) {
      return {
        faturamento_bruto: "0",
        faturamento_liquido: "0",
        media_faturamento_diario: "0",
      };
    }
    return {
      faturamento_bruto: metricsData.data.faturamento_bruto,
      faturamento_liquido: metricsData.data.faturamento_liquido,
      media_faturamento_diario: metricsData.data.media_faturamento_diario,
    };
  }, [metricsData]);

  const isLoading = isLoadingMetrics;

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={metricsError as unknown}
      Skeleton={() => (
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={100}
              className="rounded-lg"
            />
          ))}
        </div>
      )}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar o resumo de vendas.
        </div>
      )}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Status rápidos */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-beergam-typography-secondary mb-2 md:mb-3">
            Status das Vendas
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_STATUS_CARDS.map((card) => {
              const value =
                ordersByStatus[card.key as keyof typeof ordersByStatus];
              return (
                <CensorshipWrapper
                  key={card.key}
                  censorshipKey={`vendas_resumo_status_${card.key}`}
                >
                  <StatCard
                    icon={createElement(Svg[card.icon], {
                      tailWindClasses: "h-5 w-5",
                    })}
                    title={card.label}
                    value={value}
                    variant="soft"
                    censorshipKey={`vendas_resumo_status_${card.key}`}
                  />
                </CensorshipWrapper>
              );
            })}
          </div>
        </div>

        {/* Faturamento */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-beergam-typography-secondary mb-2 md:mb-3">
            Faturamento
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {REVENUE_CARDS.map((card) => {
              const value =
                revenueMetrics[card.key as keyof typeof revenueMetrics];
              const formattedValue = card.formatter
                ? card.formatter(value)
                : value;
              return (
                <CensorshipWrapper
                  key={card.key}
                  censorshipKey={`vendas_resumo_${card.key}`}
                >
                  <StatCard
                    key={card.key}
                    icon={createElement(Svg[card.icon], {
                      tailWindClasses: "h-5 w-5",
                    })}
                    title={card.label}
                    censorshipKey={`vendas_resumo_${card.key}`}
                    value={formattedValue}
                    variant="soft"
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

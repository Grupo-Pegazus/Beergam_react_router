import { createElement, useMemo } from "react";
import { useOrdersMetrics } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { Skeleton } from "@mui/material";

interface SummaryCardDefinition {
  key: string;
  label: string;
  icon: keyof typeof Svg;
  color: "slate" | "yellow" | "blue" | "green";
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
    key: "faturamento_bruto_90d",
    label: "Faturamento Bruto",
    icon: "currency_dollar",
    color: "blue",
    formatter: formatCurrency,
  },
  {
    key: "faturamento_liquido_90d",
    label: "Faturamento Líquido",
    icon: "currency_dollar",
    color: "green",
    formatter: formatCurrency,
  },
  {
    key: "media_faturamento_diario_90d",
    label: "Média diária",
    icon: "graph",
    color: "slate",
    formatter: formatCurrency,
  }
];

export default function VendasResumo() {
  const { data: metricsData, isLoading: isLoadingMetrics, error: metricsError } = useOrdersMetrics();

  const ordersByStatus = useMemo(() => {
    if (!metricsData?.success || !metricsData.data) {
      return {
        prontas_para_enviar: 0,
        em_transito: 0,
        concluidas: 0,
      };
    }
    return {
      prontas_para_enviar: metricsData.data.orders_by_status.prontas_para_enviar,
      em_transito: metricsData.data.orders_by_status.em_transito,
      concluidas: metricsData.data.orders_by_status.concluidas,
    };
  }, [metricsData]);

  const revenueMetrics = useMemo(() => {
    if (!metricsData?.success || !metricsData.data) {
      return {
        faturamento_bruto_90d: "0",
        faturamento_liquido_90d: "0",
        media_faturamento_diario_90d: "0",
      };
    }
    return {
      faturamento_bruto_90d: metricsData.data.faturamento_bruto_90d,
      faturamento_liquido_90d: metricsData.data.faturamento_liquido_90d,
      media_faturamento_diario_90d: metricsData.data.media_faturamento_diario_90d,
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
            <Skeleton key={i} variant="rectangular" height={100} className="rounded-lg" />
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
          <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
            Status das Vendas (90 dias)
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
            {QUICK_STATUS_CARDS.map((card) => {
              const value = ordersByStatus[card.key as keyof typeof ordersByStatus];
              return (
                <StatCard
                  key={card.key}
                  icon={createElement(Svg[card.icon], {
                    tailWindClasses: "h-5 w-5 text-beergam-blue-primary",
                  })}
                  title={card.label}
                  value={value}
                  variant="soft"
                  color={card.color}
                />
              );
            })}
          </div>
        </div>

        {/* Faturamento */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
            Faturamento (90 dias)
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {REVENUE_CARDS.map((card) => {
              const value = revenueMetrics[card.key as keyof typeof revenueMetrics];
              const formattedValue = card.formatter
                ? card.formatter(value)
                : value;
              return (
                <StatCard
                  key={card.key}
                  icon={createElement(Svg[card.icon], {
                    tailWindClasses: "h-5 w-5 text-beergam-blue-primary",
                  })}
                  title={card.label}
                  value={formattedValue}
                  variant="soft"
                  color={card.color}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AsyncBoundary>
  );
}


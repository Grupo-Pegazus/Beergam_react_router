import { createElement, useMemo } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useOrdersMetrics } from "../../hooks";
import MetricasCardsSkeleton from "./MetricasCardsSkeleton";

interface SummaryCardDefinition {
  key: string;
  censorshipKey: string;
  label: string;
  icon: keyof typeof Svg;
  color: "slate" | "yellow" | "blue" | "green";
  formatter?: (value: string | number) => string;
}

const SUMMARY_CARDS: SummaryCardDefinition[] = [
  {
    key: "a_preparar",
    censorshipKey: "vendas_resumo_a_preparar",
    label: "A preparar",
    icon: "clock",
    color: "slate",
  },
  {
    key: "prontas_para_enviar",
    censorshipKey: "vendas_resumo_status_prontas_para_enviar",
    label: "Prontas para enviar",
    icon: "in_box_stack",
    color: "yellow",
  },
  {
    key: "em_transito",
    censorshipKey: "vendas_resumo_status_em_transito",
    label: "Em trânsito",
    icon: "truck",
    color: "blue",
  },
  {
    key: "concluidas",
    censorshipKey: "vendas_resumo_status_concluidas",
    label: "Concluídas",
    icon: "check_circle",
    color: "green",
  },
];

const REVENUE_CARDS: SummaryCardDefinition[] = [
  {
    key: "faturamento_bruto_90d",
    label: "Total Bruto",
    icon: "currency_dollar",
    color: "blue",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_faturamento_bruto_90d",
  },
  {
    key: "faturamento_liquido_90d",
    label: "Total Líquido",
    icon: "currency_dollar",
    color: "green",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_faturamento_liquido_90d",
  },
  {
    key: "media_faturamento_diario_90d",
    label: "Média Bruto Diário",
    icon: "graph",
    color: "slate",
    formatter: formatCurrency,
    censorshipKey: "vendas_resumo_media_faturamento_diario_90d",
  },
];

export default function MetricasCards() {
  const { data, isLoading, error } = useOrdersMetrics();

  const ordersByStatus = useMemo(() => {
    if (!data?.success || !data.data) {
      return {
        a_preparar: 0,
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
        faturamento_bruto_90d: "0",
        faturamento_liquido_90d: "0",
        media_faturamento_diario_90d: "0",
      };
    }
    return {
      faturamento_bruto_90d: data.data.faturamento_bruto_90d,
      faturamento_liquido_90d: data.data.faturamento_liquido_90d,
      media_faturamento_diario_90d: data.data.media_faturamento_diario_90d,
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
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
            Suas vendas
          </h4>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                    icon={createElement(Svg[card.icon], {
                      tailWindClasses: "h-5 w-5",
                    })}
                    title={card.label}
                    value={value}
                    variant="soft"
                  />
                </CensorshipWrapper>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">
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
                    icon={createElement(Svg[card.icon], {
                      tailWindClasses: "h-5 w-5 text-beergam-blue-primary",
                    })}
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

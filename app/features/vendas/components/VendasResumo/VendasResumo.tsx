import { Skeleton } from "@mui/material";
import { createElement, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useOrdersMetrics } from "../../hooks";
import type { DeliveryStatusFilter } from "../Filters/types";
import MainCards from "~/src/components/ui/MainCards";

function createSvgIcon(iconName: keyof typeof Svg, className: string) {
  return createElement(Svg[iconName], {
    tailWindClasses: className,
  } as Record<string, unknown>);
}

interface SummaryCardDefinition {
  key: string;
  label: string;
  icon: keyof typeof Svg;
  color: "slate" | "yellow" | "blue" | "green" | "orange";
  formatter?: (value: string | number) => string;
  deliveryStatusFilter?: DeliveryStatusFilter;
  navigateTo?: string;
  censorshipKey:
    | "vendas_resumo_status_prontas_para_enviar"
    | "vendas_resumo_status_pendentes"
    | "vendas_resumo_status_em_transito"
    | "vendas_resumo_status_concluidas"
    | "vendas_resumo_faturamento_bruto"
    | "vendas_resumo_faturamento_liquido"
    | "vendas_resumo_media_faturamento_diario";
}

const QUICK_STATUS_CARDS: SummaryCardDefinition[] = [
  {
    key: "prontas_para_enviar",
    label: "Prontas para enviar",
    icon: "in_box_stack",
    color: "yellow",
    deliveryStatusFilter: "ready_to_ship",
    censorshipKey: "vendas_resumo_status_prontas_para_enviar",
  },
  {
    key: "pendentes",
    label: "Pendentes",
    icon: "warning_circle",
    color: "orange",
    deliveryStatusFilter: "pending",
    censorshipKey: "vendas_resumo_status_pendentes",
  },
  {
    key: "em_transito",
    label: "Em trânsito",
    icon: "truck",
    color: "blue",
    deliveryStatusFilter: "shipped",
    censorshipKey: "vendas_resumo_status_em_transito",
  },
  {
    key: "concluidas",
    label: "Concluídas",
    icon: "check_circle",
    color: "green",
    deliveryStatusFilter: "delivered",
    censorshipKey: "vendas_resumo_status_concluidas",
  },
];

const REVENUE_CARDS: SummaryCardDefinition[] = [
  {
    key: "faturamento_bruto",
    label: "Faturamento Bruto",
    icon: "currency_dollar",
    color: "blue",
    formatter: formatCurrency,
    navigateTo: "/interno/financeiro/relatorio_vendas",
    censorshipKey: "vendas_resumo_faturamento_bruto",
  },
  {
    key: "faturamento_liquido",
    label: "Faturamento Líquido",
    icon: "currency_dollar",
    color: "green",
    formatter: formatCurrency,
    navigateTo: "/interno/financeiro/relatorio_vendas",
    censorshipKey: "vendas_resumo_faturamento_liquido",
  },
  {
    key: "media_faturamento_diario",
    label: "Média diária",
    icon: "graph",
    color: "slate",
    formatter: formatCurrency,
    navigateTo: "/interno/vendas",
    censorshipKey: "vendas_resumo_media_faturamento_diario",
  },
];

export default function VendasResumo() {
  const navigate = useNavigate();
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError,
  } = useOrdersMetrics(90);

  const ordersByStatus = useMemo(() => {
    if (!metricsData?.success || !metricsData.data) {
      return {
        prontas_para_enviar: 0,
        pendentes: 0,
        em_transito: 0,
        concluidas: 0,
      };
    }
    return {
      ...metricsData.data.orders_by_status,
      pendentes: (metricsData.data.orders_by_status as { pendentes?: number }).pendentes ?? 0,
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

  const handleStatusCardClick = useCallback(
    (deliveryStatusFilter: DeliveryStatusFilter) => {
      const params = new URLSearchParams({
        deliveryStatusFilter,
      });
      navigate(`/interno/vendas?${params.toString()}`);
    },
    [navigate]
  );

  const handleRevenueCardClick = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

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
      <MainCards className="space-y-6 md:space-y-4">
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
                  censorshipKey={card.censorshipKey}
                >
                  <StatCard
                    icon={createSvgIcon(card.icon, "h-5 w-5")}
                    title={card.label}
                    value={value}
                    variant="soft"
                    color={card.color}
                    censorshipKey={card.censorshipKey}
                    onClick={
                      card.deliveryStatusFilter
                        ? () => handleStatusCardClick(card.deliveryStatusFilter!)
                        : undefined
                    }
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
                  censorshipKey={card.censorshipKey}
                >
                  <StatCard
                    key={card.key}
                    icon={createSvgIcon(card.icon, "h-5 w-5")}
                    title={card.label}
                    censorshipKey={card.censorshipKey}
                    value={formattedValue}
                    variant="soft"
                    color={card.color}
                    onClick={
                      card.navigateTo
                        ? () => handleRevenueCardClick(card.navigateTo!)
                        : undefined
                    }
                  />
                </CensorshipWrapper>
              );
            })}
          </div>
        </div>
      </MainCards>
    </AsyncBoundary>
  );
}

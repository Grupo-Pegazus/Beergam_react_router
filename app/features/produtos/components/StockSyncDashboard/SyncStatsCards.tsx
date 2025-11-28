import { createElement } from "react";
import type { StockSyncDashboardResponse } from "../../typings";
import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";

interface SyncStatsCardsProps {
  syncStats: StockSyncDashboardResponse["sync_stats"];
}

export default function SyncStatsCards({ syncStats }: SyncStatsCardsProps) {
  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards = [
    {
      key: "total_products",
      label: "Total de Produtos",
      value: formatNumber(syncStats.total_products),
      icon: "box" as keyof typeof Svg,
      color: "slate" as const,
    },
    {
      key: "linked_products",
      label: "Produtos Vinculados",
      value: formatNumber(syncStats.linked_products),
      icon: "arrow_path" as keyof typeof Svg,
      color: "blue" as const,
    },
    {
      key: "sync_coverage",
      label: "Cobertura de Sincronização",
      value: formatPercentage(syncStats.sync_coverage),
      icon: "check_circle" as keyof typeof Svg,
      color: "emerald" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          icon={createElement(Svg[card.icon], {
            tailWindClasses: "h-5 w-5 text-beergam-blue-primary",
          })}
          title={card.label}
          value={card.value}
          variant="soft"
          color={card.color}
        />
      ))}
    </div>
  );
}


import { createElement } from "react";
import Svg from "~/src/assets/svgs/_index";
import StatCard from "~/src/components/ui/StatCard";
import type { StockDashboardResponse } from "../../typings";

interface StockSummaryCardsProps {
  summary: StockDashboardResponse["stock_summary"];
}

export default function StockSummaryCards({ summary }: StockSummaryCardsProps) {
  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const cards = [
    {
      key: "stock_ok",
      label: "Estoque OK",
      value: formatNumber(summary.stock_ok),
      icon: "check_circle" as keyof typeof Svg,
      color: "emerald" as const,
    },
    {
      key: "stock_low",
      label: "Estoque Baixo",
      value: formatNumber(summary.stock_low),
      icon: "warning_circle" as keyof typeof Svg,
      color: "amber" as const,
    },
    {
      key: "stock_zero",
      label: "Estoque Zerado",
      value: formatNumber(summary.stock_zero),
      icon: "x_circle" as keyof typeof Svg,
      color: "rose" as const,
    },
    {
      key: "without_control",
      label: "Sem Controle",
      value: formatNumber(summary.without_control),
      icon: "information_circle" as keyof typeof Svg,
      color: "slate" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          icon={createElement(Svg[card.icon], {
            tailWindClasses: "h-5 w-5 text-beergam-white",
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

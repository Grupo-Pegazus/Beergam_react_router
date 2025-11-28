import { createElement } from "react";
import type { StockDashboardResponse } from "../../typings";
import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface StockMetricsCardsProps {
  metrics: StockDashboardResponse["metrics"];
}

export default function StockMetricsCards({ metrics }: StockMetricsCardsProps) {
  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const cards = [
    {
      key: "total_products",
      label: "Total de Produtos",
      value: formatNumber(metrics.total_products),
      icon: "box" as keyof typeof Svg,
      color: "slate" as const,
    },
    {
      key: "products_with_stock_control",
      label: "Com Controle de Estoque",
      value: formatNumber(metrics.products_with_stock_control),
      icon: "check_circle" as keyof typeof Svg,
      color: "emerald" as const,
    },
    {
      key: "total_stock_quantity",
      label: "Quantidade Total em Estoque",
      value: formatNumber(metrics.total_stock_quantity),
      icon: "in_box_stack" as keyof typeof Svg,
      color: "blue" as const,
    },
    {
      key: "total_stock_value",
      label: "Valor Total em Estoque",
      value: formatCurrency(metrics.total_stock_value.toString()),
      icon: "currency_dollar" as keyof typeof Svg,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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


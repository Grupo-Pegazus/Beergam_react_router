import { createElement } from "react";
import type { StockTrackingResponse } from "../../typings";
import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface StockSummaryProps {
  data: StockTrackingResponse;
}

export default function StockSummary({ data }: StockSummaryProps) {
  const { summary, average_cost } = data;

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const cards = [
    {
      key: "current_stock",
      label: "Estoque Atual",
      value: formatNumber(summary.current_stock),
      icon: "box" as keyof typeof Svg,
      color: "green" as const,
    },
    {
      key: "total_entries",
      label: "Total de Entradas",
      value: formatNumber(summary.total_entry_quantity),
      icon: "in_box_stack" as keyof typeof Svg,
      color: "emerald" as const,
    },
    {
      key: "total_exits",
      label: "Total de Saídas",
      value: formatNumber(summary.total_exit_quantity),
      icon: "dolly" as keyof typeof Svg,
      color: "rose" as const,
    },
    {
      key: "average_cost",
      label: "Custo Médio",
      value: formatCurrency(average_cost.stored || "0.00"),
      icon: "currency_dollar" as keyof typeof Svg,
      color: "blue" as const,
    },
    {
      key: "total_stock_value",
      label: "Valor Total em Estoque",
      value: formatCurrency(summary.total_stock_value.toString()),
      icon: "calculator" as keyof typeof Svg,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          icon={createElement(Svg[card.icon], {
            tailWindClasses: "h-4 w-4 sm:h-5 sm:w-5 text-beergam-blue-primary",
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


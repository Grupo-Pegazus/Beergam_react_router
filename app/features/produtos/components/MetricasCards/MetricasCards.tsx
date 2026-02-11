import { createElement } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { useProductsMetrics } from "../../hooks";
import MetricasCardsSkeleton from "./MetricasCardsSkeleton";

interface SummaryCardDefinition {
  key: keyof typeof defaultMetrics;
  label: string;
  icon: keyof typeof Svg;
  gradient: string;
  accent: string;
}

const defaultMetrics = {
  totalCadastrados: 0,
  totalAtivos: 0,
  estoqueBaixo: 0,
};

const SUMMARY_CARDS: SummaryCardDefinition[] = [
  {
    key: "totalCadastrados",
    label: "Produtos cadastrados",
    icon: "bag",
    gradient: "from-blue-100 via-indigo-50 to-white",
    accent: "text-indigo-600",
  },
  {
    key: "totalAtivos",
    label: "Produtos ativos",
    icon: "check_circle",
    gradient: "from-green-100 via-emerald-50 to-white",
    accent: "text-emerald-600",
  },
  {
    key: "estoqueBaixo",
    label: "Estoque baixo",
    icon: "low_stock",
    gradient: "from-rose-100 via-rose-50 to-white",
    accent: "text-rose-600",
  },
];

export default function MetricasCards() {
  const { data, isLoading, error } = useProductsMetrics();

  const metrics =
    data?.success && data.data
      ? {
          totalCadastrados: data.data.total_cadastrados,
          totalAtivos: data.data.total_ativos,
          estoqueBaixo: data.data.estoque_baixo,
        }
      : defaultMetrics;

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={MetricasCardsSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar as métricas dos produtos.
        </div>
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SUMMARY_CARDS.map((card) => (
          <StatCard
            key={card.key}
            icon={createElement(Svg[card.icon], {
              tailWindClasses: "h-5 w-5 ",
            })}
            title={card.label}
            value={metrics[card.key]}
            variant="soft"
            className={[
              "relative overflow-hidden",
              "before:absolute before:inset-0 before:bg-linear-to-br",
              `before:${card.gradient}`,
              "before:opacity-80 before:-z-10",
            ].join(" ")}
          />
        ))}
      </div>
    </AsyncBoundary>
  );
}

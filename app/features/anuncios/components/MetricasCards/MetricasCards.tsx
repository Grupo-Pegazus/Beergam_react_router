import { createElement } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import { useAdsMetrics } from "../../hooks";
import MetricasCardsSkeleton from "./MetricasCardsSkeleton";

interface SummaryCardDefinition {
  key: keyof typeof defaultMetrics;
  label: string;
  icon: keyof typeof Svg;
  gradient: string;
  accent: string;
}

const defaultMetrics = {
  totalCategorias: 0,
  totalAnuncios: 0,
  anunciosEstoqueBaixo: 0,
  anunciosAMelhorar: 0,
};

interface SummaryCardDefinitionWithCensorship extends SummaryCardDefinition {
  censorshipKey: string;
}

const SUMMARY_CARDS: SummaryCardDefinitionWithCensorship[] = [
  {
    key: "totalCategorias",
    censorshipKey: "resumo_anuncios_categorias",
    label: "Categorias",
    icon: "list",
    gradient: "from-sky-100 via-sky-50 to-white",
    accent: "text-sky-600",
  },
  {
    key: "totalAnuncios",
    censorshipKey: "resumo_anuncios_total_anuncios",
    label: "Total de anúncios",
    icon: "bag",
    gradient: "from-blue-100 via-indigo-50 to-white",
    accent: "text-indigo-600",
  },
  {
    key: "anunciosEstoqueBaixo",
    censorshipKey: "resumo_anuncios_estoque_baixo",
    label: "Estoque baixo",
    icon: "low_stock",
    gradient: "from-rose-100 via-rose-50 to-white",
    accent: "text-rose-600",
  },
  {
    key: "anunciosAMelhorar",
    censorshipKey: "resumo_anuncios_a_melhorar",
    label: "A melhorar",
    icon: "warning_circle",
    gradient: "from-emerald-100 via-emerald-50 to-white",
    accent: "text-emerald-600",
  },
];

export default function MetricasCards() {
  const { data, isLoading, error } = useAdsMetrics();

  const metrics =
    data?.success && data.data
      ? {
          totalCategorias: data.data.total_categorias,
          totalAnuncios: data.data.total_anuncios,
          anunciosEstoqueBaixo: data.data.anuncios_estoque_baixo,
          anunciosAMelhorar: data.data.anuncios_a_melhorar,
        }
      : defaultMetrics;

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={MetricasCardsSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar as métricas dos anúncios.
        </div>
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <CensorshipWrapper key={card.key} censorshipKey={card.censorshipKey}>
            <StatCard
              icon={createElement(Svg[card.icon], {
                tailWindClasses: "h-5 w-5",
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
              censorshipKey={card.censorshipKey}
            ></StatCard>
          </CensorshipWrapper>
        ))}
      </div>
    </AsyncBoundary>
  );
}

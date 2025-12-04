import type { StockSyncDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";

interface RecommendationsListProps {
  recommendations: StockSyncDashboardResponse["recommendations"];
}

export default function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <Svg.information_circle tailWindClasses="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm text-slate-500">
          Nenhuma recomendação disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <MainCards className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Recomendações
      </h3>
      <ul className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="flex items-start gap-3">
            <Svg.information_circle
              tailWindClasses="h-5 w-5 text-blue-500 shrink-0 mt-0.5"
            />
            <p className="text-sm text-slate-700 flex-1">{recommendation}</p>
          </li>
        ))}
      </ul>
    </MainCards>
  );
}


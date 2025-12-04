import { Link } from "react-router";
import { Chip } from "@mui/material";
import type { StockSyncDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";

interface RecentActivitiesListProps {
  activities: StockSyncDashboardResponse["recent_activities"];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function RecentActivitiesList({
  activities,
}: RecentActivitiesListProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <Svg.information_circle tailWindClasses="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm text-slate-500">
          Nenhuma atividade recente encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => {
        const isSuccess = activity.success;
        const statusColor = isSuccess
          ? { bg: "#d1fae5", color: "#065f46" }
          : { bg: "#fee2e2", color: "#991b1b" };

        return (
          <MainCards key={index} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Chip
                    label={activity.sync_status}
                    size="small"
                    sx={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                      fontWeight: 600,
                      height: 22,
                    }}
                  />
                  <Chip
                    label={activity.sync_type}
                    size="small"
                    sx={{
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      fontWeight: 500,
                      height: 22,
                    }}
                  />
                  {activity.sync_duration_ms !== null && (
                    <span className="text-xs text-slate-500">
                      {formatDuration(activity.sync_duration_ms)}
                    </span>
                  )}
                </div>
                {activity.product_id && (
                  <p className="text-xs text-slate-500 mb-1">
                    Produto ID: {activity.product_id}
                  </p>
                )}
                {activity.error_message && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2 mt-2">
                    <p className="text-xs text-red-700">{activity.error_message}</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {formatDate(activity.created_at)}
                </p>
              </div>
              {activity.product_id && (
                <Link
                  to={`/interno/produtos/estoque/${activity.product_id}`}
                  className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Svg.chevron tailWindClasses="h-5 w-5 rotate-270" />
                </Link>
              )}
            </div>
          </MainCards>
        );
      })}
    </div>
  );
}


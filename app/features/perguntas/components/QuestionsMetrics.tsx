import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "~/src/components/ui/StatCard";
import Grid from "~/src/components/ui/Grid";
import Svg from "~/src/assets/svgs/_index";
import type { QuestionsInsights } from "../typings";

interface QuestionsMetricsProps {
  insights?: QuestionsInsights;
  loading?: boolean;
}

function formatMinutes(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value < 60) return `${value.toFixed(0)} min`;
  const hours = value / 60;
  return `${hours.toFixed(1)} h`;
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(1)}%`;
}

export function QuestionsMetrics({ insights, loading }: QuestionsMetricsProps) {
  const chartData = (insights?.daily_trend ?? []).map((point) => ({
    date: point.date.slice(5),
    total: point.total,
    answered: point.answered,
  }));

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <Grid cols={{ base: 1, md: 2, lg: 4 }}>
        <StatCard
          icon={<Svg.clock tailWindClasses="w-5 h-5 text-amber-600" />}
          title="Tempo médio de resposta"
          value={formatMinutes(insights?.avg_response_minutes)}
          loading={loading}
          color="amber"
        />
        <StatCard
          icon={<Svg.check tailWindClasses="w-5 h-5 text-emerald-600" />}
          title="% dentro de 1h"
          value={formatPercent(insights?.sla_within_1h_percent)}
          loading={loading}
          color="emerald"
        />
        <StatCard
          icon={<Svg.chat tailWindClasses="w-5 h-5 text-blue-600" />}
          title="Pendentes"
          value={insights?.pending ?? "—"}
          loading={loading}
          color="blue"
        />
        <StatCard
          icon={<Svg.graph tailWindClasses="w-5 h-5 text-purple-600" />}
          title="Total no período"
          value={insights?.total ?? "—"}
          loading={loading}
          color="purple"
        >
        </StatCard>
      </Grid>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              fill="#dbeafe"
              name="Total"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="answered"
              stroke="#10b981"
              fill="#d1fae5"
              name="Respondidas"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


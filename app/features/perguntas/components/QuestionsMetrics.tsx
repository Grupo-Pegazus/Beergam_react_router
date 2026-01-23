import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Svg from "~/src/assets/svgs/_index";
import Grid from "~/src/components/ui/Grid";
import StatCard from "~/src/components/ui/StatCard";
import {
  CensorshipWrapper,
  ImageCensored,
} from "~/src/components/utils/Censorship";
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
    <div className="bg-beergam-mui-paper border border-black/10 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <Grid cols={{ base: 1, md: 2, lg: 4 }}>
        <CensorshipWrapper censorshipKey="perguntas_sla_tempo_medio">
          <StatCard
            icon={<Svg.clock tailWindClasses="w-5 h-5" />}
            title="Tempo médio de resposta"
            value={formatMinutes(insights?.avg_response_minutes)}
            loading={loading}
            variant="soft"
            censorshipKey="perguntas_sla_tempo_medio"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="perguntas_sla_dentro_de_1h">
          <StatCard
            icon={<Svg.check tailWindClasses="w-5 h-5" />}
            title="% dentro de 1h"
            value={formatPercent(insights?.sla_within_1h_percent)}
            loading={loading}
            variant="soft"
            censorshipKey="perguntas_sla_dentro_de_1h"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="perguntas_sla_pendentes">
          <StatCard
            icon={<Svg.chat tailWindClasses="w-5 h-5" />}
            title="Pendentes"
            value={insights?.pending ?? "—"}
            loading={loading}
            variant="soft"
            censorshipKey="perguntas_sla_pendentes"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="perguntas_sla_total_periodo">
          <StatCard
            icon={<Svg.graph tailWindClasses="w-5 h-5" />}
            title="Total no período"
            value={insights?.total ?? "—"}
            loading={loading}
            variant="soft"
            censorshipKey="perguntas_sla_total_periodo"
          ></StatCard>
        </CensorshipWrapper>
      </Grid>

      <div className="h-64 w-ful">
        <ImageCensored className="w-full h-full" censorshipKey="perguntas_sla">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
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
        </ImageCensored>
      </div>
    </div>
  );
}

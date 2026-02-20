import { createElement } from "react";
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
import StatCard from "~/src/components/ui/StatCard";
import {
  CensorshipWrapper,
  ImageCensored,
} from "~/src/components/utils/Censorship";
import type { ClaimsInsights } from "../typings";
import MainCards from "~/src/components/ui/MainCards";
import Grid from "~/src/components/ui/Grid";

interface ClaimsMetricsProps {
  insights?: ClaimsInsights;
  loading?: boolean;
}

function formatDays(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value < 1) {
    const hours = value * 24;
    return hours < 1 ? `${(hours * 60).toFixed(0)} min` : `${hours.toFixed(1)} h`;
  }
  return `${value.toFixed(1)} dias`;
}

export function ClaimsMetrics({ insights, loading }: ClaimsMetricsProps) {
  const chartData = (insights?.daily_trend ?? []).map((point) => ({
    date: point.date.slice(5),
    total: point.total,
    opened: point.opened,
    closed: point.closed,
  }));

  return (
    <MainCards className="flex flex-col gap-4">
      <Grid cols={{ base: 1, sm: 2 }} gap={4}>
        <CensorshipWrapper censorshipKey="reclamacoes_tempo_medio_resolucao">
          <StatCard
            icon={createElement(Svg.clock, { tailWindClasses: "w-5 h-5" })}
            title="Tempo médio de resolução"
            value={formatDays(insights?.avg_resolution_days)}
            loading={loading}
            variant="soft"
            censorshipKey="reclamacoes_tempo_medio_resolucao"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="reclamacoes_abertas">
          <StatCard
            icon={createElement(Svg.alert, { tailWindClasses: "w-5 h-5" })}
            title="Abertas"
            value={insights?.opened ?? "—"}
            loading={loading}
            variant="soft"
            censorshipKey="reclamacoes_abertas"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="reclamacoes_fechadas">
          <StatCard
            icon={createElement(Svg.check_circle, { tailWindClasses: "w-5 h-5" })}
            title="Fechadas"
            value={insights?.closed ?? "—"}
            loading={loading}
            variant="soft"
            censorshipKey="reclamacoes_fechadas"
          />
        </CensorshipWrapper>
        <CensorshipWrapper censorshipKey="reclamacoes_total_periodo">
          <StatCard
            icon={createElement(Svg.graph, { tailWindClasses: "w-5 h-5" })}
            title="Total no período"
            value={insights?.total ?? "—"}
            loading={loading}
            variant="soft"
            censorshipKey="reclamacoes_total_periodo"
          />
        </CensorshipWrapper>
      </Grid>
      <div className="h-64 md:h-80 w-full">
        <ImageCensored className="w-full h-full" censorshipKey="reclamacoes_tendencia">
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
                  backgroundColor: "var(--color-beergam-section-background)",
                  border: "1px solid var(--color-beergam-section-border)",
                  borderRadius: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#4679f3"
                fill="#edf2fe"
                name="Total"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="opened"
                stroke="#ff8a00"
                fill="#fff3e6"
                name="Abertas"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="closed"
                stroke="#87de72"
                fill="#d1fae5"
                name="Fechadas"
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ImageCensored>
      </div>
    </MainCards>
  );
}

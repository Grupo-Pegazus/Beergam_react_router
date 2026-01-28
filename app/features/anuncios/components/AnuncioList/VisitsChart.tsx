import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";
import { VisitSchema } from "../../typings";

type Visit = z.infer<typeof VisitSchema>;

interface VisitsChartProps {
  visits: Visit[];
}

export default function VisitsChart({ visits }: VisitsChartProps) {
  const chartData = useMemo(() => {
    if (!visits || visits.length === 0) return [];

    // Ordenar por data e formatar para o gráfico
    return visits
      .sort(
        (a, b) =>
          new Date(a.date_visit).getTime() - new Date(b.date_visit).getTime()
      )
      .map((visit) => {
        const date = new Date(visit.date_visit);
        const month = date.toLocaleDateString("pt-BR", { month: "short" });
        return {
          month,
          visitas: visit.visits,
        };
      });
  }, [visits]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-beergam-typography-secondary!">
        Sem dados de visitas
      </div>
    );
  }

  return (
    <div className="h-24 w-full min-w-0" style={{ minHeight: 96 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-beergam-typography-secondary)"
          />
          <XAxis
            dataKey="month"
            stroke="var(--color-beergam-typography-secondary)"
            fontSize={10}
            tick={{ fill: "var(--color-beergam-typography-secondary)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="var(--color-beergam-typography-secondary)"
            fontSize={10}
            tick={{ fill: "var(--color-beergam-typography-secondary)" }}
            width={30}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-beergam-section-background)",
              border: "1px solid transparent",
              borderRadius: "6px",
              padding: "6px",
              fontSize: "11px",
            }}
            labelStyle={{
              color: "var(--color-beergam-typography-tertiary)",
              fontWeight: "bold",
              fontSize: "10px",
            }}
            cursor={{
              stroke: "var(--color-beergam-typography-tertiary)",
              strokeWidth: 1,
            }}
          />
          <Line
            type="monotone"
            dataKey="visitas"
            stroke="var(--color-beergam-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-beergam-primary)", r: 2 }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

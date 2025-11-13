import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { VisitSchema } from "../../typings";
import { z } from "zod";

type Visit = z.infer<typeof VisitSchema>;

interface VisitsChartProps {
  visits: Visit[];
}

export default function VisitsChart({ visits }: VisitsChartProps) {
  const chartData = useMemo(() => {
    if (!visits || visits.length === 0) return [];

    // Ordenar por data e formatar para o gráfico
    return visits
      .sort((a, b) => new Date(a.date_visit).getTime() - new Date(b.date_visit).getTime())
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
      <div className="flex items-center justify-center h-24 text-xs text-slate-400">
        Sem dados de visitas
      </div>
    );
  }

  return (
    <div className="h-24 w-full">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={10}
            tick={{ fill: "#64748b" }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tick={{ fill: "#64748b" }}
            width={30}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "6px",
              fontSize: "11px",
            }}
            labelStyle={{
              color: "#0f172a",
              fontWeight: "bold",
              fontSize: "10px",
            }}
            cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="visitas"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 2 }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


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
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { z } from "zod";
import { VisitSchema } from "../../../typings";

type Visit = z.infer<typeof VisitSchema>;

interface VisitsChartProps {
  visits: Visit[] | undefined;
}

export default function VisitsChart({ visits }: VisitsChartProps) {
  const chartData = useMemo(() => {
    if (!visits || visits.length === 0) return [];

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

  if (!visits || visits.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Evolução de Visitas
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Últimos 5 meses
        </Typography>
      </Box>
      <Box sx={{ height: 250, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: "#64748b" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: "#64748b" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "#0f172a",
                fontWeight: "bold",
                fontSize: "11px",
              }}
              cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="visitas"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}


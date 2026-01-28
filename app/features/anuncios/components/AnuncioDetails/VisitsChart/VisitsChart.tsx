import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
import { VisitSchema } from "../../../typings";

type Visit = z.infer<typeof VisitSchema>;

interface VisitsChartProps {
  visits: Visit[] | undefined;
}

export default function VisitsChart({ visits }: VisitsChartProps) {
  const chartData = useMemo(() => {
    if (!visits || visits.length === 0) return [];

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
        <div className="flex items-center justify-between">
          <Typography
            className="text-beergam-typography-primary!"
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Evolução de Visitas
          </Typography>
          <Typography
            variant="caption"
            className="text-beergam-typography-secondary!"
            sx={{ fontSize: "0.65rem" }}
          >
            Últimos 5 meses
          </Typography>
        </div>
      </Box>
      <Box sx={{ height: 250, width: "100%", minWidth: 0, minHeight: 1 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-beergam-typography-secondary)"
            />
            <XAxis
              dataKey="month"
              stroke="var(--color-beergam-typography-secondary)"
              fontSize={12}
              tick={{ fill: "var(--color-beergam-typography-secondary)" }}
            />
            <YAxis
              stroke="var(--color-beergam-typography-secondary)"
              fontSize={12}
              tick={{ fill: "var(--color-beergam-typography-secondary)" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-beergam-section-background)",
                border: "1px solid var(--color-beergam-typography-secondary)",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "var(--color-beergam-typography-tertiary)",
                fontWeight: "bold",
                fontSize: "11px",
              }}
              cursor={{
                stroke: "var(--color-beergam-primary)",
                strokeWidth: 1,
              }}
            />
            <Line
              type="monotone"
              dataKey="visitas"
              stroke="var(--color-beergam-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-beergam-primary)", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

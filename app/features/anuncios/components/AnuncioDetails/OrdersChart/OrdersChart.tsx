import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import dayjs, { type Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FilterDatePicker } from "~/src/components/filters";
import { useAdOrdersChart } from "../../../hooks";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format("DD/MM");
};

interface OrdersChartProps {
  anuncioId: string;
  days?: number;
}

export default function OrdersChart({
  anuncioId,
  days = 30,
}: OrdersChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());

  const { data, isLoading, error } = useAdOrdersChart(anuncioId, {
    days,
    date_from: selectedMonth
      ? selectedMonth.startOf("month").toISOString()
      : undefined,
    date_to: selectedMonth
      ? selectedMonth.endOf("month").toISOString()
      : undefined,
  });

  const chartData = useMemo(() => {
    if (!data?.success || !data.data?.daily_revenue) return [];

    return data.data.daily_revenue.map((item) => ({
      date: formatDate(item.date),
      "Faturamento Bruto": parseFloat(item.faturamento_bruto),
      "Faturamento Líquido": parseFloat(item.faturamento_liquido),
      "Total de Pedidos": item.total_pedidos,
    }));
  }, [data]);

  const handleMonthChange = useCallback((newValue: Dayjs | null) => {
    setSelectedMonth(newValue);
  }, []);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(239, 68, 68, 0.3)",
          bgcolor: "rgba(239, 68, 68, 0.05)",
        }}
      >
        <Typography className="text-beergam-red!" variant="body2">
          Não foi possível carregar o gráfico de vendas.
        </Typography>
      </Paper>
    );
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
      <Box sx={{ mb: 3 }}>
        <Typography
          className="text-beergam-typography-primary!"
          variant="h6"
          sx={{ fontWeight: 700, mb: 0.5 }}
        >
          Faturamento Diário
        </Typography>
        <Typography
          className="text-beergam-typography-secondary!"
          variant="caption"
        >
          Evolução de vendas do anúncio
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <FilterDatePicker
          label="Período"
          value={selectedMonth?.toISOString() ?? ""}
          onChange={(value) => handleMonthChange(value ? dayjs(value) : null)}
          dateType="month"
          widthType="full"
        />
      </Box>

      {isLoading ? (
        <Box sx={{ height: 320 }}>
          <Skeleton
            variant="rectangular"
            height="100%"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 320,
            borderRadius: 2,
            border: "1px dashed rgba(0, 0, 0, 0.12)",
            bgcolor: "rgba(0, 0, 0, 0.02)",
            p: 4,
          }}
        >
          <Typography
            className="text-beergam-typography-secondary!"
            variant="body2"
            align="center"
          >
            Nenhum dado disponível para o período selecionado.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 320, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-beergam-typography-secondary)"
              />
              <XAxis
                dataKey="date"
                stroke="var(--color-beergam-typography-secondary)"
                fontSize={10}
                tick={{ fill: "var(--color-beergam-typography-secondary)" }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--color-beergam-typography-secondary)"
                fontSize={10}
                tick={{ fill: "var(--color-beergam-typography-secondary)" }}
                tickFormatter={formatCurrency}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-beergam-section-background)",
                  border: "1px solid var(--color-beergam-typography-secondary)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "var(--color-beergam-typography-tertiary)",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Total de Pedidos") {
                    return [`${value} pedidos`, name];
                  }
                  return [formatCurrency(value), name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
              <Bar
                dataKey="Faturamento Bruto"
                fill="var(--color-beergam-orange)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Faturamento Líquido"
                fill="var(--color-beergam-blue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}

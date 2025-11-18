import { useMemo, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDailyRevenue } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { Skeleton, Typography, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { type Dayjs } from "dayjs";

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

interface DailyRevenueChartProps {
  days: number;
}

export default function DailyRevenueChart({ days = 30 }: DailyRevenueChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());

  const { data, isLoading, error } = useDailyRevenue({
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
    }));
  }, [data]);

  const handleMonthChange = useCallback((newValue: Dayjs | null) => {
    setSelectedMonth(newValue);
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={() => (
        <div className="h-80 w-full">
          <Skeleton variant="rectangular" height="100%" className="rounded-lg" />
        </div>
      )}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar o gráfico de faturamento diário.
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
          <Stack direction="row" spacing={2} alignItems="center">
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={
                ptBR.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                label="Período de Provisão"
                value={selectedMonth}
                onChange={handleMonthChange}
                views={["year", "month"]}
                format="MMMM YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 rounded-lg border border-dashed border-slate-300 bg-slate-50">
            <Typography variant="body2" color="text.secondary">
              Nenhum dado disponível para o período selecionado.
            </Typography>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tick={{ fill: "#64748b" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={formatCurrency}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: "bold",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="Faturamento Bruto"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Faturamento Líquido"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AsyncBoundary>
  );
}


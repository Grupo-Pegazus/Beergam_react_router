import { Skeleton, Typography } from "@mui/material";
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
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { useDailyRevenue } from "../../hooks";

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

export default function DailyRevenueChart({
  days = 30,
}: DailyRevenueChartProps) {
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
          <Skeleton
            variant="rectangular"
            height="100%"
            className="rounded-lg"
          />
        </div>
      )}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar o gráfico de faturamento diário.
        </div>
      )}
    >
      <div className="space-y-3 md:space-y-4 bg-beergam-mui-paper p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 md:gap-4">
          <FilterDatePicker
            label="Período de Provisão"
            value={selectedMonth?.toISOString() ?? ""}
            onChange={(value) => handleMonthChange(value ? dayjs(value) : null)}
            dateType="month"
          />
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-80 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center text-sm md:text-base"
            >
              Nenhum dado disponível para o período selecionado.
            </Typography>
          </div>
        ) : (
          <div className="h-64 md:h-80 w-full overflow-x-auto min-w-0" style={{ minHeight: 256, overflow: "hidden" }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={10}
                  tick={{ fill: "#64748b" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={formatCurrency}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div
                        style={{
                          backgroundColor:
                            "var(--color-beergam-section-background)",
                          border: "1px solid var(--color-beergam-border)",
                          borderRadius: "8px",
                          padding: "8px",
                          fontSize: "12px",
                        }}
                      >
                        <p
                          style={{
                            color: "var(--color-beergam-typography-primary)",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          {label}
                        </p>
                        {payload.map((entry) => (
                          <p
                            key={entry.name}
                            style={{
                              color: entry.color,
                              margin: "2px 0",
                            }}
                          >
                            {entry.name}: {formatCurrency(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
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

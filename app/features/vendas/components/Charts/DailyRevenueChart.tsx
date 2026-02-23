import { Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { FilterDateRangePicker } from "~/src/components/filters";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { Fields } from "~/src/components/utils/_fields";
import { dateStringToDayjs } from "~/src/utils/date";
import MainCards from "~/src/components/ui/MainCards";
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

type FixedPeriod = 30 | 60 | 90;
type PeriodMode = FixedPeriod | "custom";

const PERIOD_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: "30", label: "30 dias" },
  { value: "60", label: "60 dias" },
  { value: "90", label: "90 dias" },
  { value: "custom", label: "Período personalizado" },
];

interface DailyRevenueChartProps {
  defaultDays?: FixedPeriod;
}

export default function DailyRevenueChart({
  defaultDays = 30,
}: DailyRevenueChartProps) {
  const [periodMode, setPeriodMode] = useState<PeriodMode>(defaultDays);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const isCustom = periodMode === "custom";
  const queryEnabled = !isCustom || (!!dateRange?.start && !!dateRange?.end);

  const queryParams = useMemo(() => {
    if (isCustom && dateRange?.start && dateRange?.end) {
      return {
        date_from: dateStringToDayjs(dateRange.start).toISOString(),
        date_to: dateStringToDayjs(dateRange.end).toISOString(),
      };
    }
    if (!isCustom) {
      return { days: periodMode as FixedPeriod };
    }
    return {};
  }, [isCustom, periodMode, dateRange]);

  const { data, isLoading, error } = useDailyRevenue({
    ...queryParams,
    enabled: queryEnabled,
  });

  const chartData = useMemo(() => {
    if (!data?.success || !data.data?.daily_revenue) return [];

    return data.data.daily_revenue.map((item) => ({
      date: formatDate(item.date),
      "Faturamento Bruto": parseFloat(item.faturamento_bruto),
      "Faturamento Líquido": parseFloat(item.faturamento_liquido),
    }));
  }, [data]);

  const pieData = useMemo(() => {
    if (!data?.success || !data.data?.daily_revenue_by_shipment_type) return [];

    return Object.entries(data.data.daily_revenue_by_shipment_type)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .filter((item) => item.value > 0);
  }, [data]);

  const pieColors = useMemo(
    () => [
      "#0ea5e9",
      "#22c55e",
      "#f97316",
      "#a855f7",
      "#e11d48",
      "#14b8a6",
      "#facc15",
    ],
    [],
  );

  const handlePeriodChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "custom") {
      setPeriodMode("custom");
      return;
    }
    setPeriodMode(Number(value) as FixedPeriod);
    setDateRange(null);
  }, []);

  const handleDateRangeChange = useCallback((range: { start: string; end: string }) => {
    setDateRange(range);
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
      <MainCards>
        <div className="space-y-3 md:space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-4">
            <Fields.wrapper className="w-full sm:w-auto min-w-[200px]">
              <Fields.label text="Período" />
              <Fields.select
                value={String(periodMode)}
                onChange={handlePeriodChange}
                widthType="full"
                options={PERIOD_SELECT_OPTIONS}
              />
            </Fields.wrapper>
          {isCustom && (
            <div className="w-full sm:w-auto min-w-[200px]">
              <FilterDateRangePicker
                label="Intervalo de datas"
                value={dateRange}
                onChange={handleDateRangeChange}
                widthType="full"
                defaultOpen
              />
            </div>
          )}
          </div>
        </div>

        {isCustom && (!dateRange?.start || !dateRange?.end) ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-80 rounded-lg border border-dashed border-beergam-typography-secondary! bg-beergam-section-background! p-4">
            <Typography
              variant="body2"
              className="text-center text-sm md:text-base text-beergam-typography-secondary!"
            >
              Selecione as datas de início e fim para visualizar o faturamento diário.
            </Typography>
          </div>
        ) : chartData.length === 0 && pieData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-80 rounded-lg border border-dashed border-beergam-typography-secondary! bg-beergam-section-background! p-4">
            <Typography
              variant="body2"
              className="text-center text-sm md:text-base text-beergam-typography-secondary!"
            >
              Nenhum dado disponível para o período selecionado.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div
              className="h-64 md:h-80 w-full md:w-2/3 overflow-x-auto min-w-0"
              style={{ minHeight: 256, overflow: "hidden" }}
            >
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
                          color: "var(--color-beergam-typography-primary)",
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
                            {entry.name}:{" "}
                            {formatCurrency(entry.value as number)}
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

            <div className="h-64 md:h-80 w-full md:w-1/3 flex items-stretch">
              {pieData.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-beergam-typography-secondary! bg-beergam-section-background! p-4">
                  <Typography
                    variant="body2"
                    className="text-center text-sm md:text-base text-beergam-typography-secondary!"
                  >
                    Nenhum dado de logística disponível para o período
                    selecionado.
                  </Typography>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col justify-between">
                  <div className="flex-1">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      minHeight={256}
                    >
                      <PieChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;

                            const entry = payload[0];
                            const value = entry.value as number;
                            const total = pieData.reduce(
                              (acc, item) => acc + item.value,
                              0,
                            );
                            const percent = total
                              ? ((value / total) * 100).toFixed(1)
                              : "0.0";

                            return (
                              <div
                                style={{
                                  backgroundColor:
                                    "var(--color-beergam-section-background)",
                                  border:
                                    "1px solid var(--color-beergam-border)",
                                  borderRadius: "8px",
                                  padding: "8px",
                                  fontSize: "12px",
                                  color:
                                    "var(--color-beergam-typography-primary)",
                                }}
                              >
                                <p
                                  style={{
                                    color:
                                      "var(--color-beergam-typography-primary)",
                                    fontWeight: "bold",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {entry.name}
                                </p>
                                <p style={{ margin: "2px 0" }}>
                                  {value} pedidos ({percent}%)
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent ?? 0 * 100).toFixed(1)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={pieColors[index % pieColors.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </MainCards>
    </AsyncBoundary>
  );
}

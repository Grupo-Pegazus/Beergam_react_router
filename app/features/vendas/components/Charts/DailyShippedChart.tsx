import { Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
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
import { FilterDateRangePicker } from "~/src/components/filters";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { Fields } from "~/src/components/utils/_fields";
import { dateStringToDayjs } from "~/src/utils/date";
import MainCards from "~/src/components/ui/MainCards";
import { useDailyShipped } from "../../hooks";

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

interface DailyShippedChartProps {
  defaultDays?: FixedPeriod;
}

export default function DailyShippedChart({
  defaultDays = 30,
}: DailyShippedChartProps) {
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

  const { data, isLoading, error } = useDailyShipped({
    ...queryParams,
    enabled: queryEnabled,
  });

  const chartData = useMemo(() => {
    if (!data?.success || !data.data?.daily_shipped) return [];

    return data.data.daily_shipped.map((item) => ({
      date: formatDate(item.date),
      Enviados: item.shipped,
      Cancelados: item.cancelled,
    }));
  }, [data]);

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
          Não foi possível carregar o gráfico de vendas diárias.
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
              Selecione as datas de início e fim para visualizar as vendas diárias.
            </Typography>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-80 rounded-lg border border-dashed border-beergam-typography-secondary! bg-beergam-section-background! p-4">
            <Typography
              variant="body2"
              className="text-center text-sm md:text-base text-beergam-typography-secondary!"
            >
              Nenhuma venda no período selecionado.
            </Typography>
          </div>
        ) : (
          <div
            className="h-64 md:h-80 w-full overflow-x-auto min-w-0"
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
                            {entry.name}: {entry.value} pedido(s)
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={12} />
                <Bar
                  dataKey="Enviados"
                  fill="var(--color-beergam-blue-primary)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Cancelados"
                  fill="var(--color-beergam-red-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </MainCards>
    </AsyncBoundary>
  );
}

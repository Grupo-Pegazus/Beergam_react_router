import { useMemo, useState, useCallback, memo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { metricsAccountService } from "../../service";
import VisitasSkeleton from "./Skeleton";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import type { RootState } from "~/store";
import { MarketplaceType } from "~/features/marketplace/typings";
import type { MarketplaceVisitsData } from "../../typings";
import type { ApiResponse } from "~/features/apiClient/typings";

type VisitsResponse = ApiResponse<MarketplaceVisitsData<MarketplaceType>>;

function isMeliVisits(
  payload: MarketplaceVisitsData<MarketplaceType> | null,
): payload is MarketplaceVisitsData<MarketplaceType.MELI> {
  return payload?.marketplace_type === MarketplaceType.MELI;
}

const formatDateForChart = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

type PeriodFilter = 7 | 30 | 90 | 150;

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 150, label: "150 dias" },
];

// Configurações de estilo do gráfico (extraídas para evitar recriação)
const CHART_STYLES = {
  desktop: {
    grid: {
      strokeDasharray: "3 3" as const,
      stroke: "#e2e8f0",
    },
    axis: {
      stroke: "#64748b",
      fontSize: 12,
      tick: {
        fill: "#64748b",
      },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
      },
      labelStyle: {
        color: "#0f172a",
        fontWeight: "bold" as const,
      },
    },
    line: {
      stroke: "#3b82f6",
      strokeWidth: 2,
      dot: {
        fill: "#3b82f6",
        r: 3,
      },
      activeDot: {
        r: 5,
      },
    },
    margin: {
      top: 5,
      right: 10,
      left: 0,
      bottom: 5,
    },
  },
  mobile: {
    grid: {
      strokeDasharray: "2 2" as const,
      stroke: "#e2e8f0",
    },
    axis: {
      stroke: "#64748b",
      fontSize: 10,
      tick: {
        fill: "#64748b",
      },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "6px",
        fontSize: "12px",
      },
      labelStyle: {
        color: "#0f172a",
        fontWeight: "bold" as const,
        fontSize: "11px",
      },
    },
    line: {
      stroke: "#3b82f6",
      strokeWidth: 2.5,
      dot: {
        fill: "#3b82f6",
        r: 2.5,
      },
      activeDot: {
        r: 6,
      },
    },
    margin: {
      top: 5,
      right: 5,
      left: -10,
      bottom: 0,
    },
  },
} as const;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };


    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return isMobile;
}

type ChartDataPoint = {
  date: string;
  visitas: number;
};

interface VisitsChartProps {
  data: ChartDataPoint[];
  isMobile: boolean;
}

const VisitsChart = memo(({ data, isMobile }: VisitsChartProps) => {
  const styles = isMobile ? CHART_STYLES.mobile : CHART_STYLES.desktop;

  const calculateInterval = useMemo(() => {
    if (data.length <= 7) return 0;
    if (isMobile) {
      return Math.ceil(data.length / 5);
    }
    return Math.ceil(data.length / 8);
  }, [data.length, isMobile]);

  const margin = useMemo(() => styles.margin, [styles.margin]);

  const cursorStyle = useMemo(
    () => ({ stroke: styles.line.stroke, strokeWidth: 1 }),
    [styles.line.stroke],
  );

  if (data.length === 0) {
    return (
      <p className="text-xs sm:text-sm text-[#475569] text-center py-6 sm:py-8">
        Sem dados de visitas para o período selecionado.
      </p>
    );
  }

  return (
    <div className="h-56 sm:h-48 md:h-56 -mx-2 sm:mx-0 px-2 sm:px-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          <CartesianGrid
            strokeDasharray={styles.grid.strokeDasharray}
            stroke={styles.grid.stroke}
          />
          <XAxis
            dataKey="date"
            stroke={styles.axis.stroke}
            fontSize={styles.axis.fontSize}
            tick={styles.axis.tick}
            interval={calculateInterval}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 50 : 30}
            tickMargin={isMobile ? 8 : 5}
          />
          <YAxis
            stroke={styles.axis.stroke}
            fontSize={styles.axis.fontSize}
            tick={styles.axis.tick}
            width={isMobile ? 35 : 50}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={styles.tooltip.contentStyle}
            labelStyle={styles.tooltip.labelStyle}
            cursor={cursorStyle}
          />
          <Line
            type="monotone"
            dataKey="visitas"
            stroke={styles.line.stroke}
            strokeWidth={styles.line.strokeWidth}
            dot={isMobile ? false : styles.line.dot}
            activeDot={styles.line.activeDot}
            isAnimationActive={!isMobile}
            animationEasing="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

VisitsChart.displayName = "VisitsChart";

type PeriodButtonProps = {
  option: { value: PeriodFilter; label: string };
  isSelected: boolean;
  onSelect: (value: PeriodFilter) => void;
};

const PeriodButton = memo(({ option, isSelected, onSelect }: PeriodButtonProps) => {
  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  const className = useMemo(
    () =>
      [
        "px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium",
        "transition-all duration-200 min-h-[36px] sm:min-h-0",
        "touch-manipulation",
        isSelected
          ? "bg-blue-600 text-white shadow-md"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
      ].join(" "),
    [isSelected],
  );

  return (
    <button onClick={handleClick} className={className}>
      {option.label}
    </button>
  );
});

PeriodButton.displayName = "PeriodButton";

const ErrorFallback = memo(() => (
  <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
    Não foi possível carregar os dados de visitas.
  </div>
));

ErrorFallback.displayName = "ErrorFallback";

export default function Visitas() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(90);
  const isMobile = useIsMobile();
  
  const selectedMarketplace = useSelector(
    (state: RootState) => state.marketplace.marketplace,
  );
  const marketplaceType = selectedMarketplace?.marketplace_type;
  const marketplaceShopId = selectedMarketplace?.marketplace_shop_id;

  const { data, isLoading, error } = useQuery<VisitsResponse>({
    queryKey: ["visitas", marketplaceType, marketplaceShopId, selectedPeriod],
    queryFn: async () => {
      if (!marketplaceType) {
        throw new Error("Marketplace não selecionado");
      }
      return metricsAccountService.getVisits(marketplaceType, [selectedPeriod]);
    },
    enabled: Boolean(marketplaceType),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const payload = useMemo(
    () => (data?.success ? data.data : null),
    [data?.success, data?.data],
  );

  const chartData = useMemo(() => {
    if (!isMeliVisits(payload)) return [];

    const timeseries = payload.visits.timeseries;
    const periodKey = `days_${selectedPeriod}`;
    const periodData = timeseries[periodKey];

    if (!periodData) return [];

    return Object.entries(periodData).map(([date, value]) => ({
      date: formatDateForChart(date),
      visitas: value,
    }));
  }, [payload, selectedPeriod]);

  const handlePeriodChange = useCallback((period: PeriodFilter) => {
    setSelectedPeriod(period);
  }, []);

  const isMeliData = useMemo(() => isMeliVisits(payload), [payload]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={VisitasSkeleton}
      ErrorFallback={ErrorFallback}
    >
      <StatCard
        icon={<Svg.graph tailWindClasses="w-5 h-5 text-blue-600" />}
        title="Visitas"
        color="blue"
        variant="soft"
      >
        {isMeliData ? (
          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {/* Botões de filtro */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 -mx-1 sm:mx-0 px-1 sm:px-0">
              {PERIOD_OPTIONS.map((option) => (
                <PeriodButton
                  key={option.value}
                  option={option}
                  isSelected={selectedPeriod === option.value}
                  onSelect={handlePeriodChange}
                />
              ))}
            </div>

            {/* Gráfico */}
            <VisitsChart key={selectedPeriod} data={chartData} isMobile={isMobile} />
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#475569] mt-3">
            Sem dados de visitas disponíveis.
          </p>
        )}
      </StatCard>
    </AsyncBoundary>
  );
}

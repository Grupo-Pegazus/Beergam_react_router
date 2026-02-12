import { useMemo, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { useGeographicDistribution } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import {
  Skeleton,
  Typography,
  Stack,
  Box,
  Paper,
} from "@mui/material";
import PaginationBar from "~/src/components/ui/PaginationBar";
import MainCards from "~/src/components/ui/MainCards";
import { Fields } from "~/src/components/utils/_fields";
import { type Dayjs } from "dayjs";
import { FilterDatePicker } from "~/src/components/filters";
import { dateStringToDayjs } from "~/src/utils/date";

const geoUrl = "https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json";

interface GeographyFeature {
  rsmKey?: string;
  id?: string;
  properties?: {
    id?: string;
    sigla?: string;
    nome?: string;
  };
}

interface GeographiesRenderProps {
  geographies: GeographyFeature[] | Record<string, GeographyFeature>;
}

interface GeographicMapProps {
  period?: "last_day" | "last_7_days" | "last_15_days" | "last_30_days" | "last_90_days" | "custom";
}

const ITEMS_PER_PAGE = 10;

export default function GeographicMap({ period = "last_90_days" }: GeographicMapProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "last_day" | "last_7_days" | "last_15_days" | "last_30_days" | "last_90_days" | "custom"
  >(period as "last_day" | "last_7_days" | "last_15_days" | "last_30_days" | "last_90_days" | "custom");

  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [rankingPage, setRankingPage] = useState(1);

  const { data, isLoading, error } = useGeographicDistribution({
    period: selectedPeriod,
    date_from: dateFrom?.toISOString() || undefined,
    date_to: dateTo?.toISOString() || undefined,
  });

  const distribution = useMemo(() => {
    if (!data?.success || !data.data?.distribution) return [];
    return data.data.distribution;
  }, [data]);

  const sortedDistribution = useMemo(() => {
    return [...distribution].sort((a, b) => b.units - a.units);
  }, [distribution]);

  const paginatedDistribution = useMemo(() => {
    const startIndex = (rankingPage - 1) * ITEMS_PER_PAGE;
    return sortedDistribution.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedDistribution, rankingPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedDistribution.length / ITEMS_PER_PAGE);
  }, [sortedDistribution.length]);

  const maxUnits = useMemo(() => {
    if (distribution.length === 0) return 1;
    return Math.max(...distribution.map((item) => item.units));
  }, [distribution]);

  const getFillColor = useCallback(
    (units: number): string => {
      if (maxUnits === 0) return "rgba(249, 115, 22, 0.18)";
      const intensity = units / maxUnits;
      const opacity = 0.3 + intensity * 0.7;
      return `rgba(249, 115, 22, ${opacity})`;
    },
    [maxUnits]
  );

  const handlePeriodChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPeriod = event.target.value as "last_day" | "last_7_days" | "last_30_days" | "last_90_days" | "custom";
      setSelectedPeriod(newPeriod);

      // Limpa as datas quando não é período customizado
      if (newPeriod !== "custom") {
        setDateFrom(null);
        setDateTo(null);
      }
    },
    []
  );

  const handleDateFromChange = useCallback((newValue: Dayjs | null) => {
    setDateFrom(newValue);
  }, []);

  const handleDateToChange = useCallback((newValue: Dayjs | null) => {
    setDateTo(newValue);
  }, []);

  const handleRankingPageChange = useCallback((page: number) => {
    setRankingPage(page);
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={() => (
        <div className="h-96 w-full">
          <Skeleton variant="rectangular" height="100%" className="rounded-lg" />
        </div>
      )}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar a distribuição geográfica.
        </div>
      )}
    >
      <MainCards className="p-3 md:p-4 bg-transparent!">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
              <div className="flex-1 w-full sm:w-auto">
                {selectedPeriod === "custom" && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                    <FilterDatePicker
                      label="Data de início"
                      value={dateFrom?.toISOString() ?? undefined}
                      onChange={(value) => handleDateFromChange(value ? dateStringToDayjs(value) : null)}
                    />
                    <FilterDatePicker
                      label="Data de fim"
                      value={dateTo?.toISOString() ?? undefined}
                      onChange={(value) => handleDateToChange(value ? dateStringToDayjs(value) : null)}
                    />
                  </Stack>
                )}
              </div>
            </div>
          </div>

          {selectedPeriod === "custom" && (!dateFrom || !dateTo) ? (
            <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <Typography variant="body2" color="text.secondary" className="text-center text-sm md:text-base">
                Selecione as datas de início e fim para visualizar a distribuição geográfica.
              </Typography>
            </div>
          ) : distribution.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <Typography variant="body2" color="text.secondary" className="text-center text-sm md:text-base">
                Nenhum dado disponível para o período selecionado.
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:items-start">
              {/* Ranking - Mobile primeiro, Desktop à esquerda */}
              <div className="lg:col-span-1 flex flex-col order-2 lg:order-1 w-full">

                <Paper
                  className="bg-beergam-section-background!">
                  <h3 className="text-xs mb-4 md:text-sm text-beergam-typography-primary!">
                    Ranking de Estados
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                    {paginatedDistribution.map((item, index) => {
                      const globalIndex = (rankingPage - 1) * ITEMS_PER_PAGE + index;
                      return (
                        <Paper

                          key={item.state}
                          className="flex items-center justify-between"
                        // className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-beergam-section-background! hover:bg-slate-100 transition-colors border border-beergam-section-border!"
                        >
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <span className="text-xs md:text-sm font-bold text-beergam-typography-secondary! w-6 md:w-8 shrink-0">
                              {globalIndex + 1}°
                            </span>
                            <span className="text-xs md:text-sm font-medium text-beergam-typography-primary! truncate">
                              {item.state_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
                            <span className="text-xs md:text-sm text-beergam-typography-secondary! whitespace-nowrap">
                              {item.units} unid.
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-beergam-typography-primary! whitespace-nowrap min-w-[50px] md:min-w-[60px] text-right">
                              {parseFloat(item.percentage).toFixed(2)}%
                            </span>
                          </div>
                        </Paper>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <Box className="flex justify-center mt-4 shrink-0">
                      <PaginationBar
                        page={rankingPage}
                        totalPages={totalPages}
                        showEntity={false}
                        onChange={handleRankingPageChange}
                      />
                    </Box>
                  )}
                </Paper>
              </div>

              {/* Mapa - Mobile primeiro, Desktop à direita */}
              <div className="lg:col-span-2 flex flex-col space-y-3 md:space-y-4 order-1 lg:order-2 w-full">
                <div className="relative">
                  <Fields.wrapper className="w-full sm:w-auto mb-4">
                    <Fields.label text="Período" />
                    <Fields.select
                      value={selectedPeriod}
                      onChange={handlePeriodChange}
                      options={[
                        { value: "last_day", label: "Hoje" },
                        { value: "last_7_days", label: "Últimos 7 dias" },
                        { value: "last_15_days", label: "Últimos 15 dias" },
                        { value: "last_30_days", label: "Últimos 30 dias" },
                        { value: "last_90_days", label: "Últimos 90 dias" },
                        { value: "custom", label: "Período personalizado" },
                      ]}
                    />
                  </Fields.wrapper>
                  <div
                    className="h-[350px] md:h-[400px] lg:h-[500px] w-full relative"
                  >
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={{
                        center: [-55, -15],
                        scale: 800,
                      }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }: GeographiesRenderProps) => {
                          // Garante que geographies seja um array
                          const geographiesArray = Array.isArray(geographies)
                            ? geographies
                            : Object.values(geographies || {});

                          return geographiesArray.map((geo: GeographyFeature) => {
                            // Para TopoJSON, o ID pode estar em geo.id ou geo.properties.id
                            const stateCode = geo.id || geo.properties?.id || geo.properties?.sigla || "";
                            const distributionItem = distribution.find(
                              (item) => item.state === stateCode
                            );
                            const units = distributionItem?.units || 0;

                            // Prepara o conteúdo do tooltip
                            const tooltipText = distributionItem
                              ? `${distributionItem.state_name || stateCode}<br/>${distributionItem.units} unidades<br/>${parseFloat(distributionItem.percentage).toFixed(2)}%`
                              : `${geo.properties?.nome || stateCode}<br/>0 unidades<br/>0%`;

                            return (
                              <Geography
                                key={geo.rsmKey || geo.id || stateCode}
                                geography={geo}
                                fill={getFillColor(units)}
                                stroke="#fff"
                                strokeWidth={0.5}
                                data-tooltip-id="map-tooltip"
                                data-tooltip-html={tooltipText}
                                style={{
                                  default: { outline: "none" },
                                  hover: {
                                    fill: "#f97316",
                                    outline: "none",
                                    cursor: "pointer",
                                  },
                                  pressed: { outline: "none" },
                                }}
                              />
                            );
                          });
                        }}
                      </Geographies>
                    </ComposableMap>
                    <Tooltip id="map-tooltip" place="top" />
                  </div>
                </div>

                {/* Legenda de cores */}
                <Paper className="flex flex-col gap-2 bg-beergam-section-background!">
                  <h3 className="text-xs mb-4 md:text-sm text-beergam-typography-primary!">
                    Escala de Cores
                  </h3>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-1">
                      <div
                        className="h-4 md:h-6 rounded"
                        style={{
                          background: 'linear-gradient(to right, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 1))',
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs md:text-sm text-beergam-typography-secondary!">
                    <span>0 unidades</span>
                    <span>{maxUnits} unidades</span>
                  </div>
                </Paper>
              </div>
            </div>
          )}
        </div>
      </MainCards>
    </AsyncBoundary>
  );
}


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
  Pagination,
  Box,
  Paper,
} from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import { Fields } from "~/src/components/utils/_fields";
import { type Dayjs } from "dayjs";
import { FilterDatePicker } from "~/src/components/filters";
import dayjs from "dayjs";

const geoUrl ="https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json";

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
  period?: "last_day" | "last_7_days" | "last_30_days" | "custom";
}

const ITEMS_PER_PAGE = 10;

export default function GeographicMap({ period = "last_day" }: GeographicMapProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "last_day" | "last_7_days" | "last_30_days" | "custom"
  >(period as "last_day" | "last_7_days" | "last_30_days" | "custom");

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
      if (maxUnits === 0) return "#f3f4f6";
      const intensity = units / maxUnits;
      const opacity = 0.3 + intensity * 0.7;
      return `rgba(249, 115, 22, ${opacity})`;
    },
    [maxUnits]
  );

  const handlePeriodChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPeriod = event.target.value as "last_day" | "last_7_days" | "last_30_days" | "custom";
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

  const handleRankingPageChange = useCallback((_event: unknown, page: number) => {
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
      <MainCards className="p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <Typography variant="caption" color="text.secondary" className="text-xs md:text-sm">
                  {selectedPeriod === "last_day"
                    ? "Último dia"
                    : selectedPeriod === "last_7_days"
                      ? "Últimos 7 dias"
                      : selectedPeriod === "last_30_days"
                        ? "Últimos 30 dias"
                        : "Período personalizado"}
                </Typography>
                {selectedPeriod === "custom" && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                    <FilterDatePicker
                      label="Data de início"
                      value={dateFrom?.toISOString() ?? undefined}
                      onChange={(value) => handleDateFromChange(value ? dayjs(value) : null)}
                    />
                    <FilterDatePicker
                      label="Data de fim"
                      value={dateTo?.toISOString() ?? undefined}
                      onChange={(value) => handleDateToChange(value ? dayjs(value) : null)}
                    />
                  </Stack>
                )}
              </div>
              <Fields.wrapper className="min-w-[150px] w-full sm:w-auto">
                <Fields.label text="Período" />
                <Fields.select
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  options={[
                    { value: "last_day", label: "Último dia" },
                    { value: "last_7_days", label: "Últimos 7 dias" },
                    { value: "last_30_days", label: "Últimos 30 dias" },
                    { value: "custom", label: "Período personalizado" },
                  ]}
                />
              </Fields.wrapper>
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
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
              {/* Ranking - Mobile primeiro, Desktop à esquerda */}
              <div className="lg:col-span-1 space-y-3 md:space-y-4 order-2 lg:order-1">
                <div>
                  <Typography variant="h6" fontWeight={600} className="text-slate-900 mb-2 md:mb-4 text-base md:text-xl">
                    Ranking de Estados
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    className="p-2 max-h-[400px] md:max-h-[600px] overflow-y-auto"
                    sx={{ 
                      backgroundColor: 'background.paper',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#94a3b8',
                        },
                      },
                    }}
                  >
                    <div className="space-y-2">
                      {paginatedDistribution.map((item, index) => {
                        const globalIndex = (rankingPage - 1) * ITEMS_PER_PAGE + index;
                        return (
                          <div
                            key={item.state}
                            className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                              <span className="text-xs md:text-sm font-bold text-slate-600 w-6 md:w-8 shrink-0">
                                {globalIndex + 1}°
                              </span>
                              <span className="text-xs md:text-sm font-medium text-slate-900 truncate">
                                {item.state_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2">
                              <span className="text-xs md:text-sm text-slate-600 whitespace-nowrap">
                                {item.units} unid.
                              </span>
                              <span className="text-xs md:text-sm font-semibold text-slate-900 whitespace-nowrap min-w-[50px] md:min-w-[60px] text-right">
                                {parseFloat(item.percentage).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <Box className="flex justify-center mt-4">
                        <Pagination
                          count={totalPages}
                          page={rankingPage}
                          onChange={handleRankingPageChange}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    )}
                  </Paper>
                </div>
              </div>

              {/* Mapa - Mobile primeiro, Desktop à direita */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4 order-1 lg:order-2">
                <div className="relative">
                  <div 
                    className="h-[300px] md:h-[400px] lg:h-[600px] w-full relative"
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
                <Paper variant="outlined" className="p-3 md:p-4">
                  <Typography variant="subtitle2" fontWeight={600} className="text-slate-900 mb-2 md:mb-3 text-sm md:text-base">
                    Escala de Cores
                  </Typography>
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
                  <div className="mt-2 flex justify-between text-xs md:text-sm text-slate-500">
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


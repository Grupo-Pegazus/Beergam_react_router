import { Skeleton } from "@mui/material";
import { useMemo } from "react";
import { useParetoChart, useParetoFilters, useParetoTable } from "~/features/financeiro/pareto/hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import Section from "~/src/components/ui/Section";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import ParetoChart from "./components/ParetoChart";
import ParetoFiltersSection from "./components/ParetoFilters";
import ParetoSkuList from "./components/ParetoSkuList";
import ParetoSummaryCards from "./components/ParetoSummaryCards";

function SummarySkeleton() {
    return (
        <MainCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton
                    key={i}
                    sx={{ bgcolor: "var(--color-beergam-gray)" }}
                    variant="rectangular"
                    height={110}
                    className="rounded-2xl"
                />
            ))}
        </MainCards>
    );
}

function ChartSkeleton() {
    return (
        <MainCards>
            <Skeleton
                sx={{ bgcolor: "var(--color-beergam-gray)" }}
                variant="rectangular"
                height={320}
                className="rounded-2xl"
            />
        </MainCards>
    );
}

function ListSkeleton() {
    return (
        <div className="grid gap-2">
            {[...Array(5)].map((_, i) => (
                <Skeleton
                    key={i}
                    sx={{ bgcolor: "var(--color-beergam-gray)" }}
                    variant="rectangular"
                    height={56}
                    className="rounded-lg"
                />
            ))}
        </div>
    );
}

export default function ParetoPage() {
    const { filters, setFilters, resetFilters, chartFilters, tableFilters, setPage, applyFilters } =
        useParetoFilters();

    const queryChartFilters = useMemo(() => chartFilters, [chartFilters]);
    const queryTableFilters = useMemo(() => tableFilters, [tableFilters]);

    const { data: chartData, isLoading: chartLoading, error: chartError } = useParetoChart(queryChartFilters);
    const { data: tableData, isLoading: tableLoading, error: tableError } = useParetoTable(queryTableFilters);

    const chartResponse = chartData?.data ?? null;
    const tableResponse = tableData?.data ?? null;

    return (
        <div className="w-full min-w-0 overflow-x-hidden">
            <Section title="Filtros">
                <ParetoFiltersSection
                    value={filters}
                    onChange={setFilters}
                    onReset={resetFilters}
                    onSubmit={() => applyFilters(filters)}
                    isSubmitting={chartLoading || tableLoading}
                />
            </Section>

            <CensorshipWrapper censorshipKey="pareto_resumo">
                <Section title="Resumo">
                    <AsyncBoundary
                        isLoading={chartLoading}
                        error={chartError as unknown}
                        Skeleton={SummarySkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar o resumo da análise de Pareto.
                                </div>
                            </MainCards>
                        )}
                    >
                        {chartResponse && (
                            <ParetoSummaryCards data={chartResponse} />
                        )}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>

            <Section title="Análise de Pareto">
                <AsyncBoundary
                    isLoading={chartLoading}
                    error={chartError as unknown}
                    Skeleton={ChartSkeleton}
                    ErrorFallback={() => (
                        <MainCards>
                            <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                Não foi possível carregar o gráfico de Pareto.
                            </div>
                        </MainCards>
                    )}
                >
                    {chartResponse && <ParetoChart data={chartResponse} />}
                </AsyncBoundary>
            </Section>

            <CensorshipWrapper censorshipKey="pareto_skus">
                <Section title="SKUs por Pareto">
                    <AsyncBoundary
                        isLoading={tableLoading}
                        error={tableError as unknown}
                        Skeleton={ListSkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar a lista de SKUs.
                                </div>
                            </MainCards>
                        )}
                    >
                        {tableResponse && (
                            <ParetoSkuList
                                data={tableResponse}
                                onChangePage={setPage}
                            />
                        )}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>
        </div>
    );
}

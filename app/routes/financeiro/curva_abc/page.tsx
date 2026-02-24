import { Skeleton } from "@mui/material";
import { useMemo } from "react";
import { useABCCurve, useABCCurveFilters } from "~/features/financeiro/abc-curve/hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import Section from "~/src/components/ui/Section";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import ABCCurveDistributionChart from "./components/ABCCurveDistributionChart";
import ABCCurveFiltersSection from "./components/ABCCurveFilters";
import ABCCurveSkuList from "./components/ABCCurveSkuList";
import ABCCurveSummaryCards from "./components/ABCCurveSummaryCards";

function SummarySkeleton() {
    return (
        <MainCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(5)].map((_, i) => (
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

export default function CurvaABCPage() {
    const { filters, setFilters, resetFilters, apiFilters, setPage, applyFilters } = useABCCurveFilters();
    const queryFilters = useMemo(() => apiFilters, [apiFilters]);
    const { data, isLoading, error } = useABCCurve(queryFilters);

    const handleResetFilters = () => resetFilters();

    const handleChangePage = (page: number) => {
        setPage(page);
    };

    const responseData = data?.data ?? null;

    return (
        <div className="w-full min-w-0 overflow-x-hidden">
            <Section title="Filtros">
                <ABCCurveFiltersSection
                    value={filters}
                    onChange={setFilters}
                    onReset={handleResetFilters}
                    onSubmit={() => applyFilters(filters)}
                    isSubmitting={isLoading}
                />
            </Section>

            <CensorshipWrapper censorshipKey="curva_abc_resumo">
                <Section title="Resumo">
                    <AsyncBoundary
                        isLoading={isLoading}
                        error={error as unknown}
                        Skeleton={SummarySkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar o resumo da Curva ABC.
                                </div>
                            </MainCards>
                        )}
                    >
                        {responseData && <ABCCurveSummaryCards data={responseData} />}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>

            <Section title="Distribuição por Classe">
                <AsyncBoundary
                    isLoading={isLoading}
                    error={error as unknown}
                    Skeleton={ChartSkeleton}
                    ErrorFallback={() => (
                        <MainCards>
                            <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                Não foi possível carregar o gráfico.
                            </div>
                        </MainCards>
                    )}
                >
                    {responseData && <ABCCurveDistributionChart data={responseData} />}
                </AsyncBoundary>
            </Section>

            <CensorshipWrapper censorshipKey="curva_abc_skus">
                <Section title="SKUs por Curva ABC">
                    <AsyncBoundary
                        isLoading={isLoading}
                        error={error as unknown}
                        Skeleton={ListSkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar a lista de SKUs.
                                </div>
                            </MainCards>
                        )}
                    >
                        {responseData && (
                            <ABCCurveSkuList
                                data={responseData}
                                onChangePage={handleChangePage}
                            />
                        )}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>
        </div>
    );
}

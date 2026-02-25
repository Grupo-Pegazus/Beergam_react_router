import { Skeleton } from "@mui/material";
import { useMemo } from "react";
import { useFullSuggestion, useFullSuggestionFilters } from "~/features/produtos/meli/full-suggestion/hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import Section from "~/src/components/ui/Section";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import FullSuggestionFiltersSection from "./components/FullSuggestionFilters";
import FullSuggestionSummaryCards from "./components/FullSuggestionSummaryCards";
import FullSuggestionTable from "./components/FullSuggestionTable";

function SummarySkeleton() {
    return (
        <MainCards className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
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

function TableSkeleton() {
    return (
        <div className="grid gap-2">
            {[...Array(8)].map((_, i) => (
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

export default function FullSuggestionPage() {
    const { filters, setFilters, resetFilters, apiFilters, setPage, applyFilters } = useFullSuggestionFilters();
    const queryFilters = useMemo(() => apiFilters, [apiFilters]);
    const { data, isLoading, error } = useFullSuggestion(queryFilters);

    const responseData = data?.data ?? null;

    return (
        <div className="w-full min-w-0 overflow-x-hidden">
            <Section title="Filtros">
                <FullSuggestionFiltersSection
                    value={filters}
                    onChange={setFilters}
                    onReset={resetFilters}
                    onSubmit={() => applyFilters(filters)}
                    isSubmitting={isLoading}
                />
            </Section>

            <CensorshipWrapper censorshipKey="full_suggestion_resumo">
                <Section title="Resumo">
                    <AsyncBoundary
                        isLoading={isLoading}
                        error={error as unknown}
                        Skeleton={SummarySkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar o resumo das sugestões FULL.
                                </div>
                            </MainCards>
                        )}
                    >
                        {responseData && <FullSuggestionSummaryCards data={responseData} />}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>

            <CensorshipWrapper censorshipKey="full_suggestion_itens">
                <Section title="Sugestões de Envio">
                    <AsyncBoundary
                        isLoading={isLoading}
                        error={error as unknown}
                        Skeleton={TableSkeleton}
                        ErrorFallback={() => (
                            <MainCards>
                                <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
                                    Não foi possível carregar as sugestões de envio FULL.
                                </div>
                            </MainCards>
                        )}
                    >
                        {responseData && (
                            <MainCards>
                                <FullSuggestionTable
                                    data={responseData}
                                    onChangePage={setPage}
                                />
                            </MainCards>
                        )}
                    </AsyncBoundary>
                </Section>
            </CensorshipWrapper>
        </div>
    );
}

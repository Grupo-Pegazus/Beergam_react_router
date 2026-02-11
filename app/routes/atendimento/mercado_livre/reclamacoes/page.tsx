import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ClaimsFilters as ClaimsFiltersBar } from "~/features/reclamacoes/components/ClaimsFilters";
import { ClaimsList } from "~/features/reclamacoes/components/ClaimsList";
import { ClaimsMetrics } from "~/features/reclamacoes/components/ClaimsMetrics";
import { reclamacoesService } from "~/features/reclamacoes/service";
import type {
  ClaimsFilters,
  ClaimsFiltersState,
  ClaimsInsights,
} from "~/features/reclamacoes/typings";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import { dateStringToISO } from "~/src/utils/date";

const DEFAULT_FILTERS: ClaimsFiltersState = {
  status: "",
  claim_id: "",
  text: "",
  date_from: undefined,
  date_to: undefined,
  affects_reputation: "",
  page: 1,
  per_page: 20,
  sort_by: "date_created",
  sort_order: "desc",
};

function mapToApiFilters(
  filters: ClaimsFiltersState
): Partial<ClaimsFilters> {
  return {
    status: filters.status || undefined,
    claim_id: filters.claim_id || undefined,
    text: filters.text || undefined,
    date_from: filters.date_from ? dateStringToISO(filters.date_from) : undefined,
    date_to: filters.date_to ? dateStringToISO(filters.date_to) : undefined,
    affects_reputation: filters.affects_reputation || undefined,
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };
}

export default function ReclamacoesPage() {
  const [filters, setFilters] =
    useState<ClaimsFiltersState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ClaimsFiltersState>(DEFAULT_FILTERS);
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();

  const { page: pageFromUrl } = usePageFromSearchParams();
  const apiFilters = useMemo(() => {
    const base = mapToApiFilters(appliedFilters);
    return { ...base, page: pageFromUrl };
  }, [appliedFilters, pageFromUrl]);

  const claimsQuery = useQuery({
    queryKey: ["claims", apiFilters],
    queryFn: () => reclamacoesService.list(apiFilters),
  });

  const metricsQuery = useQuery({
    queryKey: ["claims_metrics"],
    queryFn: () => reclamacoesService.getMetrics(),
    staleTime: 1000 * 60 * 5,
  });

  const insights: ClaimsInsights | undefined =
    (claimsQuery.data?.success
      ? claimsQuery.data.data.insights
      : undefined) ??
    (metricsQuery.data?.success
      ? metricsQuery.data.data.insights
      : undefined);

  const claims = useMemo(() => {
    if (!claimsQuery.data?.success) return [];
    const cs = claimsQuery.data.data.claims;
    return Array.isArray(cs) ? cs : [];
  }, [claimsQuery.data]);

  const pagination = claimsQuery.data?.success
    ? claimsQuery.data.data.pagination
    : undefined;

  function handleFiltersChange(next: ClaimsFiltersState) {
    setFilters(next);
  }

  function applyFilters() {
    setAppliedFilters({ ...filters, page: 1 });
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
    queryClient.invalidateQueries({ queryKey: ["claims"] });
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    queryClient.invalidateQueries({ queryKey: ["claims"] });
  }

  function handlePageChange(nextPage: number) {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  }

  const syncPageWithUrl = true;

  return (
    <>
      <Grid cols={{ base: 1 }} gap={4} className="mb-4">
        <Section
          title="Visão geral"
          actions={
            <span className="text-xs text-beergam-typography-secondary">
              Dados dos últimos 30 dias
            </span>
          }
        >
          <ClaimsMetrics
            insights={insights}
            loading={claimsQuery.isLoading || metricsQuery.isLoading}
          />
        </Section>

        <Section title="Filtrar reclamações">
          <ClaimsFiltersBar
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
        </Section>

        <Section
          title="Reclamações"
          actions={
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-beergam-typography-secondary">
                {pagination ? `${pagination.total_count} encontradas` : "—"}
              </span>
              <span className="text-xs text-beergam-typography-secondary">
                Dados dos últimos 30 dias
              </span>
            </div>
          }
        >
          <ClaimsList
            claims={claims}
            pagination={pagination}
            loading={claimsQuery.isLoading}
            onPageChange={handlePageChange}
            syncPageWithUrl={syncPageWithUrl}
          />
        </Section>
      </Grid>
    </>
  );
}

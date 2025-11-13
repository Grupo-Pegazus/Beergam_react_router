import { useCallback } from "react";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import MetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import { AnunciosFilters } from "~/features/anuncios/components/Filters";
import type { AnunciosFiltersState } from "~/features/anuncios/components/Filters";
import { useAnunciosFilters } from "~/features/anuncios/hooks";
import AnuncioList from "~/features/anuncios/components/AnuncioList/AnuncioList";
export default function AnunciosPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    apiFilters,
    applyFilters,
  } = useAnunciosFilters();

  const handleFiltersChange = useCallback(
    (next: AnunciosFiltersState) => {
      setFilters(next);
    },
    [setFilters],
  );

  return (
    <>
      <Section title="Resumo">
        <Grid cols={{ base: 1, lg: 1 }}>
          <MetricasCards />
        </Grid>
      </Section>

      <Section title="Top 5 anúncios mais vendidos">
        <Grid cols={{ base: 1, lg: 1 }}>
          <TopAnunciosVendidos />
        </Grid>
      </Section>

      <Section title="Todos os anúncios">
        <AnunciosFilters
          value={filters}
          onChange={handleFiltersChange}
          onReset={resetFilters}
          onSubmit={applyFilters}
        />
        <AnuncioList filters={apiFilters} />
      </Section>
    </>
  );
}

import { useCallback, useState } from "react";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import MetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import { AnunciosFilters } from "~/features/anuncios/components/Filters";
import type { AnunciosFiltersState } from "~/features/anuncios/components/Filters";
import { useAnunciosFilters, useAdsWithoutSku } from "~/features/anuncios/hooks";
import AnuncioList from "~/features/anuncios/components/AnuncioList/AnuncioList";
import AnunciosWithoutSkuModal from "~/features/anuncios/components/AnunciosWithoutSkuModal";
import { Alert, Button } from "@mui/material";
export default function AnunciosPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    apiFilters,
    applyFilters,
  } = useAnunciosFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: withoutSkuData } = useAdsWithoutSku();

  const totalWithoutSku = withoutSkuData?.success
    ? withoutSkuData.data?.total_without_sku || 0
    : 0;

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

      {totalWithoutSku > 0 && (
        <Section title="Pendências">
          <Grid cols={{ base: 1, lg: 1 }}>
            <Alert
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                >
                  Ver pendências
                </Button>
              }
            >
              Você possui {totalWithoutSku} anúncio(s) sem SKU cadastrado. Clique para
              gerenciar.
            </Alert>
          </Grid>
        </Section>
      )}

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

      <AnunciosWithoutSkuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

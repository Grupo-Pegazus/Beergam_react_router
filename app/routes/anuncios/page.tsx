import { Alert } from "@mui/material";
import { useCallback, useState } from "react";
import AnuncioList from "~/features/anuncios/components/AnuncioList/AnuncioList";
import AnunciosWithoutSkuModal from "~/features/anuncios/components/AnunciosWithoutSkuModal";
import type { AnunciosFiltersState } from "~/features/anuncios/components/Filters";
import { AnunciosFilters } from "~/features/anuncios/components/Filters";
import MetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import {
  useAdsWithoutSku,
  useAnunciosFilters,
} from "~/features/anuncios/hooks";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { CensorshipWrapper } from "~/src/components/utils/Censorship/CensorshipWrapper";
export default function AnunciosPage() {
  const { filters, setFilters, resetFilters, apiFilters, applyFilters } =
    useAnunciosFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: withoutSkuData } = useAdsWithoutSku();

  const totalWithoutSku = withoutSkuData?.success
    ? withoutSkuData.data?.total_without_sku || 0
    : 0;

  const handleFiltersChange = useCallback(
    (next: AnunciosFiltersState) => {
      setFilters(next);
    },
    [setFilters]
  );

  return (
    <>
      <CensorshipWrapper controlChildren censorshipKey="resumo_anuncios">
        <Section title="Resumo">
          <Grid cols={{ base: 1, lg: 1 }}>
            <MetricasCards />
          </Grid>
        </Section>
      </CensorshipWrapper>

      {totalWithoutSku > 0 && (
        <Section title="Pendências">
          <Grid cols={{ base: 1, lg: 1 }}>
            <Alert
              severity="warning"
              action={
                <BeergamButton
                  title="Ver pendências"
                  animationStyle="fade"
                  onClick={() => setIsModalOpen(true)}
                />
              }
            >
              Você possui {totalWithoutSku} anúncio(s) sem SKU cadastrado.
              Clique para gerenciar.
            </Alert>
          </Grid>
        </Section>
      )}

      <CensorshipWrapper
        controlChildren
        censorshipKey="resumo_top_anuncios_vendidos"
      >
        <Section title="Top 5 anúncios mais vendidos">
          <Grid cols={{ base: 1, lg: 1 }}>
            <TopAnunciosVendidos />
          </Grid>
        </Section>
      </CensorshipWrapper>

      <CensorshipWrapper controlChildren censorshipKey="anuncios_list">
        <Section title="Todos os anúncios">
          <AnunciosFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
          <AnuncioList filters={apiFilters} />
        </Section>
      </CensorshipWrapper>

      <AnunciosWithoutSkuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

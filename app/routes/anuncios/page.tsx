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
  useReprocessAllAds,
} from "~/features/anuncios/hooks";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { CensorshipWrapper } from "~/src/components/utils/Censorship/CensorshipWrapper";
import AlertComponent from "~/src/components/utils/Alert";
import { useModal } from "~/src/components/utils/Modal/useModal";
export default function AnunciosPage() {
  const { filters, setFilters, resetFilters, apiFilters, applyFilters } =
    useAnunciosFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: withoutSkuData } = useAdsWithoutSku();
  const { openModal, closeModal } = useModal();
  const reprocessAllMutation = useReprocessAllAds();

  const totalWithoutSku = withoutSkuData?.success
    ? withoutSkuData.data?.total_without_sku || 0
    : 0;

  const handleFiltersChange = useCallback(
    (next: AnunciosFiltersState) => {
      setFilters(next);
    },
    [setFilters]
  );

  const handleReprocessAllClick = useCallback(() => {
    openModal(
      <AlertComponent
        type="warning"
        onClose={closeModal}
        onConfirm={() => {
          reprocessAllMutation.mutate(undefined, {
            onSettled: () => {
              closeModal();
            },
          });
        }}
        confirmText="Reprocessar"
        cancelText="Cancelar"
      >
        <h3 className="font-semibold text-lg mb-2">
          Reprocessar todos os anúncios
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Tem certeza que deseja reprocessar todos os anúncios?
        </p>
        <p className="text-sm text-gray-600 font-semibold">
          ⚠️ Atenção: Esta ação só pode ser realizada uma vez por mês.
        </p>
      </AlertComponent>,
      { title: "Confirmar reprocessamento" }
    );
  }, [openModal, closeModal, reprocessAllMutation]);

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
          <div className="flex justify-end mb-4">
            <BeergamButton
              title="Reprocessar todos os anúncios"
              mainColor="beergam-orange"
              animationStyle="slider"
              onClick={handleReprocessAllClick}
              disabled={reprocessAllMutation.isPending}
              loading={reprocessAllMutation.isPending}
            />
          </div>
          <AnunciosFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={applyFilters}
          />
          <AnuncioList filters={apiFilters} syncPageWithUrl />
        </Section>
      </CensorshipWrapper>

      <AnunciosWithoutSkuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

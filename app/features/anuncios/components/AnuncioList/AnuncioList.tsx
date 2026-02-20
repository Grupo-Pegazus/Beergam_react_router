import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import Alert from "~/src/components/utils/Alert";
import type { ModalOptions } from "~/src/components/utils/Modal/ModalContext";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";
import { useAnuncios, useChangeAdStatus, useAdsReprocessQuota, useReprocessAds } from "../../hooks";
import type { AdsFilters, Anuncio } from "../../typings";
import AnuncioCard from "./AnuncioCard";
import AnuncioListSkeleton from "./AnuncioListSkeleton";

interface AnunciosListProps {
  filters?: Partial<AdsFilters>;
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

export default function AnunciosList({ filters = {}, syncPageWithUrl = false }: AnunciosListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);
  const [mutatingAdId, setMutatingAdId] = useState<string | null>(null);
  const [reprocessingAdId, setReprocessingAdId] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!syncPageWithUrl) setPage(filters.page ?? 1);
  }, [filters.page, syncPageWithUrl]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { page: pageFromUrl } = usePageFromSearchParams();
  const effectivePage = syncPageWithUrl ? pageFromUrl : page;

  const { data, isLoading, error } = useAnuncios({
    ...filters,
    page: effectivePage,
    per_page: perPage,
  });

  const changeStatusMutation = useChangeAdStatus();
  const reprocessMutation = useReprocessAds();
  const { data: quotaData } = useAdsReprocessQuota();

  const anuncios = useMemo<Anuncio[]>(() => {
    if (!data?.success || !data.data?.ads) return [];
    return data.data.ads;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? anuncios.length;

  const [, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!syncPageWithUrl || isLoading || totalPages < 1 || pageFromUrl <= totalPages) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(totalPages));
        return next;
      },
      { replace: true }
    );
  }, [syncPageWithUrl, isLoading, totalPages, pageFromUrl, setSearchParams]);

  const handleToggleStatus = (anuncio: Anuncio) => {
    if (anuncio.status === "closed") return;
    const nextStatus = anuncio.status === "active" ? "paused" : "active";
    setMutatingAdId(anuncio.mlb);
    changeStatusMutation.mutate(
      { adId: anuncio.mlb, status: nextStatus },
      {
        onSettled: () => {
          setMutatingAdId(null);
        },
      }
    );
  };

  const handlePageChange = (nextPage: number) => {
    if (!syncPageWithUrl) setPage(nextPage);
  };
  const remainingQuota = quotaData?.success ? quotaData.data?.remaining ?? 0 : 0;
  return (
    <>
      {/* Container da lista de anúncios (alvo de scroll) */}
      <div id="ads-list">
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          Skeleton={AnuncioListSkeleton}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-beergam-red/50 bg-beergam-red/10 text-beergam-red! p-4">
              Não foi possível carregar os anúncios.
            </div>
          )}
        >
          <Stack spacing={2}>
            {anuncios.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-beergam-section-border p-10 text-center text-beergam-typography-secondary!">
                <span className="text-beergam-typography-secondary!">
                  <Svg.information_circle tailWindClasses="h-10 w-10" />
                </span>
                <Typography
                  variant="h6"
                  className="text-beergam-typography-secondary!"
                >
                  Nenhum anúncio encontrado com os filtros atuais.
                </Typography>
              </div>
            ) : (
              <Stack spacing={2}>
                {anuncios.map((anuncio) => (
                  <AnuncioCard
                    key={anuncio.mlb}
                    anuncio={anuncio}
                    onToggleStatus={() => handleToggleStatus(anuncio)}
                    onReprocess={() => {
                      if (remainingQuota <= 0) {
                        toast.error("Sua cota mensal de reprocessamento de anúncios acabou.");
                        return;
                      }

                      const adId = anuncio.mlb;
                      const options: ModalOptions = {
                        title: "Confirmar reprocessamento do anúncio",
                      };

                      openModal(
                        <Alert
                          type="info"
                          confirmText="Reprocessar"
                          onClose={closeModal}
                          onConfirm={() => {
                            setReprocessingAdId(adId);
                            reprocessMutation.mutate([adId], {
                              onSettled: () => setReprocessingAdId(null),
                            });
                          }}
                        >
                          <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                            Deseja reprocessar o anúncio #{adId}?
                          </h3>
                          <p className="text-sm text-beergam-typography-secondary mb-2">
                            Essa ação irá buscar novamente os dados no Mercado Livre e atualizar o anúncio no Beergam.
                          </p>
                          <p className="text-xs text-beergam-typography-secondary">
                            Cota mensal de reprocessamento:{" "}
                            <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                            <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                            <strong>{remainingQuota}</strong>.
                          </p>
                        </Alert>,
                        options
                      );
                    }}
                    isMutating={mutatingAdId === anuncio.mlb}
                    isReprocessing={reprocessingAdId === anuncio.mlb}
                    remainingQuota={remainingQuota}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </AsyncBoundary>
      </div>

      {/* Paginação fixa fora do AsyncBoundary, com scroll controlado pelo componente */}
      <PaginationBar
        page={Math.min(effectivePage, Math.max(1, totalPages))}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="anúncios"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="ads-list"
        isLoading={isLoading}
        syncWithUrl={syncPageWithUrl}
      />
    </>
  );
}

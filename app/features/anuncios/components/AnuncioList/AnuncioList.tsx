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
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
  useAnuncios,
  useBulkChangeAdsStatus,
  useChangeAdStatus,
  useAdsReprocessQuota,
  useReprocessAds,
  getProblematicCatalogAds,
} from "../../hooks";
import type { BulkAction } from "../../hooks";
import type { AdsFilters, Anuncio } from "../../typings";
import { getSelectedCount, isAdSelected, useAdsSelectionStore } from "../../selectionStore";
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
  const selectionState = useAdsSelectionStore();
  const resetSelection = useAdsSelectionStore((state) => state.reset);
  const selectAllFiltered = useAdsSelectionStore((state) => state.selectAllFiltered);

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
  const bulkChangeMutation = useBulkChangeAdsStatus();

  const anuncios = useMemo<Anuncio[]>(() => {
    if (!data?.success || !data.data?.ads) return [];
    return data.data.ads;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? anuncios.length;
  const selectedCount = getSelectedCount(selectionState, totalCount);

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

  const selectedAds = useMemo(
    () => anuncios.filter((ad) => isAdSelected(selectionState, ad.mlb)),
    [anuncios, selectionState],
  );

  const handleCloseStatus = (anuncio: Anuncio) => {
    if (anuncio.status === "closed") return;

    if (anuncio.is_catalog) {
      openModal(
        <Alert
          type="warning"
          confirmText="Entendi"
          disabledBackButton
          onClose={closeModal}
          onConfirm={closeModal}
        >
          <p className="text-sm text-beergam-typography-secondary">
            Para encerrar um anúncio de catálogo, é necessário encerrar antes o
            anúncio tradicional correspondente.
          </p>
        </Alert>,
        { title: "Não é possível encerrar apenas anúncio de catálogo" },
      );
      return;
    }

    const options: ModalOptions = {
      title: "Confirmar encerramento do anúncio",
    };

    openModal(
      <Alert
        type="warning"
        confirmText="Encerrar"
        cancelText="Cancelar"
        onClose={closeModal}
        onConfirm={() => {
          setMutatingAdId(anuncio.mlb);
          changeStatusMutation.mutate(
            { adId: anuncio.mlb, status: "closed" },
            {
              onSettled: () => {
                setMutatingAdId(null);
                closeModal();
              },
            },
          );
        }}
      >
        <p className="text-sm text-beergam-typography-secondary">
          Deseja encerrar o anúncio <strong>#{anuncio.mlb}</strong>? Esta ação
          pode ser revertida republicando o anúncio.
        </p>
      </Alert>,
      options,
    );
  };

  const handleBulkAction = (action: BulkAction) => {
    if (action === "close") {
      const problematic = getProblematicCatalogAds(selectedAds);

      if (problematic.length > 0) {
        openModal(
          <Alert
            type="warning"
            confirmText="Entendi"
            disabledBackButton
            onClose={closeModal}
            onConfirm={closeModal}
          >
            <p className="text-sm text-beergam-typography-secondary">
              Você selecionou anúncio(s) de catálogo. Para encerrar um anúncio
              sincronizado de catálogo, é necessário encerrar antes o anúncio
              tradicional correspondente — ou incluir o tradicional na mesma
              seleção para prosseguir.
            </p>
          </Alert>,
          { title: "Não é possível encerrar apenas anúncios de catálogo" },
        );
        return;
      }
    }

    const verb =
      action === "pause"
        ? "pausar"
        : action === "activate"
          ? "ativar"
          : "encerrar";

    const options: ModalOptions = {
      title: `Confirmar ${verb} anúncios em massa`,
    };

    openModal(
      <Alert
        type="warning"
        confirmText={verb.charAt(0).toUpperCase() + verb.slice(1)}
        cancelText="Cancelar"
        onClose={closeModal}
        onConfirm={() => {
          bulkChangeMutation.mutate(action, {
            onSettled: () => {
              closeModal();
            },
          });
        }}
      >
        <p className="text-sm text-beergam-typography-secondary mb-1">
          Você está prestes a {verb}{" "}
          <strong>{selectedCount}</strong> anúncio(s) com base nos filtros atuais.
        </p>
        <p className="text-xs text-beergam-typography-secondary">
          Esta ação pode demorar alguns minutos e será processada em segundo plano no servidor.
        </p>
      </Alert>,
      options,
    );
  };

  return (
    <>
      {/* Container da lista de anúncios (alvo de scroll) */}
      <div id="ads-list">
        {selectedCount > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-beergam-input-border/40 bg-beergam-section-background/80 px-4 py-2">
            <Typography variant="body2" className="text-beergam-typography-secondary">
              <span className="font-semibold text-beergam-typography-primary">{selectedCount}</span>{" "}
              anúncio(s) selecionado(s)
            </Typography>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs text-beergam-typography-secondary hover:underline"
                onClick={resetSelection}
              >
                Limpar seleção
              </button>
              <BeergamButton
                title="Pausar"
                mainColor="beergam-blue"
                animationStyle="slider"
                onClick={() => handleBulkAction("pause")}
                disabled={bulkChangeMutation.isPending}
                loading={bulkChangeMutation.isPending}
                className="hidden sm:inline-flex"
              />
              <BeergamButton
                title="Ativar"
                mainColor="beergam-green"
                animationStyle="slider"
                onClick={() => handleBulkAction("activate")}
                disabled={bulkChangeMutation.isPending}
                loading={bulkChangeMutation.isPending}
                className="hidden sm:inline-flex"
              />
              <BeergamButton
                title="Encerrar"
                mainColor="beergam-red"
                animationStyle="slider"
                onClick={() => handleBulkAction("close")}
                disabled={bulkChangeMutation.isPending}
                loading={bulkChangeMutation.isPending}
                className="hidden sm:inline-flex"
              />
            </div>
          </div>
        )}
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
                {anuncios.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-beergam-mui-paper px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-beergam-primary"
                      checked={selectionState.mode === "allFiltered"}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectAllFiltered({
                            ...filters,
                            page: undefined,
                            per_page: undefined,
                          });
                        } else {
                          resetSelection();
                        }
                      }}
                    />
                    <Typography variant="body2" className="text-beergam-typography-primary">
                      Selecionar todos os anúncios deste filtro
                    </Typography>
                  </div>
                )}
                {anuncios.map((anuncio) => (
                  <AnuncioCard
                    key={anuncio.mlb}
                    anuncio={anuncio}
                    onToggleStatus={() => handleToggleStatus(anuncio)}
                    onCloseStatus={() => handleCloseStatus(anuncio)}
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

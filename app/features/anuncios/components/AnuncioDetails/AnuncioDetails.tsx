import { Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { BeergamAlert } from "~/src/components/ui/BeergamAlert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import AlertModal from "~/src/components/utils/Alert";
import type { ModalOptions } from "~/src/components/utils/Modal/ModalContext";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { useAdsReprocessQuota, useAnuncioDetails, useReprocessAds } from "../../hooks";
import AnuncioDetailsSkeleton from "./AnuncioDetailsSkeleton";
import AnuncioInfo from "./AnuncioInfo/AnuncioInfo";
import FinancialMetrics from "./FinancialMetrics/FinancialMetrics";
import ImageGallery from "./ImageGallery/ImageGallery";
import Improvements from "./Improvements/Improvements";
import OrdersChart from "./OrdersChart";
import QualityMetrics from "./QualityMetrics/QualityMetrics";
import UpdateSkuSection from "./UpdateSku";
import VariationsSelector from "./Variations";
import VisitsChart from "./VisitsChart";

interface AnuncioDetailsProps {
  anuncioId: string;
}

/**
 * Componente principal que integra todos os componentes de detalhe do anúncio
 */
export default function AnuncioDetails({ anuncioId }: AnuncioDetailsProps) {
  const { data, isLoading, error } = useAnuncioDetails(anuncioId);
  const { data: quotaData } = useAdsReprocessQuota();
  const reprocessMutation = useReprocessAds();
  const { openModal, closeModal } = useModal();

  const anuncio = useMemo(() => {
    return data?.data;
  }, [data]);

  const remainingQuota = quotaData?.success ? quotaData.data?.remaining ?? 0 : 0;

  if (isLoading) {
    return <AnuncioDetailsSkeleton />;
  }

  if (error) {
    return (
      <BeergamAlert severity="error">
        {error instanceof Error
          ? error.message
          : "Erro ao carregar detalhes do anúncio"}
      </BeergamAlert>
    );
  }

  if (!anuncio) {
    return <BeergamAlert severity="warning">Anúncio não encontrado</BeergamAlert>;
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(148, 163, 184, 0.25)",
          backgroundColor: "rgba(148, 163, 184, 0.08)",
        }}
      >
        <div>
          <p className="text-sm font-semibold text-beergam-typography-primary">
            Reprocessamento
          </p>
          <p className="text-xs text-beergam-typography-secondary">
            Cota disponível: {remainingQuota} (mês atual)
          </p>
        </div>

        <BeergamButton
          title={reprocessMutation.isPending ? "Reprocessando..." : "Reprocessar anúncio"}
          mainColor="beergam-orange"
          animationStyle="slider"
          loading={reprocessMutation.isPending}
          disabled={reprocessMutation.isPending || remainingQuota <= 0}
          onClick={() => {
            if (remainingQuota <= 0) {
              return;
            }
            const options: ModalOptions = {
              title: "Confirmar reprocessamento do anúncio",
            };

            openModal(
              <AlertModal
                type="info"
                confirmText="Reprocessar"
                onClose={closeModal}
                onConfirm={() => {
                  reprocessMutation.mutate([anuncioId]);
                }}
              >
                <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                  Deseja reprocessar o anúncio <span className="font-mono">#{anuncioId}</span>?
                </h3>
                <p className="text-sm text-beergam-typography-secondary mb-2">
                  Isso irá buscar novamente os dados no Mercado Livre e atualizar o anúncio aqui no Beergam.
                </p>
                <p className="text-xs text-beergam-typography-secondary">
                  Cota mensal: <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                  <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                  <strong>{remainingQuota}</strong>.
                </p>
              </AlertModal>,
              options
            );
          }}
        />
      </Box>

      {/* Seção de Update SKU */}
      <UpdateSkuSection anuncio={anuncio} />

      {/* Primeira linha */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            display: "flex",
            flexDirection: "column",
            minWidth: 0, // Permite que o flexbox funcione corretamente
            overflow: "hidden", // Previne overflow do container pai
          }}
        >
          <ImageGallery anuncio={anuncio} />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} sx={{ height: "100%" }}>
            <AnuncioInfo anuncio={anuncio} />
          </Stack>
        </Box>
      </Box>

      {anuncio.variations && anuncio.variations.length > 0 && (
        <VariationsSelector anuncio={anuncio} />
      )}

      {/* Métricas de qualidade */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
          >
            <QualityMetrics anuncio={anuncio} />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
          >
            <Improvements anuncio={anuncio} />
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
          }}
        >
          <FinancialMetrics anuncio={anuncio} />
        </Box>
      </Box>

      {/* Gráfico de visitas */}
      {anuncio.visits && anuncio.visits.length > 0 && (
        <VisitsChart visits={anuncio.visits} />
      )}

      {/* Gráfico de vendas */}
      <OrdersChart anuncioId={anuncioId} days={30} />
    </Stack>
  );
}

import { useMemo } from "react";
import { Box, Stack, Alert } from "@mui/material";
import { useAnuncioDetails } from "../../hooks";
import AnuncioInfo from "./AnuncioInfo/AnuncioInfo";
import ImageGallery from "./ImageGallery/ImageGallery";
import FinancialMetrics from "./FinancialMetrics/FinancialMetrics";
import Improvements from "./Improvements/Improvements";
import QualityMetrics from "./QualityMetrics/QualityMetrics";
import VariationsSelector from "./Variations";
import UpdateSkuSection from "./UpdateSku";
import VisitsChart from "./VisitsChart";
import OrdersChart from "./OrdersChart";
import AnuncioDetailsSkeleton from "./AnuncioDetailsSkeleton";

interface AnuncioDetailsProps {
  anuncioId: string;
}

/**
 * Componente principal que integra todos os componentes de detalhe do anúncio
 * Seguindo Single Responsibility Principle e Dependency Inversion Principle
 */
export default function AnuncioDetails({ anuncioId }: AnuncioDetailsProps) {
  const { data, isLoading, error } = useAnuncioDetails(anuncioId);

  const anuncio = useMemo(() => {
    return data?.data;
  }, [data]);

  if (isLoading) {
    return <AnuncioDetailsSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : "Erro ao carregar detalhes do anúncio"}
      </Alert>
    );
  }

  if (!anuncio) {
    return (
      <Alert severity="warning">
        Anúncio não encontrado
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
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

      {(anuncio.variations && anuncio.variations.length > 0) && (
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


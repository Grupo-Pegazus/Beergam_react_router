import { useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useChangeAdStatus } from "../../../hooks";
import type { AnuncioDetails } from "../../../typings";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useQueryClient } from "@tanstack/react-query";
import AnuncioFeatures from "../AnuncioFeatures/AnuncioFeatures";
import AnuncioStatusToggle from "../../AnuncioStatusToggle";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface AnuncioInfoProps {
  anuncio: AnuncioDetails;
}

export default function AnuncioInfo({ anuncio }: AnuncioInfoProps) {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);
  const changeStatusMutation = useChangeAdStatus();

  const formattedDate = useMemo(() => {
    return dayjs(anuncio.date_created_ad).locale("pt-br").format("DD [de] MMM [de] YYYY");
  }, [anuncio.date_created_ad]);

  const adTypeLabel = useMemo(() => {
    const types: Record<string, string> = {
      classic: "Clássico",
      premium: "Premium",
    };
    return types[anuncio.ad_type] || anuncio.ad_type;
  }, [anuncio.ad_type]);

  const isActive = anuncio.status === "active";

  const handleToggleStatus = () => {
    const nextStatus = isActive ? "paused" : "active";
    setIsMutating(true);
    changeStatusMutation.mutate(
      { adId: anuncio.mlb, status: nextStatus },
      {
        onSettled: () => {
          setIsMutating(false);
          queryClient.invalidateQueries({ queryKey: ["anuncios", "details", anuncio.mlb] });
        },
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={2}>
        {/* Título do produto */}
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
          {anuncio.name}
        </Typography>

        {/* ID e SKU */}
        <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {anuncio.mlb}
            </Typography>
          </Box>
          {anuncio.variations && anuncio.variations.length === 0 && (
            <Box>
                <Typography variant="caption" color="text.secondary">
                SKU:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {anuncio.sku || "SKU-None"}
                </Typography>
            </Box>
          )}
        </Stack>

        {/* Tipo de anúncio, status e idade */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
          <Chip
            label={adTypeLabel}
            size="small"
            sx={{
              bgcolor: "var(--color-beergam-orange-light)",
              color: "var(--color-beergam-orange-dark)",
              fontWeight: 600,
            }}
            icon={
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "var(--color-beergam-orange)",
                }}
              />
            }
          />

          <Typography variant="body2" color="text.secondary">
            Criado há {anuncio.active_days} dias ativo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Stack>

        <AnuncioFeatures anuncio={anuncio} />

        {/* Métricas de performance */}
        <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Visitas totais
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block", mt: 0.5 }}>
              Últimos 150 dias
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {anuncio.visits_last_150_days ?? anuncio.geral_visits}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Vendas Totais
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {anuncio.sold_quantity}
            </Typography>
          </Box>
        </Stack>

        {/* Preço e Estoque */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Preço
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-beergam-orange)" }}>
              R$ {parseFloat(anuncio.price).toFixed(2).replace(".", ",")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Estoque
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {anuncio.stock}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center">
          {/* Switch de Ativar/Pausar */}
          <AnuncioStatusToggle
            status={anuncio.status}
            subStatus={anuncio.sub_status}
            isActive={isActive}
            isMutating={isMutating}
            onToggle={handleToggleStatus}
            showStatusMessage={true}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center">
            <Box>
                <BeergamButton
                  title="Ver no Mercado Livre"
                  mainColor="beergam-blue-primary"
                  animationStyle="slider"
                  onClick={() => window.open(anuncio.link, "_blank")}
                />
            </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}


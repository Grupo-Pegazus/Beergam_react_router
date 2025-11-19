import { useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { useChangeAdStatus } from "../../../hooks";
import type { AnuncioDetails } from "../../../typings";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useQueryClient } from "@tanstack/react-query";
import AnuncioFeatures from "../AnuncioFeatures/AnuncioFeatures";
import Svg from "~/src/assets/svgs/_index";
import { Button } from "@mui/material";

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
  const isClosed = anuncio.status === "closed";

  const handleToggleStatus = () => {
    if (isClosed) return;
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
              Visitas totais (últimos 150 dias)
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
          {!isClosed && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                color={isActive ? "text.secondary" : "text.disabled"}
                sx={{ fontSize: "0.7rem" }}
              >
                Pausado
              </Typography>
              <Box sx={{ position: "relative" }}>
                <Switch
                  checked={isActive}
                  onChange={handleToggleStatus}
                  disabled={isMutating}
                  sx={{
                    "& .MuiSwitch-thumb": {
                      boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.25)",
                    },
                  }}
                />
                {isMutating && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: "2px solid",
                        borderColor: "var(--color-beergam-orange)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Typography
                variant="caption"
                color={isActive ? "text.primary" : "text.disabled"}
                sx={{ fontSize: "0.7rem", fontWeight: 600 }}
              >
                Ativo
              </Typography>
            </Box>
          )}
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center">
            <Box>
                <Button variant="contained" color="primary" onClick={() => window.open(anuncio.link, "_blank")} startIcon={<Svg.globe tailWindClasses="h-5 w-5" />}>
                    Ver no Mercado Livre
                </Button>
            </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}


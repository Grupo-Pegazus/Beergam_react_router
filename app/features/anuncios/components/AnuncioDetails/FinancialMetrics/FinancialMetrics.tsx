import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
import type { AnuncioDetails } from "../../../typings";

interface FinancialMetricsProps {
  anuncio: AnuncioDetails;
}

/**
 * Componente responsável por exibir as métricas financeiras do anúncio
 */
export default function FinancialMetrics({ anuncio }: FinancialMetricsProps) {
  const totalProfit = anuncio.total_profit ?? 0;
  const averageProfitPerSale = anuncio.average_profit_per_sale ?? 0;
  const commission =
    anuncio.commission?.value ?? anuncio.costs?.commission?.value ?? 0;
  const commissionPercentage =
    anuncio.commission?.percentage ??
    anuncio.costs?.commission?.percentage ??
    0;
  const taxes = anuncio.costs?.taxes ?? 0;
  const purchasePrice = anuncio.costs?.purchase_price ?? 0;
  const shipping = anuncio.costs?.shipping ?? 0;

  const formatCurrency = (value: number): string => {
    return `R$ ${Math.abs(value).toFixed(2).replace(".", ",")}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2).replace(".", ",")}%`;
  };

  return (
    <CensorshipWrapper censorshipKey="anuncios_list_details_financial">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={3}>
          {/* Título */}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Visão Geral de Performance Financeira
          </Typography>

          {/* Lucro total e médio */}
          <Stack direction="row" spacing={4} flexWrap="wrap" gap={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Lucro total do anúncio
              </Typography>
              <TextCensored
                className="flex!"
                censorshipKey="anuncios_list_details_financial"
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "var(--color-beergam-green-primary)",
                  }}
                >
                  {formatCurrency(totalProfit)}
                </Typography>
              </TextCensored>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Lucro médio por venda
              </Typography>
              <TextCensored
                className="flex!"
                censorshipKey="anuncios_list_details_financial"
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "var(--color-beergam-green-primary)",
                  }}
                >
                  {formatCurrency(averageProfitPerSale)}
                </Typography>
              </TextCensored>
            </Box>
          </Stack>

          {/* Breakdown de custos */}
          <Stack spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Custos por unidade:
            </Typography>
            <Stack spacing={1.5}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Comissão da plataforma">
                    <Typography variant="body2">Taxa</Typography>
                  </Tooltip>
                </Box>
                <TextCensored
                  className="flex!"
                  censorshipKey="anuncios_list_details_financial"
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "error.main" }}
                  >
                    -{formatCurrency(commission)}
                    {commissionPercentage > 0 &&
                      ` (${formatPercentage(commissionPercentage)})`}
                  </Typography>
                </TextCensored>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Impostos sobre a venda">
                    <Typography variant="body2">Impostos</Typography>
                  </Tooltip>
                </Box>
                <TextCensored
                  className="flex!"
                  censorshipKey="anuncios_list_details_financial"
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "error.main" }}
                  >
                    -{formatCurrency(taxes)}
                  </Typography>
                </TextCensored>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Custo de compra do produto">
                    <Typography variant="body2">Custo</Typography>
                  </Tooltip>
                </Box>
                <TextCensored
                  className="flex!"
                  censorshipKey="anuncios_list_details_financial"
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "error.main" }}
                  >
                    -{formatCurrency(purchasePrice)}
                  </Typography>
                </TextCensored>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Custo de frete">
                    <Typography variant="body2">Frete</Typography>
                  </Tooltip>
                </Box>
                <TextCensored
                  className="flex!"
                  censorshipKey="anuncios_list_details_financial"
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "error.main" }}
                  >
                    -{formatCurrency(shipping)}
                  </Typography>
                </TextCensored>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </CensorshipWrapper>
  );
}

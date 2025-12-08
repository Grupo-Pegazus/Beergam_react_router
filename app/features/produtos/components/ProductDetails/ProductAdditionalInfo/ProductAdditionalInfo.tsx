import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import type { ProductDetails } from "../../../typings";

interface ProductAdditionalInfoProps {
  product: ProductDetails;
}

export default function ProductAdditionalInfo({ product }: ProductAdditionalInfoProps) {
  const hasFiscalInfo = product.ncm || product.cest || product.ean || product.icms !== undefined || product.tax_replacement !== undefined;
  const hasDimensions = product.width || product.height || product.depth;
  const hasWeight = product.brute_weight || product.net_weight;
  const hasOtherInfo = product.brand || product.internal_code || product.unity_type || product.product_origin || product.marketing_type;

  if (!hasFiscalInfo && !hasDimensions && !hasWeight && !hasOtherInfo) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Informações Adicionais
        </Typography>

        <Grid container spacing={3}>
          {/* Informações Fiscais */}
          {hasFiscalInfo && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary" }}>
                  Informações Fiscais
                </Typography>
                <Stack spacing={1.5}>
                  {product.ncm && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        NCM:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {product.ncm}
                      </Typography>
                    </Box>
                  )}
                  {product.cest && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        CEST:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {product.cest}
                      </Typography>
                    </Box>
                  )}
                  {product.ean && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        EAN:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {product.ean}
                      </Typography>
                    </Box>
                  )}
                  {product.icms !== undefined && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        ICMS:
                      </Typography>
                      <Chip
                        label={product.icms ? "Sim" : "Não"}
                        size="small"
                        sx={{
                          bgcolor: product.icms ? "#d1fae5" : "#fee2e2",
                          color: product.icms ? "#065f46" : "#991b1b",
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>
                  )}
                  {product.tax_replacement !== undefined && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Substituição Tributária:
                      </Typography>
                      <Chip
                        label={product.tax_replacement ? "Sim" : "Não"}
                        size="small"
                        sx={{
                          bgcolor: product.tax_replacement ? "#d1fae5" : "#fee2e2",
                          color: product.tax_replacement ? "#065f46" : "#991b1b",
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}

          {/* Dimensões e Peso */}
          {(hasDimensions || hasWeight) && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary" }}>
                  Dimensões e Peso
                </Typography>
                <Stack spacing={1.5}>
                  {product.width && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Largura:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.width} cm
                      </Typography>
                    </Box>
                  )}
                  {product.height && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Altura:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.height} cm
                      </Typography>
                    </Box>
                  )}
                  {product.depth && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Profundidade:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.depth} cm
                      </Typography>
                    </Box>
                  )}
                  {product.brute_weight && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Peso Bruto:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.brute_weight} kg
                      </Typography>
                    </Box>
                  )}
                  {product.net_weight && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Peso Líquido:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.net_weight} kg
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}

          {/* Outras Informações */}
          {hasOtherInfo && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary" }}>
                  Outras Informações
                </Typography>
                <Stack spacing={1.5}>
                  {product.brand && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Marca:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.brand}
                      </Typography>
                    </Box>
                  )}
                  {product.internal_code && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Código Interno:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {product.internal_code}
                      </Typography>
                    </Box>
                  )}
                  {product.unity_type && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tipo de Unidade:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.unity_type}
                      </Typography>
                    </Box>
                  )}
                  {product.product_origin && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Origem do Produto:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.product_origin}
                      </Typography>
                    </Box>
                  )}
                  {product.marketing_type && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tipo de Marketing:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.marketing_type}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}

          {/* Custos Adicionais */}
          {(product.extra_cost || product.packaging_cost) && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.secondary" }}>
                  Custos Adicionais
                </Typography>
                <Stack spacing={1.5}>
                  {product.extra_cost && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Custo Extra:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {parseFloat(product.extra_cost).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Typography>
                    </Box>
                  )}
                  {product.packaging_cost && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Custo de Embalagem:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {parseFloat(product.packaging_cost).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </Stack>
    </Paper>
  );
}


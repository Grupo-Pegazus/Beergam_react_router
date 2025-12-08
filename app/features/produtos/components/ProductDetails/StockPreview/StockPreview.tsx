import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router";
import type { ProductDetails } from "../../../typings";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface StockPreviewProps {
  product: ProductDetails;
}

export default function StockPreview({ product }: StockPreviewProps) {
  const hasVariations = product.variations && product.variations.length > 0;

  const getStockStatus = (quantity: number, minimum: number) => {
    if (quantity === 0) {
      return { label: "Zerado", color: "error" as const, bgColor: "#fee2e2", textColor: "#991b1b" };
    }
    if (quantity <= minimum) {
      return { label: "Baixo", color: "warning" as const, bgColor: "#fef3c7", textColor: "#92400e" };
    }
    return { label: "OK", color: "success" as const, bgColor: "#d1fae5", textColor: "#065f46" };
  };

  // Se tem variações, mostra resumo das variações
  if (hasVariations) {
    const totalStock = product.variations.reduce((sum, v) => sum + v.available_quantity, 0);
    const variationsWithStock = product.variations.filter((v) => v.stock_handling);

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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Prévia de Estoque
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total: {totalStock.toLocaleString("pt-BR")} unidades em {variationsWithStock.length} variação(ões)
              </Typography>
            </Box>
            <BeergamButton
              title="Ver Controle de Estoque"
              mainColor="beergam-blue-primary"
              animationStyle="slider"
              link={`/interno/produtos/estoque/${product.product_id}`}
              icon="box"
            />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Variação</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Estoque Disponível
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Mínimo
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Máximo
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variationsWithStock.map((variation) => {
                  const stockStatus = getStockStatus(variation.available_quantity, variation.minimum_quantity);
                  return (
                    <TableRow key={variation.product_variation_id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {variation.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                          {variation.sku || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {variation.available_quantity.toLocaleString("pt-BR")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {variation.minimum_quantity.toLocaleString("pt-BR")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {variation.maximum_quantity.toLocaleString("pt-BR")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={stockStatus.label}
                          size="small"
                          sx={{
                            bgcolor: stockStatus.bgColor,
                            color: stockStatus.textColor,
                            fontWeight: 600,
                            height: 24,
                          }}
                          icon={
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: stockStatus.textColor,
                              }}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          to={`/interno/produtos/estoque/${product.product_id}?variation=${variation.product_variation_id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Chip
                            label="Estoque"
                            size="small"
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              fontWeight: 600,
                              height: 24,
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                            }}
                          />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    );
  }

  // Se não tem variações, mostra estoque do produto pai
  const stockStatus = getStockStatus(product.available_quantity, product.minimum_quantity);

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Prévia de Estoque
          </Typography>
          <BeergamButton
            title="Ver Controle de Estoque"
            mainColor="beergam-blue-primary"
            animationStyle="slider"
            link={`/interno/produtos/estoque/${product.product_id}`}
            icon="box"
          />
        </Box>

        <Stack direction="row" spacing={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Quantidade Disponível
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {product.available_quantity.toLocaleString("pt-BR")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Quantidade Mínima
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {product.minimum_quantity.toLocaleString("pt-BR")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Quantidade Máxima
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {product.maximum_quantity.toLocaleString("pt-BR")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Status do Estoque
            </Typography>
            <Chip
              label={stockStatus.label}
              size="small"
              sx={{
                bgcolor: stockStatus.bgColor,
                color: stockStatus.textColor,
                fontWeight: 600,
                height: 24,
              }}
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: stockStatus.textColor,
                  }}
                />
              }
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}


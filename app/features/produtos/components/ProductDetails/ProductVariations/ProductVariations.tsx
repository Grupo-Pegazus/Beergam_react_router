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
import type { ProductDetails } from "../../../typings";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { Link } from "react-router";

interface ProductVariationsProps {
  product: ProductDetails;
}

export default function ProductVariations({ product }: ProductVariationsProps) {
  if (!product.variations || product.variations.length === 0) {
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
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Variações ({product.variations.length})
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Estoque
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Preço de Custo
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Preço de Venda
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
              {product.variations.map((variation) => {
                const isActive = variation.status.toLowerCase().trim() === "ativo";
                const stockStatus =
                  variation.available_quantity === 0
                    ? { label: "Zerado", color: "error" as const, bgColor: "#fee2e2", textColor: "#991b1b" }
                    : variation.available_quantity <= variation.minimum_quantity
                      ? { label: "Baixo", color: "warning" as const, bgColor: "#fef3c7", textColor: "#92400e" }
                      : { label: "OK", color: "success" as const, bgColor: "#d1fae5", textColor: "#065f46" };

                return (
                  <TableRow key={variation.product_variation_id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {variation.title}
                        </Typography>
                        {variation.description && (
                          <Typography variant="caption" color="text.secondary">
                            {variation.description}
                          </Typography>
                        )}
                        {variation.attributes && variation.attributes.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap">
                            {variation.attributes.map((attr, index) => (
                              <Chip
                                key={index}
                                label={`${attr.name}: ${attr.value.join(", ")}`}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.6rem",
                                  fontWeight: 500,
                                  backgroundColor: "#e0e7ff",
                                  color: "#4338ca",
                                  "& .MuiChip-label": {
                                    px: 0.75,
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {variation.sku || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {variation.available_quantity.toLocaleString("pt-BR")}
                        </Typography>
                        <Chip
                          label={stockStatus.label}
                          size="small"
                          sx={{
                            bgcolor: stockStatus.bgColor,
                            color: stockStatus.textColor,
                            fontWeight: 600,
                            height: 18,
                            fontSize: "0.6rem",
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(variation.price_cost)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-beergam-orange)" }}>
                        {formatCurrency(variation.price_sale)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={variation.status}
                        size="small"
                        sx={{
                          bgcolor: isActive ? "#d1fae5" : "#fee2e2",
                          color: isActive ? "#065f46" : "#991b1b",
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {variation.stock_handling && (
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
                      )}
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


import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { Link } from "react-router";
import type { StockDashboardResponse } from "../../typings";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface RecentMovementsListProps {
  movements: StockDashboardResponse["recent_movements"];
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getModificationTypeColor(type: string) {
  return type === "Entrada"
    ? { bg: "#d1fae5", color: "#065f46" }
    : { bg: "#fee2e2", color: "#991b1b" };
}

export default function RecentMovementsList({
  movements,
}: RecentMovementsListProps) {
  if (movements.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma movimentação recente encontrada.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Data/Hora</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Produto/Variação</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Quantidade
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Custo Unitário
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Valor Total
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Motivo</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement) => {
            const typeColor = getModificationTypeColor(movement.modification_type);
            const productLink = movement.product?.product_id
              ? `/interno/produtos/estoque/${movement.product.product_id}`
              : movement.variation?.product_id
              ? `/interno/produtos/estoque/${movement.variation.product_id}?variation=${movement.variation.variation_id}`
              : null;

            return (
              <TableRow key={movement.id} hover>
                <TableCell>{formatDate(movement.created_at)}</TableCell>
                <TableCell>
                  {movement.variation ? (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {movement.variation.title}
                      </Typography>
                      {movement.variation.sku && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          SKU: {movement.variation.sku}
                        </Typography>
                      )}
                      {movement.product && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          Produto: {movement.product.title}
                        </Typography>
                      )}
                    </Box>
                  ) : movement.product ? (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {movement.product.title}
                      </Typography>
                      {movement.product.sku && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          SKU: {movement.product.sku}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={movement.modification_type}
                    size="small"
                    sx={{
                      backgroundColor: typeColor.bg,
                      color: typeColor.color,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  {formatNumber(movement.quantity)}
                </TableCell>
                <TableCell align="right">
                  {movement.unity_cost !== null
                    ? formatCurrency(movement.unity_cost.toString())
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  {movement.total_value !== null
                    ? formatCurrency(movement.total_value.toString())
                    : "—"}
                </TableCell>
                <TableCell>
                  <Tooltip title={movement.reason}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {movement.reason}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {productLink ? (
                    <Link to={productLink}>
                      <IconButton size="small">
                        <Svg.chevron tailWindClasses="h-4 w-4 rotate-270" />
                      </IconButton>
                    </Link>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


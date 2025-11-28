import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { useState, Fragment } from "react";
import type { StockTrackingEntry, StockTrackingResponse } from "../../typings";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import Svg from "~/src/assets/svgs/_index";

interface StockTrackingTableProps {
  data: StockTrackingResponse;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasVariations?: boolean;
}

export default function StockTrackingTable({
  data,
  onPageChange,
  onPageSizeChange,
  hasVariations = false,
}: StockTrackingTableProps) {
  const { stock_tracking } = data;
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleToggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const getModificationTypeColor = (type: string) => {
    return type === "Entrada"
      ? { bg: "#d1fae5", color: "#065f46" }
      : { bg: "#fee2e2", color: "#991b1b" };
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onPageSizeChange(parseInt(event.target.value, 10));
  };

  if (stock_tracking.items.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma movimentação registrada ainda.
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
            {hasVariations && (
              <TableCell sx={{ fontWeight: 600 }}>Variação</TableCell>
            )}
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
          {stock_tracking.items.map((entry: StockTrackingEntry) => {
            const isExpanded = expandedRows.has(entry.id);
            const typeColor = getModificationTypeColor(entry.modification_type);

            const colSpan = hasVariations ? 8 : 7;
            
            const variationId = entry.meta?.variation_id ?? null;
            
            const unityCostValue = entry.unity_cost 
              ? (typeof entry.unity_cost === 'object' && entry.unity_cost !== null 
                  ? entry.unity_cost.parsedValue 
                  : parseFloat(String(entry.unity_cost)) || 0)
              : null;
            
            const totalValueValue = entry.total_value
              ? (typeof entry.total_value === 'object' && entry.total_value !== null
                  ? entry.total_value.parsedValue
                  : parseFloat(String(entry.total_value)) || 0)
              : null;
            
            return (
              <Fragment key={entry.id}>
                <TableRow hover>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                  {hasVariations && (
                    <TableCell>
                      {variationId ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Variação #{variationId}
                          </Typography>
                          {entry.meta?.variation_sku && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              SKU: {entry.meta?.variation_sku}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Produto Principal
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={entry.modification_type}
                      size="small"
                      sx={{
                        backgroundColor: typeColor.bg,
                        color: typeColor.color,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {formatNumber(entry.quantity)}
                  </TableCell>
                  <TableCell align="right">
                    {unityCostValue !== null
                      ? formatCurrency(unityCostValue.toString())
                      : "—"}
                  </TableCell>
                  <TableCell align="right">
                    {totalValueValue !== null
                      ? formatCurrency(totalValueValue.toString())
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={entry.reason}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.reason}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {entry.description && (
                      <IconButton
                        size="small"
                        onClick={() => handleToggleRow(entry.id)}
                      >
                        <Svg.chevron
                          tailWindClasses={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && entry.description && (
                  <TableRow>
                    <TableCell colSpan={colSpan} sx={{ bgcolor: "grey.50" }}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Descrição:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.description}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={stock_tracking.total}
            page={stock_tracking.page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={stock_tracking.page_size}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </TableContainer>
  );
}


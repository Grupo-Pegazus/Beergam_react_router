import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

// Tipo genérico para uma entrada de movimentação
export interface StockMovementEntry {
  id: number;
  quantity: number;
  modification_type: string;
  reason: string;
  unity_cost: number | { parsedValue: number } | null;
  total_value: number | { parsedValue: number } | null;
  description?: string | null;
  created_at: string | null;
  // Para StockTrackingEntry
  meta?: {
    variation_id?: string | null;
    variation_sku?: string | null;
    product_id?: string;
  } | null;
  // Para RecentMovement
  product?: {
    product_id: string;
    title: string;
    sku: string | null;
  } | null;
  variation?: {
    variation_id: string;
    product_id: string | null;
    title: string;
    sku: string | null;
  } | null;
}

interface StockMovementsTableProps {
  movements: StockMovementEntry[];
  // Paginação (opcional)
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  // Configurações de colunas
  showVariationColumn?: boolean;
  showProductColumn?: boolean;
  emptyMessage?: string;
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

export default function StockMovementsTable({
  movements,
  pagination,
  showVariationColumn = false,
  showProductColumn = false,
  emptyMessage = "Nenhuma movimentação encontrada.",
  syncPageWithUrl = false,
}: StockMovementsTableProps) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
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

  const getUnityCostValue = (
    unityCost: number | { parsedValue: number } | null
  ) => {
    if (!unityCost) return null;
    if (
      typeof unityCost === "object" &&
      unityCost !== null &&
      "parsedValue" in unityCost
    ) {
      return unityCost.parsedValue;
    }
    return typeof unityCost === "number"
      ? unityCost
      : parseFloat(String(unityCost)) || null;
  };

  const getTotalValue = (
    totalValue: number | { parsedValue: number } | null
  ) => {
    if (!totalValue) return null;
    if (
      typeof totalValue === "object" &&
      totalValue !== null &&
      "parsedValue" in totalValue
    ) {
      return totalValue.parsedValue;
    }
    return typeof totalValue === "number"
      ? totalValue
      : parseFloat(String(totalValue)) || null;
  };

  const getProductLink = (movement: StockMovementEntry): string | null => {
    // Para movimentações recentes
    if (movement.product?.product_id) {
      return `/interno/produtos/estoque/${movement.product.product_id}`;
    }
    if (movement.variation?.product_id) {
      const variationId = movement.variation.variation_id;
      return `/interno/produtos/estoque/${movement.variation.product_id}?variation=${variationId}`;
    }
    // Para histórico detalhado (já estamos na página do produto)
    return null;
  };

  if (movements.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  // Calcular colSpan para linha expandida
  const colSpan =
    5 + (showVariationColumn ? 1 : 0) + (showProductColumn ? 1 : 0) + 1; // +1 para coluna de ações

  const totalPages =
    pagination && pagination.page_size > 0
      ? Math.max(1, Math.ceil(pagination.total / pagination.page_size))
      : 1;

  return (
    <>
      {/* Layout Desktop - Tabela */}
      <TableContainer
        component={Paper}
        variant="outlined"
        className="hidden md:block"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}>
                Data/Hora
              </TableCell>
              {showVariationColumn && (
                <TableCell
                  sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}
                >
                  Variação
                </TableCell>
              )}
              {showProductColumn && (
                <TableCell
                  sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}
                >
                  Produto/Variação
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}>
                Tipo
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}
              >
                Quantidade
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}
              >
                Custo Unitário
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}
              >
                Valor Total
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: { md: "0.875rem" } }}>
                Motivo
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  width: 50,
                  fontSize: { md: "0.875rem" },
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => {
              const isExpanded = expandedRows.has(movement.id);
              const typeColor = getModificationTypeColor(
                movement.modification_type
              );
              const unityCostValue = getUnityCostValue(movement.unity_cost);
              const totalValueValue = getTotalValue(movement.total_value);
              const productLink = getProductLink(movement);

              return (
                <Fragment key={movement.id}>
                  <TableRow hover>
                    <TableCell sx={{ fontSize: { md: "0.875rem" } }}>
                      {formatDate(movement.created_at)}
                    </TableCell>
                    {showVariationColumn && (
                      <TableCell sx={{ fontSize: { md: "0.875rem" } }}>
                        {(() => {
                          const meta = movement.meta as {
                            product_variation_id?: string | number | null;
                            variation_id?: string | null;
                            sku?: string | null;
                            variation_sku?: string | null;
                          } | null;
                          const variationId = meta?.product_variation_id
                            ? String(meta.product_variation_id)
                            : meta?.variation_id
                              ? String(meta.variation_id)
                              : null;

                          if (variationId) {
                            return (
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: { md: "0.875rem" },
                                  }}
                                >
                                  Variação #{variationId}
                                </Typography>
                                {(meta?.variation_sku || meta?.sku) && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "block",
                                      fontSize: { md: "0.75rem" },
                                    }}
                                  >
                                    SKU: {meta?.variation_sku || meta?.sku}
                                  </Typography>
                                )}
                              </Box>
                            );
                          }
                          return (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { md: "0.875rem" } }}
                            >
                              Produto Principal
                            </Typography>
                          );
                        })()}
                      </TableCell>
                    )}
                    {showProductColumn && (
                      <TableCell sx={{ fontSize: { md: "0.875rem" } }}>
                        {movement.variation ? (
                          <Box>
                            <Typography
                              className="text-beergam-typography-tertiary!"
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: { md: "0.875rem" },
                              }}
                            >
                              {movement.variation.title}
                            </Typography>
                            {movement.variation.sku && (
                              <Typography
                                variant="caption"
                                className="text-beergam-typography-secondary!"
                                sx={{
                                  display: "block",
                                  fontSize: { md: "0.75rem" },
                                }}
                              >
                                SKU: {movement.variation.sku}
                              </Typography>
                            )}
                            {movement.product && (
                              <Typography
                                variant="caption"
                                className="text-beergam-typography-secondary!"
                                sx={{
                                  display: "block",
                                  fontSize: { md: "0.75rem" },
                                }}
                              >
                                Produto: {movement.product.title}
                              </Typography>
                            )}
                          </Box>
                        ) : movement.product ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: { md: "0.875rem" },
                              }}
                            >
                              {movement.product.title}
                            </Typography>
                            {movement.product.sku && (
                              <Typography
                                variant="caption"
                                className="text-beergam-typography-secondary!"
                                sx={{
                                  display: "block",
                                  fontSize: { md: "0.75rem" },
                                }}
                              >
                                SKU: {movement.product.sku}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            className="text-beergam-typography-secondary!"
                            sx={{ fontSize: { md: "0.875rem" } }}
                          >
                            —
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: { md: "0.875rem" } }}>
                      <Chip
                        label={movement.modification_type}
                        size="small"
                        sx={{
                          backgroundColor: typeColor.bg,
                          color: typeColor.color,
                          fontWeight: 600,
                          fontSize: { md: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: { md: "0.875rem" } }}
                    >
                      {formatNumber(movement.quantity)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: { md: "0.875rem" } }}
                    >
                      {unityCostValue !== null
                        ? formatCurrency(unityCostValue.toString())
                        : "—"}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: { md: "0.875rem" } }}
                    >
                      {totalValueValue !== null
                        ? formatCurrency(totalValueValue.toString())
                        : "—"}
                    </TableCell>
                    <TableCell sx={{ fontSize: { md: "0.875rem" } }}>
                      <Tooltip title={movement.reason}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: { md: "0.875rem" },
                          }}
                        >
                          {movement.reason}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {movement.description ? (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRow(movement.id)}
                        >
                          <Svg.chevron
                            tailWindClasses={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </IconButton>
                      ) : productLink ? (
                        <Link to={productLink}>
                          <IconButton size="small">
                            <Svg.chevron tailWindClasses="h-4 w-4 rotate-270" />
                          </IconButton>
                        </Link>
                      ) : null}
                    </TableCell>
                  </TableRow>
                  {isExpanded && movement.description && (
                    <TableRow>
                      <TableCell
                        colSpan={colSpan}
                        className="bg-beergam-section-background!"
                      >
                        <Box sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontSize: { md: "0.875rem" } }}
                          >
                            Descrição:
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-xs text-beergam-typography-tertiary!"
                            sx={{ fontSize: { md: "0.875rem" } }}
                          >
                            {movement.description}
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
      </TableContainer>

      {/* Layout Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {movements.map((movement) => {
          const isExpanded = expandedRows.has(movement.id);
          const typeColor = getModificationTypeColor(
            movement.modification_type
          );
          const unityCostValue = getUnityCostValue(movement.unity_cost);
          const totalValueValue = getTotalValue(movement.total_value);
          const productLink = getProductLink(movement);

          return (
            <Paper key={movement.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Header com Data e Tipo */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      className="text-xs text-beergam-typography-tertiary!"
                    >
                      {formatDate(movement.created_at)}
                    </Typography>
                    {showVariationColumn &&
                      (() => {
                        const meta = movement.meta as {
                          product_variation_id?: string | number | null;
                          variation_id?: string | null;
                          sku?: string | null;
                          variation_sku?: string | null;
                        } | null;
                        const variationId = meta?.product_variation_id
                          ? String(meta.product_variation_id)
                          : meta?.variation_id
                            ? String(meta.variation_id)
                            : null;

                        return variationId ? (
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              Variação #{variationId}
                            </Typography>
                            {(meta?.variation_sku || meta?.sku) && (
                              <Typography
                                variant="caption"
                                className="text-xs text-beergam-typography-tertiary!"
                              >
                                SKU: {meta?.variation_sku || meta?.sku}
                              </Typography>
                            )}
                          </Box>
                        ) : null;
                      })()}
                    {showProductColumn && (
                      <Box sx={{ mt: 0.5 }}>
                        {movement.variation ? (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              {movement.variation.title}
                            </Typography>
                            {movement.variation.sku && (
                              <Typography
                                variant="caption"
                                className="text-xs text-beergam-typography-tertiary!"
                              >
                                SKU: {movement.variation.sku}
                              </Typography>
                            )}
                            {movement.product && (
                              <Typography
                                variant="caption"
                                className="text-xs text-beergam-typography-tertiary!"
                              >
                                Produto: {movement.product.title}
                              </Typography>
                            )}
                          </>
                        ) : movement.product ? (
                          <>
                            <Typography
                              className="text-beergam-typography-tertiary!"
                              variant="body2"
                              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                            >
                              {movement.product.title}
                            </Typography>
                            {movement.product.sku && (
                              <Typography
                                variant="caption"
                                className="text-xs text-beergam-typography-tertiary!"
                              >
                                SKU: {movement.product.sku}
                              </Typography>
                            )}
                          </>
                        ) : null}
                      </Box>
                    )}
                  </Box>
                  <Chip
                    label={movement.modification_type}
                    size="small"
                    sx={{
                      backgroundColor: typeColor.bg,
                      color: typeColor.color,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: 22,
                    }}
                  />
                </Box>

                {/* Informações principais */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      className="text-xs text-beergam-typography-tertiary!"
                    >
                      Quantidade:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      className="text-sm"
                    >
                      {formatNumber(movement.quantity)}
                    </Typography>
                  </Box>
                  {unityCostValue !== null && (
                    <Box>
                      <Typography
                        variant="caption"
                        className="text-xs text-beergam-typography-tertiary!"
                      >
                        Custo Unitário:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        className="text-sm"
                      >
                        {formatCurrency(unityCostValue.toString())}
                      </Typography>
                    </Box>
                  )}
                  {totalValueValue !== null && (
                    <Box>
                      <Typography
                        variant="caption"
                        className="text-xs text-beergam-typography-tertiary!"
                      >
                        Valor Total:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        className="text-sm"
                      >
                        {formatCurrency(totalValueValue.toString())}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography
                      variant="caption"
                      className="text-xs text-beergam-typography-tertiary!"
                    >
                      Motivo:
                    </Typography>
                    <Typography variant="body2" className="text-xs truncate">
                      {movement.reason}
                    </Typography>
                  </Box>
                </Box>

                {/* Descrição expandível ou link */}
                {(movement.description || productLink) && (
                  <Box>
                    {movement.description && (
                      <IconButton
                        size="small"
                        onClick={() => handleToggleRow(movement.id)}
                        sx={{ p: 0.5 }}
                      >
                        <Svg.chevron
                          tailWindClasses={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                        <Typography
                          variant="caption"
                          className="text-xs text-beergam-typography-tertiary!"
                        >
                          {isExpanded ? "Ocultar" : "Ver"} descrição
                        </Typography>
                      </IconButton>
                    )}
                    {isExpanded && movement.description && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1.5,
                          bg: "beergam-section-background!",
                          rounded: "md",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 0.5, fontSize: "0.75rem" }}
                        >
                          Descrição:
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-xs text-beergam-typography-tertiary!"
                        >
                          {movement.description}
                        </Typography>
                      </Box>
                    )}
                    {productLink && (
                      <Link
                        to={productLink}
                        className="flex items-center gap-1 mt-1 text-xs text-beergam-blue-primary hover:underline"
                      >
                        <Svg.chevron tailWindClasses="h-3 w-3 rotate-270" />
                        <span>Ver detalhes do produto</span>
                      </Link>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
          );
        })}
      </div>

      {/* Paginação Desktop/Mobile unificada */}
      {pagination && totalPages > 1 && (
        <Box sx={{ mt: 2 }}>
          <PaginationBar
            page={pagination.page}
            totalPages={totalPages}
            totalCount={pagination.total}
            entityLabel="movimentações"
            onChange={(nextPage) => pagination.onPageChange?.(nextPage)}
            syncWithUrl={syncPageWithUrl}
          />
        </Box>
      )}
    </>
  );
}

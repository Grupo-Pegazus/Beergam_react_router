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
      ? { bg: "var(--color-beergam-green)", color: "var(--color-beergam-green-dark)" }
      : { bg: "var(--color-beergam-red)", color: "var(--color-beergam-red-dark)" };
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
        <Typography variant="body1" className="text-beergam-typography-secondary!">
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
      <div className="md:hidden flex flex-col gap-2 w-full min-w-0">
        {movements.map((movement) => {
          const isExpanded = expandedRows.has(movement.id);
          const typeColor = getModificationTypeColor(
            movement.modification_type
          );
          const unityCostValue = getUnityCostValue(movement.unity_cost);
          const totalValueValue = getTotalValue(movement.total_value);
          const productLink = getProductLink(movement);

          return (
            <Paper
              key={movement.id}
              variant="outlined"
              className="overflow-hidden w-full min-w-0"
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                  minWidth: 0,
                }}
              >
                {/* Linha 1: Chip + Data */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <Chip
                    label={movement.modification_type}
                    size="small"
                    sx={{
                      backgroundColor: typeColor.bg,
                      color: typeColor.color,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: 22,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    className="text-beergam-typography-tertiary! shrink-0 text-[11px]"
                  >
                    {formatDate(movement.created_at)}
                  </Typography>
                </div>

                {/* Produto/Variação - com truncate */}
                {(showProductColumn || showVariationColumn) && (
                  <div className="min-w-0 overflow-hidden">
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
                          <Typography
                            variant="body2"
                            title={`Variação #${variationId}${meta?.variation_sku || meta?.sku ? ` • SKU: ${meta?.variation_sku || meta?.sku}` : ""}`}
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "block",
                            }}
                          >
                            Variação #{variationId}
                            {(meta?.variation_sku || meta?.sku) && (
                              <span className="text-beergam-typography-tertiary!">
                                {" "}
                                · {meta?.variation_sku || meta?.sku}
                              </span>
                            )}
                          </Typography>
                        ) : null;
                      })()}
                    {showProductColumn && (
                      <Typography
                        variant="body2"
                        title={
                          movement.variation?.title || movement.product?.title || ""
                        }
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.8rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          mt: showVariationColumn ? 0.25 : 0,
                        }}
                      >
                        {movement.variation?.title ?? movement.product?.title ?? "—"}
                      </Typography>
                    )}
                  </div>
                )}

                {/* Métricas: Qtd | Custo | Valor */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 min-w-0">
                  <div>
                    <span className="text-[11px] text-beergam-typography-tertiary!">
                      Qtd:{" "}
                    </span>
                    <span className="text-sm font-semibold text-beergam-typography-primary!">
                      {formatNumber(movement.quantity)}
                    </span>
                  </div>
                  {unityCostValue !== null && (
                    <div>
                      <span className="text-[11px] text-beergam-typography-tertiary!">
                        Unit:{" "}
                      </span>
                      <span className="text-sm font-semibold text-beergam-typography-primary!">
                        {formatCurrency(unityCostValue.toString())}
                      </span>
                    </div>
                  )}
                  {totalValueValue !== null && (
                    <div>
                      <span className="text-[11px] text-beergam-typography-tertiary!">
                        Total:{" "}
                      </span>
                      <span className="text-sm font-semibold text-beergam-typography-primary!">
                        {formatCurrency(totalValueValue.toString())}
                      </span>
                    </div>
                  )}
                </div>

                {/* Motivo - truncate com title para ver completo */}
                <div className="min-w-0 overflow-hidden">
                  <Typography
                    variant="body2"
                    title={movement.reason}
                    sx={{
                      fontSize: "0.75rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      color: "var(--color-beergam-typography-secondary)",
                    }}
                  >
                    <span className="text-beergam-typography-tertiary!">
                      Motivo:{" "}
                    </span>
                    {movement.reason}
                  </Typography>
                </div>

                {/* Ações: expandir descrição + link produto */}
                {(movement.description || productLink) && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 border-t border-beergam-input-border/30">
                    {movement.description && (
                      <button
                        type="button"
                        onClick={() => handleToggleRow(movement.id)}
                        className="flex items-center gap-1 text-[11px] text-beergam-typography-tertiary! hover:text-beergam-primary active:opacity-80"
                      >
                        <Svg.chevron
                          tailWindClasses={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                        {isExpanded ? "Ocultar" : "Ver"} descrição
                      </button>
                    )}
                    {productLink && (
                      <Link
                        to={productLink}
                        className="flex items-center gap-1 text-[11px] text-beergam-typography-secondary! hover:underline active:opacity-80 min-w-0"
                      >
                        <Svg.chevron tailWindClasses="h-3 w-3 rotate-270 shrink-0" />
                        <span className="truncate">Ver produto</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* Descrição expandida */}
                {isExpanded && movement.description && (
                  <Box
                    sx={{
                      mt: 0.5,
                      p: 1.5,
                      backgroundColor: "var(--color-beergam-section-background)",
                      borderRadius: 1,
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
                      sx={{
                        fontSize: "0.8rem",
                        color: "var(--color-beergam-typography-secondary)",
                        wordBreak: "break-word",
                      }}
                    >
                      {movement.description}
                    </Typography>
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

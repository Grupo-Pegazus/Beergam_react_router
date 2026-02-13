import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { IncomingsBySkuSchemaType } from "~/features/invoicing/typings";
import type { Order } from "~/features/vendas/typings";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { Fields } from "~/src/components/utils/_fields";
import {
  ImageCensored,
  TextCensored,
  useCensorship
} from "~/src/components/utils/Censorship";
import type { TPREDEFINED_CENSORSHIP_KEYS } from "~/src/components/utils/Censorship/typings";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

type SortField = "margin" | "units" | "costs" | "revenue" | "average";

type HealthStatus = "Saudável" | "Apertado" | "Ruim" | "Crítico";

function parsePtBrNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  // Remove símbolos e mantém dígitos/sinais/separadores comuns.
  // Suporta formatos como: "1000.50", "1.000,50", "R$ 1.000,50", "-12,34"
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/%/g, "")
    .replace(/[^\d.,-]/g, "");

  // Se tem vírgula, assume pt-BR (vírgula decimal) e remove pontos de milhar
  if (cleaned.includes(",")) {
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number.parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  // Caso padrão (decimal com ponto)
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function getHealthStatus(marginPct: number): { status: HealthStatus; classes: string } {
  if (marginPct > 10) {
    return {
      status: "Saudável",
      classes: "bg-beergam-green-primary/20 text-beergam-green-primary",
    };
  }
  if (marginPct > 5 && marginPct <= 10) {
    return {
      status: "Apertado",
      classes: "bg-beergam-yellow/20 text-beergam-yellow",
    };
  }
  if (marginPct <= 5 && marginPct > 0) {
    return {
      status: "Ruim",
      classes: "bg-beergam-red/20 text-beergam-red",
    };
  }
  return {
    status: "Crítico",
    classes: "bg-beergam-orange/20 text-beergam-orange",
  };
}

function InfoCell({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`h-full min-w-0 grid content-end border-b border-b-beergam-primary pb-2 md:border-b-0 md:border-r md:pr-2 ${
        isLast ? "md:border-r-transparent" : "md:border-r-beergam-primary"
      }`}
    >
      <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary!">{label}</p>
      <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold wrap-break-word">{value}</h3>
    </div>
  );
}

export interface SkuProfitabilityListProps {
  /** Lista de orders para processar (modo legado) */
  orders?: Order[];
  /** Lista de dados já processados do hook useIncomingsBySku */
  incomingsBySku?: IncomingsBySkuSchemaType[];
  /** Quantidade máxima de SKUs na lista (default: 20) */
  maxItems?: number;
  /** Chave de censura (default: vendas_orders_list) */
  censorshipKey?: TPREDEFINED_CENSORSHIP_KEYS;
}

const ITEMS_PER_PAGE = 20;

export default function SkuProfitabilityList({
  orders,
  incomingsBySku,
  maxItems = 20,
  censorshipKey = "lucratividade_lucro_sku",
}: SkuProfitabilityListProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored(censorshipKey);
  
  const [page, setPage] = useState(1);
  const [skuFilter, setSkuFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("margin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const skuRows = useMemo(() => {
    // Se temos dados já processados do hook, usamos diretamente
    if (incomingsBySku && incomingsBySku.length > 0) {
      let rows = incomingsBySku.map((item) => {
        const { status, classes } = getHealthStatus(item.margin_pct);
        return {
          sku: item.sku,
          title: item.title,
          mlb: item.mlb,
          thumbnail: item.thumbnail,
          ordersCount: item.orders_count,
          units: item.units,
          avgProfitPerSale: item.avg_profit_per_unit,
          marginPct: item.margin_pct,
          totalProfit: item.total_profit,
          totalRevenue: item.total_revenue,
          internalCost: item.internal_cost,
          status,
          statusClasses: classes,
        };
      });

      // Aplica filtro por SKU
      if (skuFilter.trim()) {
        const filterLower = skuFilter.toLowerCase().trim();
        rows = rows.filter(
          (row) =>
            row.sku.toLowerCase().includes(filterLower) ||
            row.title?.toLowerCase().includes(filterLower)
        );
      }

      // Aplica ordenação pelo campo selecionado
      rows.sort((a, b) => {
        let valueA: number;
        let valueB: number;
        
        switch (sortField) {
          case "margin":
            valueA = a.marginPct;
            valueB = b.marginPct;
            break;
          case "units":
            valueA = a.units;
            valueB = b.units;
            break;
          case "costs":
            valueA = a.internalCost;
            valueB = b.internalCost;
            break;
          case "revenue":
            valueA = a.totalRevenue;
            valueB = b.totalRevenue;
            break;
          case "average":
            valueA = a.avgProfitPerSale;
            valueB = b.avgProfitPerSale;
            break;
          default:
            valueA = a.marginPct;
            valueB = b.marginPct;
        }
        
        if (sortOrder === "asc") {
          return valueA - valueB;
        }
        return valueB - valueA;
      });

      return rows;
    }

    // Modo legado: processa orders
    if (!orders || orders.length === 0) return [];

    type Acc = {
      sku: string;
      title?: string;
      mlb?: string;
      thumbnail?: string | null;
      ordersCount: number;
      units: number;
      sumProfit: number;
      sumRevenue: number;
      internalCost: number;
    };

    const map = new Map<string, Acc>();

    for (const order of orders) {
      const sku = (order.sku ?? "").trim();
      if (!sku) continue;

      const revenue = parsePtBrNumber(order.valor_liquido);
      const internalCost = parsePtBrNumber(order.price_cost);
      const profit = order.profit ?? 0;

      const qty = Number(order.quantity ?? 1) || 1;

      const current = map.get(sku);
      if (!current) {
        map.set(sku, {
          sku,
          title: order.title,
          mlb: order.mlb,
          thumbnail: order.thumbnail,
          ordersCount: 1,
          units: qty,
          sumProfit: profit,
          sumRevenue: revenue,
          internalCost: internalCost,
        });
      } else {
        current.ordersCount += 1;
        current.units += qty;
        current.sumProfit += profit;
        current.sumRevenue += revenue;
      }
    }

    const rows = Array.from(map.values()).map((acc) => {
      const avgProfitPerSale = acc.units > 0 ? acc.sumProfit / acc.units : 0;
      const marginPct = acc.sumRevenue > 0 ? (acc.sumProfit / acc.sumRevenue) * 100 : 0;
      const totalProfit = acc.sumProfit;
      const totalRevenue = acc.sumRevenue;
      const { status, classes } = getHealthStatus(marginPct);

      return {
        ...acc,
        avgProfitPerSale,
        marginPct,
        totalProfit,
        totalRevenue,
        status,
        statusClasses: classes,
      };
    });

    // Aplica ordenação pelo campo selecionado
    rows.sort((a, b) => {
      let valueA: number;
      let valueB: number;
      
      switch (sortField) {
        case "margin":
          valueA = a.marginPct;
          valueB = b.marginPct;
          break;
        case "units":
          valueA = a.units;
          valueB = b.units;
          break;
        case "costs":
          valueA = a.internalCost;
          valueB = b.internalCost;
          break;
        case "revenue":
          valueA = a.totalRevenue;
          valueB = b.totalRevenue;
          break;
        case "average":
          valueA = a.avgProfitPerSale;
          valueB = b.avgProfitPerSale;
          break;
        default:
          valueA = a.marginPct;
          valueB = b.marginPct;
      }
      
      if (sortOrder === "asc") {
        return valueA - valueB;
      }
      return valueB - valueA;
    });

    return rows.slice(0, maxItems);
  }, [orders, incomingsBySku, maxItems, skuFilter, sortField, sortOrder]);

  // Calcula paginação
  const totalItems = skuRows.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRows = skuRows.slice(startIndex, endIndex);

  // Reset página quando filtro ou ordenação mudar, ou quando página atual for maior que total
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1); // Reset para primeira página ao mudar ordenação
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
    setPage(1); // Reset para primeira página ao mudar campo de ordenação
  };

  const getSortFieldLabel = (field: SortField): string => {
    switch (field) {
      case "margin":
        return "Margem";
      case "units":
        return "Unidades";
      case "costs":
        return "Custos";
      case "revenue":
        return "Faturamento";
      case "average":
        return "Média";
      default:
        return "Margem";
    }
  };

  if (skuRows.length === 0 && !skuFilter) return null;

  return (
    <div className="grid gap-4 w-full min-w-0 overflow-hidden">
      {/* Filtros e controles */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <FilterSearchInput
            value={skuFilter}
            onChange={(value) => {
              setSkuFilter(value);
              setPage(1); // Reset para primeira página ao filtrar
            }}
            label="Filtrar por SKU"
            placeholder="Digite o SKU ou nome do produto..."
            fullWidth={true}
            widthType="full"
            className="bg-beergam-mui-paper!"
          />
        </div>
        <div className="flex flex-col md:row md:items-center gap-2">
          <Fields.select
            tailWindClasses="bg-beergam-mui-paper!"
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
            options={[
              { value: "margin", label: "Margem" },
              { value: "units", label: "Unidades" },
              { value: "costs", label: "Custos" },
              { value: "revenue", label: "Faturamento" },
              { value: "average", label: "Média" },
            ]}
            widthType="fit"
          />
          <Button
            variant="outlined"
            onClick={handleSortToggle}
            startIcon={
              sortOrder === "asc" ? (
                <Svg.arrow_trending_up tailWindClasses="h-4 w-4" />
              ) : (
                <Svg.arrow_trending_down tailWindClasses="h-4 w-4" />
              )
            }
            sx={{
              borderColor: "var(--color-beergam-primary)",
              color: "var(--color-beergam-primary)",
              "&:hover": {
                borderColor: "var(--color-beergam-primary)",
                backgroundColor: "var(--color-beergam-primary)",
                color: "var(--color-beergam-white)",
              },
            }}
          >
            {getSortFieldLabel(sortField)} {sortOrder === "asc" ? "Crescente" : "Decrescente"}
          </Button>
        </div>
      </div>

      {/* Lista de itens */}
      {paginatedRows.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-beergam-typography-secondary">
            {skuFilter ? "Nenhum SKU encontrado com o filtro aplicado." : "Nenhum item para exibir."}
          </p>
        </div>
      ) : (
        <div
          className="grid w-full min-w-0 overflow-x-auto gap-x-2 gap-y-2"
          style={{
            gridTemplateColumns:
              "minmax(140px, 2fr) repeat(8, minmax(85px, 1fr))",
          }}
        >
          {paginatedRows.map((row) => (
            <Paper
              key={row.sku}
              component="div"
              className="col-span-9 grid w-full min-w-0 overflow-hidden p-3 md:p-2"
              sx={{
                gridTemplateColumns: "subgrid",
                gridColumn: "1 / -1",
              }}
            >
              {/* Produto */}
              <div className="flex min-w-0 items-center gap-2 pr-4 md:pr-6">
                <ImageCensored
                  className="w-12! h-12! md:w-16! md:h-16! shrink-0"
                  censorshipKey={censorshipKey}
                >
                  <Thumbnail
                    thumbnail={row.thumbnail ?? ""}
                    tailWindClasses="w-12! h-12! md:w-16! md:h-16! shrink-0"
                  />
                </ImageCensored>

                <div className="min-w-[150px] md:min-w-0 flex-1 overflow-hidden">
                  <TextCensored forceCensor={censored} censorshipKey={censorshipKey}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      className="text-beergam-typography-primary! max-w-100 truncate text-xs md:text-sm lg:text-base"
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {censored ? "****" : row.title ?? "—"}
                    </Typography>
                  </TextCensored>
                  <TextCensored forceCensor={censored} censorshipKey={censorshipKey}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      className="text-beergam-typography-primary! text-xs md:text-sm"
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                        maxWidth: "100%",
                        display: "block",
                      }}
                    >
                      {censored ? "****" : row.sku}
                    </Typography>
                  </TextCensored>
                </div>
              </div>

              {/* Só pra nn deixar colado dos produtos, deixa mais bonito inclusive */}
              <div aria-hidden />

              {/* InfoCells - colunas alinhadas entre todas as linhas */}
              <InfoCell
                label="Unidades"
                value={censored ? "****" : row.units}
              />
              <InfoCell
                label="Custos Internos"
                value={
                  censored ? "****" : formatCurrency(row.internalCost, { money: true })
                }
              />
              <InfoCell
                label="Faturamento Total"
                value={
                  censored ? "****" : formatCurrency(row.totalRevenue, { money: true })
                }
              />
              <InfoCell
                label="Lucro Total"
                value={
                  censored
                    ? "****"
                    : formatCurrency(row.units * row.avgProfitPerSale, {
                        money: true,
                      })
                }
              />
              <InfoCell
                label="Média de lucro"
                value={
                  censored
                    ? "****"
                    : formatCurrency(row.avgProfitPerSale, { money: true })
                }
              />
              <InfoCell
                label="Média %"
                value={censored ? "*" : `${row.marginPct.toFixed(2)}%`}
              />
              <InfoCell
                label="Saúde"
                isLast
                value={
                  <span
                    className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[10px] font-semibold md:text-[12px] ${row.statusClasses}`}
                  >
                    {row.status}
                  </span>
                }
              />
            </Paper>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalItems}
          entityLabel="SKUs"
          onChange={(nextPage) => setPage(nextPage)}
        />
      )}
    </div>
  );
}
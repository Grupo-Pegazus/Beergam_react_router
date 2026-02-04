import { Button, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { IncomingsBySkuSchemaType } from "~/features/invoicing/typings";
import type { Order } from "~/features/vendas/typings";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import PaginationBar from "~/src/components/ui/PaginationBar";
import {
  CensorshipWrapper,
  ImageCensored,
  TextCensored,
  useCensorship,
} from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

type HealthStatus = "Saudável" | "Apertado" | "Ruim";

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
  if (marginPct > 20) {
    return {
      status: "Saudável",
      classes: "bg-beergam-green-primary/20 text-beergam-green-primary",
    };
  }
  if (marginPct >= 0) {
    return {
      status: "Apertado",
      classes: "bg-beergam-yellow/20 text-beergam-yellow",
    };
  }
  return {
    status: "Ruim",
    classes: "bg-beergam-red/20 text-beergam-red",
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
      className={`border-r h-full grid content-end pr-2 ${
        isLast ? "border-r-transparent" : "border-r-beergam-primary"
      }`}
    >
      <p className="text-[12px] text-beergam-typography-tertiary!">{label}</p>
      <h3 className="text-[18px]! text-beergam-primary font-bold">{value}</h3>
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
  censorshipKey?: "vendas_orders_list" | "vendas_orders_list_details";
}

const ITEMS_PER_PAGE = 20;

export default function SkuProfitabilityList({
  orders,
  incomingsBySku,
  maxItems = 20,
  censorshipKey = "vendas_orders_list",
}: SkuProfitabilityListProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored(censorshipKey);
  
  const [page, setPage] = useState(1);
  const [skuFilter, setSkuFilter] = useState("");
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

      // Aplica ordenação por margin_pct
      rows.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.marginPct - b.marginPct;
        }
        return b.marginPct - a.marginPct;
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
      const profit =
        revenue -
        parsePtBrNumber(order.price_cost) -
        parsePtBrNumber(order.packaging_cost) -
        parsePtBrNumber(order.extra_cost) -
        parsePtBrNumber(order.tax_amount);

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

    // Ordena por quantidade de unidades (mais vendidos primeiro)
    rows.sort((a, b) => b.units - a.units);

    return rows.slice(0, maxItems);
  }, [orders, incomingsBySku, maxItems, skuFilter, sortOrder]);

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

  if (skuRows.length === 0 && !skuFilter) return null;

  return (
    <div className="grid gap-4">
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
        <div className="flex items-center gap-2">
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
            Margem {sortOrder === "asc" ? "Crescente" : "Decrescente"}
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
        <div className="grid gap-2">
          {paginatedRows.map((row) => (
        <Paper
          key={row.sku}

        >
          <CensorshipWrapper censorshipKey={censorshipKey} canChange={false}>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Produto (estilo OrderItemCard / OrderCard) */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ImageCensored
                  className="w-12! h-12! md:w-16! md:h-16! shrink-0"
                  censorshipKey={censorshipKey}
                >
                  <Thumbnail
                    thumbnail={row.thumbnail ?? ""}
                    tailWindClasses="w-12! h-12! md:w-16! md:h-16! shrink-0"
                  />
                </ImageCensored>

                <div className="min-w-0 flex-1 overflow-hidden w-0">
                  <TextCensored forceCensor={censored} censorshipKey={censorshipKey}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      className="text-beergam-typography-primary! text-sm md:text-base max-w-[30ch]!"
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
                      className="text-beergam-typography-primary! text-sm md:text-base"
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

              {/* Infos (estilo SectionContent com bordas laranjas) */}
              <div className="grid grid-cols-6 gap-2 w-[800px] items-end">
                <InfoCell label="Unidades" value={censored ? "****" : row.units} />
                <InfoCell label="Custos Internos" value={censored ? "****" : formatCurrency(row.internalCost, { money: true })} />
                <InfoCell label="Faturamento Total" value={censored ? "****" : formatCurrency(row.totalRevenue, { money: true })} />
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
                      className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[12px] font-semibold ${row.statusClasses}`}
                    >
                      {row.status}
                    </span>
                  }
                />
              </div>
            </div>
          </CensorshipWrapper>
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
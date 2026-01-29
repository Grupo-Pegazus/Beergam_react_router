import { Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import type { Order } from "~/features/vendas/typings";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
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
        isLast ? "border-r-transparent" : "border-r-beergam-orange"
      }`}
    >
      <p className="text-[12px] text-beergam-typography-tertiary!">{label}</p>
      <h3 className="text-[18px]! text-beergam-primary font-bold">{value}</h3>
    </div>
  );
}

export interface SkuProfitabilityListProps {
  orders: Order[];
  /** Quantidade máxima de SKUs na lista (default: 20) */
  maxItems?: number;
  /** Chave de censura (default: vendas_orders_list) */
  censorshipKey?: "vendas_orders_list" | "vendas_orders_list_details";
}

export default function SkuProfitabilityList({
  orders,
  maxItems = 20,
  censorshipKey = "vendas_orders_list",
}: SkuProfitabilityListProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored(censorshipKey);

  const skuRows = useMemo(() => {
    type Acc = {
      sku: string;
      title?: string;
      mlb?: string;
      thumbnail?: string | null;
      ordersCount: number;
      units: number;
      sumProfit: number;
      sumRevenue: number;
    };

    const map = new Map<string, Acc>();

    for (const order of orders) {
      const sku = (order.sku ?? "").trim();
      if (!sku) continue;

      const revenue = parsePtBrNumber(order.valor_liquido);
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
  }, [orders, maxItems]);

  if (skuRows.length === 0) return null;

  return (
    <div className="grid gap-2">
      {skuRows.map((row) => (
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
              <div className="grid grid-cols-5 gap-2 w-[630px] items-end">
                <InfoCell label="Vendas" value={censored ? "****" : row.units} />
                <InfoCell label="Faturamento" value={censored ? "****" : formatCurrency(row.totalRevenue, { money: true })} />
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
  );
}
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useEffect, useMemo, useState } from "react";
import type { SkuMonthlySalesType } from "~/features/invoicing/typings";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { Fields } from "~/src/components/utils/_fields";
import { TextCensored } from "~/src/components/utils/Censorship";

interface SalesPerformanceTableProps {
  months: string[];
  skus: SkuMonthlySalesType[];
}

type SortField = "total" | string;

function formatMonthLabel(monthKey: string): string {
  return dayjs(monthKey).locale("pt-br").format("MMM/YY");
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const isUp = diff > 0;
  const isDown = diff < 0;

  const colorClass = isUp
    ? "bg-beergam-green-light text-beergam-green-primary"
    : isDown
      ? "bg-beergam-red-light text-beergam-red-primary"
      : "bg-beergam-gray/20 text-beergam-typography-secondary";

  return (
    <span className={`ml-1 inline-flex items-center rounded px-1 py-0.5 text-[9px] font-semibold ${colorClass}`}>
      {isUp ? "▲" : isDown ? "▼" : "—"} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function MonthCell({
  quantity,
  previousQuantity,
  isLast = false,
}: {
  quantity: number;
  previousQuantity?: number;
  isLast?: boolean;
}) {
  return (
    <div
      className={`h-full min-w-0 grid content-end border-b border-b-beergam-primary pb-2 md:border-b-0 md:border-r md:pr-2 ${
        isLast ? "md:border-r-transparent" : "md:border-r-beergam-primary"
      }`}
    >
      <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">
        {quantity}
        {previousQuantity !== undefined && (
          <TrendBadge current={quantity} previous={previousQuantity} />
        )}
      </h3>
      <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary!">un.</p>
    </div>
  );
}

function TotalCell({ total }: { total: number }) {
  return (
    <div className="h-full min-w-0 grid content-end border-b border-b-beergam-primary pb-2 md:border-b-0 md:border-r-transparent md:pr-2">
      <h3 className="text-[14px]! md:text-[18px]! text-beergam-primary font-bold">{total}</h3>
      <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary!">total</p>
    </div>
  );
}

const ITEMS_PER_PAGE = 20;

export default function SalesPerformanceTable({ months, skus }: SalesPerformanceTableProps) {
  const [skuFilter, setSkuFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const sortOptions = useMemo(() => {
    const opts = [{ value: "total", label: "Total" }];
    months.forEach((m) => opts.push({ value: m, label: formatMonthLabel(m) }));
    return opts;
  }, [months]);

  const filteredAndSorted = useMemo(() => {
    let rows = [...skus];

    if (skuFilter.trim()) {
      const lower = skuFilter.toLowerCase().trim();
      rows = rows.filter((r) => r.sku.toLowerCase().includes(lower));
    }

    rows.sort((a, b) => {
      const getValue = (row: SkuMonthlySalesType): number => {
        if (sortField === "total") return row.total_quantity;
        const entry = row.monthly_series.find((s) => s.month === sortField);
        return entry?.quantity ?? 0;
      };
      const diff = getValue(a) - getValue(b);
      return sortOrder === "asc" ? diff : -diff;
    });

    return rows;
  }, [skus, skuFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredAndSorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [totalPages, page]);

  if (skus.length === 0) return null;

  return (
    <div className="grid gap-4 w-full min-w-0 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <FilterSearchInput
            value={skuFilter}
            onChange={(v) => { setSkuFilter(v); setPage(1); }}
            label="Filtrar por SKU"
            placeholder="Digite o SKU..."
            fullWidth
            widthType="full"
            className="bg-beergam-mui-paper!"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Fields.select
            tailWindClasses="bg-beergam-mui-paper!"
            value={sortField}
            onChange={(e) => { setSortField(e.target.value as SortField); setPage(1); }}
            options={sortOptions}
            widthType="fit"
          />
          <Fields.select
            tailWindClasses="bg-beergam-mui-paper!"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as "asc" | "desc"); setPage(1); }}
            options={[
              { value: "desc", label: "Decrescente" },
              { value: "asc", label: "Crescente" },
            ]}
            widthType="fit"
          />
        </div>
      </div>

      {/* Cabeçalho das colunas */}
      <div
        className="grid w-full min-w-0 overflow-x-auto gap-x-2 px-3 md:px-2"
        style={{ gridTemplateColumns: `minmax(140px, 2fr) repeat(${months.length}, minmax(80px, 1fr)) minmax(80px, 1fr)` }}
      >
        <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary font-semibold uppercase">SKU</p>
        {months.map((m) => (
          <p key={m} className="text-[11px] md:text-[12px] text-beergam-typography-tertiary font-semibold uppercase">
            {formatMonthLabel(m)}
          </p>
        ))}
        <p className="text-[11px] md:text-[12px] text-beergam-typography-tertiary font-semibold uppercase">Total</p>
      </div>

      {paginatedRows.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-beergam-typography-secondary">
            {skuFilter ? "Nenhum SKU encontrado com o filtro aplicado." : "Nenhum dado encontrado."}
          </p>
        </div>
      ) : (
        <div
          className="grid w-full min-w-0 overflow-x-auto gap-x-2 gap-y-2"
          style={{ gridTemplateColumns: `minmax(140px, 2fr) repeat(${months.length}, minmax(80px, 1fr)) minmax(80px, 1fr)` }}
        >
          {paginatedRows.map((row) => (
            <Paper
              key={row.sku}
              component="div"
              className="grid w-full min-w-0 overflow-hidden p-3 md:p-2"
              sx={{
                gridTemplateColumns: "subgrid",
                gridColumn: "1 / -1",
              }}
            >
              {/* SKU */}
              <div className="flex min-w-0 items-center pr-4 md:pr-6">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <TextCensored censorshipKey="lucratividade_lucro_sku">
                    <p className="text-beergam-typography-primary! text-xs md:text-sm font-bold truncate">
                      {row.sku}
                    </p>
                  </TextCensored>
                  <p className="text-beergam-typography-tertiary! text-[10px]">{row.total_quantity} un. total</p>
                </div>
              </div>

              {/* Colunas por mês */}
              {months.map((m, idx) => {
                const entry = row.monthly_series.find((s) => s.month === m);
                const prevEntry = idx > 0 ? row.monthly_series.find((s) => s.month === months[idx - 1]) : undefined;
                return (
                  <MonthCell
                    key={m}
                    quantity={entry?.quantity ?? 0}
                    previousQuantity={prevEntry?.quantity}
                    isLast={false}
                  />
                );
              })}

              {/* Total */}
              <TotalCell total={row.total_quantity} />
            </Paper>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={filteredAndSorted.length}
          entityLabel="SKUs"
          onChange={(nextPage) => setPage(nextPage)}
        />
      )}
    </div>
  );
}

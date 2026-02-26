import { Collapse, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { useStockOverview } from "../../hooks";
import type { StockOverviewItem, StockOverviewVariation, StockTag } from "../../typings";
import ProductListSkeleton from "../ProductList/ProductListSkeleton";

// ─── Constantes ─────────────────────────────────────────────────────────────

const TAG_CONFIG: Record<StockTag, { label: string; classes: string }> = {
  acelerar_vendas: {
    label: "Acelerar Vendas",
    classes: "bg-beergam-green-primary/20 text-beergam-green-primary",
  },
  manter_vendas: {
    label: "Manter Vendas",
    classes: "bg-beergam-orange/20 text-beergam-orange",
  },
  diminuir_vendas: {
    label: "Diminuir Vendas",
    classes: "bg-beergam-red/20 text-beergam-red",
  },
  sem_vendas: {
    label: "Sem vendas",
    classes: "bg-beergam-gray/20 text-beergam-gray",
  },
  sem_controle_estoque: {
    label: "Controle de estoque desativado",
    classes: "bg-beergam-gray/20 text-beergam-gray",
  }
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: StockTag }) {
  const config = TAG_CONFIG[tag];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

function CoverageBar({ days }: { days: number | null }) {
  if (days === null) {
    return <span className="text-beergam-typography-tertiary text-xs">—</span>;
  }

  const limit = 90;
  const pct = Math.min((days / limit) * 100, 100);
  const barColor =
    days < 30
      ? "bg-beergam-red"
      : days <= 60
        ? "bg-beergam-orange"
        : "bg-beergam-green-primary";

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-xs font-semibold text-beergam-typography-primary">
        {Math.round(days)}d
      </span>
      <div className="h-1.5 w-full rounded-full bg-beergam-primary/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function VariationRow({ variation }: { variation: StockOverviewVariation }) {
  return (
    <Paper
      component="div"
      className="col-span-6 grid w-full min-w-0 overflow-hidden px-3 py-2 border-l-2 border-l-beergam-primary/30"
      sx={{
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
        backgroundColor: "var(--color-beergam-section-background)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2 pl-6">
        <div className="h-6 w-6 rounded bg-beergam-primary/10 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-beergam-typography-secondary truncate">
            {variation.title}
          </p>
          {variation.sku && (
            <p className="text-[10px] text-beergam-typography-tertiary! truncate">
              {variation.sku}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-xs text-beergam-typography-secondary">
          {variation.own_stock.toLocaleString("pt-BR")}
        </span>
      </div>

      <div className="flex items-center">
        <span className="text-xs text-beergam-typography-secondary">
          {variation.full_stock > 0
            ? variation.full_stock.toLocaleString("pt-BR")
            : "—"}
        </span>
      </div>

      <div className="flex items-center">
        <span className="text-xs text-beergam-typography-secondary">
          {variation.daily_avg_sales > 0
            ? `${variation.daily_avg_sales.toFixed(1)}/d`
            : "—"}
        </span>
      </div>

      <div className="flex items-center">
        <TagBadge tag={variation.tag} />
      </div>

      {/* coluna vazia para alinhar com o chevron da linha pai */}
      <div />
    </Paper>
  );
}

function ItemRow({ item }: { item: StockOverviewItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasVariations = item.has_variations && item.variations.length > 0;

  return (
    <>
      <Paper
        component="div"
        className="col-span-7 grid w-full min-w-0 overflow-hidden p-3 md:p-2"
        sx={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
      >
        <div className="flex min-w-0 items-center gap-3 pr-2">
          {hasVariations && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="shrink-0 text-beergam-typography-tertiary hover:text-beergam-primary transition-colors cursor-pointer"
              aria-label={expanded ? "Fechar variações" : "Ver variações"}
            >
              <span
                className={`block transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
              >
                <Svg.chevron tailWindClasses="h-4 w-4" />
              </span>
            </button>
          )}
          <div className="min-w-0 flex-1">
            <Link
              to={`/interno/produtos/estoque/${item.product_id}`}
              className="text-xs md:text-sm font-bold text-beergam-typography-primary hover:text-beergam-primary hover:underline truncate max-w-[200px] md:max-w-[280px] block"
            >
              {item.title}
            </Link>
            {item.sku && (
              <p className="text-[10px] text-beergam-typography-tertiary! truncate">
                {item.sku}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-semibold text-beergam-typography-primary">
            {item.stock.maximum}/{item.stock.minimum}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-semibold text-beergam-typography-primary">
            {item.stock.own.toLocaleString("pt-BR")}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-sm font-semibold text-beergam-typography-primary">
            {item.stock.full > 0
              ? item.stock.full.toLocaleString("pt-BR")
              : "—"}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-beergam-typography-secondary">
            {item.daily_avg_sales > 0
              ? `${item.daily_avg_sales.toFixed(1)}/d`
              : "—"}
          </span>
        </div>

        <div className="flex items-center">
          <TagBadge tag={item.tag} />
        </div>

        <div className="flex items-center">
          <CoverageBar days={item.coverage_days} />
        </div>
      </Paper>

      {hasVariations && (
        <div className="col-span-6" style={{ gridColumn: "1 / -1" }}>
          <Collapse in={expanded} unmountOnExit>
            <div
              className="grid gap-1 pb-1"
              style={{
                gridTemplateColumns:
                  "minmax(200px, 2.5fr) repeat(5, minmax(80px, 1fr))",
              }}
            >
              {item.variations.map((v) => (
                <VariationRow key={v.variation_id} variation={v} />
              ))}
            </div>
          </Collapse>
        </div>
      )}
    </>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function StockOverviewTable() {
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilter);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilter]);

  const { data, isLoading, error } = useStockOverview({
    page,
    per_page: 20,
    search: debouncedSearch.trim() || undefined,
  });

  if (isLoading) return <ProductListSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <Svg.x_circle tailWindClasses="h-10 w-10 text-beergam-red opacity-60" />
        <p className="text-beergam-typography-secondary text-sm">
          Não foi possível carregar o panorama de estoque.
        </p>
      </div>
    );
  }

  const items = data?.success ? (data.data?.items ?? []) : [];
  const pagination = data?.success ? data.data?.pagination : null;

  return (
    <div className="grid gap-4 w-full min-w-0 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <FilterSearchInput
            value={searchFilter}
            onChange={(v) => setSearchFilter(v)}
            label="Filtrar por SKU ou título"
            placeholder="Digite o SKU ou nome do produto..."
            fullWidth
            widthType="full"
            className="bg-beergam-mui-paper!"
          />
        </div>
        <p className="text-[11px] text-beergam-typography-tertiary! shrink-0">
          Tags calculadas com base nos últimos 30 dias de vendas
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Svg.box tailWindClasses="h-10 w-10 text-beergam-typography-tertiary opacity-40" />
          <p className="text-beergam-typography-secondary text-sm">
            {debouncedSearch
              ? "Nenhum produto encontrado com o filtro aplicado."
              : "Nenhum produto ativo encontrado."}
          </p>
        </div>
      ) : (
        <div
          className="grid w-full min-w-0 overflow-x-auto gap-x-2 gap-y-1"
          style={{
            gridTemplateColumns:
              "minmax(200px, 2.5fr) repeat(6, minmax(80px, 1fr))",
          }}
        >
          <div
            className="col-span-7 grid text-[10px] font-semibold text-beergam-typography-tertiary! uppercase tracking-wide px-3 pb-1"
            style={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
          >
            <span>Produto</span>
            <span>Estoque máximo/mínimo</span>
            <span>Estoque Próprio</span>
            <span>FULL</span>
            <span>Média/dia</span>
            <span>Tag</span>
            <span>Cobertura</span>
          </div>

          {items.map((item) => (
            <ItemRow key={item.product_id} item={item} />
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <PaginationBar
          page={page}
          totalPages={pagination.pages}
          totalCount={pagination.total}
          entityLabel="produtos"
          onChange={setPage}
        />
      )}
    </div>
  );
}

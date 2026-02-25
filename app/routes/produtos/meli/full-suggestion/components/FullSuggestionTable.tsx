import { Collapse, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { FullSuggestionItem, FullSuggestionResponse, FullSuggestionVariation } from "~/features/produtos/meli/full-suggestion/typings";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface FullSuggestionTableProps {
    data: FullSuggestionResponse;
    onChangePage: (page: number) => void;
}

type AbcClass = "A" | "B" | "C";

const ABC_COLOR: Record<AbcClass, string> = {
    A: "bg-beergam-green-primary/20 text-beergam-green-primary",
    B: "bg-beergam-orange/20 text-beergam-orange",
    C: "bg-beergam-gray/20 text-beergam-typography-secondary",
};

function AbcBadge({ abcClass }: { abcClass: AbcClass | null | undefined }) {
    if (!abcClass) return <span className="text-beergam-typography-tertiary text-xs">—</span>;
    return (
        <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${ABC_COLOR[abcClass]}`}>
            {abcClass}
        </span>
    );
}

function CoverageBar({ days, limit }: { days: number | null | undefined; limit: number }) {
    if (days === null || days === undefined) {
        return <span className="text-beergam-typography-tertiary text-xs">—</span>;
    }
    const pct = Math.min((days / limit) * 100, 100);
    const barColor = pct < 33 ? "bg-beergam-red" : pct < 66 ? "bg-beergam-orange" : "bg-beergam-green-primary";

    return (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-semibold text-beergam-typography-primary">{days}d</span>
            <div className="h-1.5 w-full rounded-full bg-beergam-primary/10 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

interface VariationRowProps {
    variation: FullSuggestionVariation;
    coverageDays: number;
}

function VariationRow({ variation, coverageDays }: VariationRowProps) {
    const attributeLabel = useMemo(() => {
        if (!variation.attributes?.length) return variation.sku ?? variation.variation_id;
        return variation.attributes
            .map((a) => `${a["name"] ?? ""}${a["value_name"] ? `: ${a["value_name"]}` : ""}`)
            .filter(Boolean)
            .join(" · ");
    }, [variation]);

    return (
        <Paper
            component="div"
            className="col-span-8 grid w-full min-w-0 overflow-hidden px-3 py-2 border-l-2 border-l-beergam-primary/30"
            sx={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1", backgroundColor: "var(--color-beergam-section-background)" }}
        >
            <div className="flex min-w-0 items-center gap-2 pl-6">
                <div className="min-w-0 flex-1">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <p className="text-[11px] text-beergam-typography-secondary truncate">{attributeLabel}</p>
                    </TextCensored>
                    {variation.sku && (
                        <TextCensored censorshipKey="full_suggestion_itens">
                            <p className="text-[10px] text-beergam-typography-tertiary! truncate">SKU: {variation.sku}</p>
                        </TextCensored>
                    )}
                </div>
            </div>

            <div className="flex items-center">
                <AbcBadge abcClass={null} />
            </div>

            <div className="flex items-center">
                <TextCensored censorshipKey="full_suggestion_itens">
                    <span className="text-xs text-beergam-typography-secondary">{variation.sales_in_period}</span>
                </TextCensored>
            </div>

            <div className="flex items-center">
                <TextCensored censorshipKey="full_suggestion_itens">
                    <span className="text-xs text-beergam-typography-secondary">{variation.daily_avg_sales.toFixed(1)}/d</span>
                </TextCensored>
            </div>

            <div className="flex items-center">
                <TextCensored censorshipKey="full_suggestion_itens">
                    <span className="text-xs font-semibold text-beergam-typography-primary">{variation.current_full_stock}</span>
                </TextCensored>
            </div>

            <div className="flex items-center">
                <CoverageBar days={variation.coverage_days_remaining} limit={coverageDays} />
            </div>

            <div className="flex items-center">
                <TextCensored censorshipKey="full_suggestion_itens">
                    <span className={`text-sm font-bold ${variation.suggested_quantity > 0 ? "text-beergam-green-primary" : "text-beergam-typography-tertiary"}`}>
                        {variation.suggested_quantity > 0 ? `+${variation.suggested_quantity}` : "—"}
                    </span>
                </TextCensored>
            </div>

            <div className="flex items-center">
                <TextCensored censorshipKey="full_suggestion_itens">
                    <span className="text-xs text-beergam-typography-secondary">
                        {variation.estimated_investment !== null && variation.estimated_investment !== undefined
                            ? formatCurrency(variation.estimated_investment)
                            : "—"}
                        {variation.investment_is_estimate && variation.estimated_investment !== null && (
                            <span className="text-[9px] text-beergam-typography-tertiary! ml-0.5">*</span>
                        )}
                    </span>
                </TextCensored>
            </div>
        </Paper>
    );
}

interface ItemRowProps {
    item: FullSuggestionItem;
    coverageDays: number;
}

function ItemRow({ item, coverageDays }: ItemRowProps) {
    const [expanded, setExpanded] = useState(false);
    const hasVariations = (item.variations?.length ?? 0) > 0;

    return (
        <>
            <Paper
                component="div"
                className="col-span-8 grid w-full min-w-0 overflow-hidden p-3 md:p-2"
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
                            <span className={`block transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>
                                <Svg.chevron tailWindClasses="h-4 w-4" />
                            </span>
                        </button>
                    )}
                    {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="h-9 w-9 rounded-lg object-cover shrink-0" />
                    ) : (
                        <div className="h-9 w-9 rounded-lg bg-beergam-primary/10 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                        <TextCensored censorshipKey="full_suggestion_itens">
                            <p className="text-xs md:text-sm font-bold text-beergam-typography-primary truncate max-w-[180px] md:max-w-[280px]">
                                {item.title}
                            </p>
                        </TextCensored>
                        <div className="flex items-center gap-2 flex-wrap">
                            <TextCensored censorshipKey="full_suggestion_itens">
                                <p className="text-[10px] text-beergam-typography-tertiary! truncate">{item.sku ?? item.mlb}</p>
                            </TextCensored>
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-beergam-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    ver no ML
                                </a>
                            )}
                            {!item.has_product && (
                                <span className="text-[9px] bg-beergam-orange/15 text-beergam-orange px-1.5 py-0.5 rounded font-medium">
                                    Sem cadastro
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <AbcBadge abcClass={item.abc_class as AbcClass | null | undefined} />
                </div>

                <div className="flex items-center">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <span className="text-sm font-semibold text-beergam-typography-primary">{item.sales_in_period}</span>
                    </TextCensored>
                </div>

                <div className="flex items-center">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <span className="text-xs text-beergam-typography-secondary">{item.daily_avg_sales.toFixed(1)}/d</span>
                    </TextCensored>
                </div>

                <div className="flex items-center">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <span className="text-sm font-bold text-beergam-typography-primary">{item.current_full_stock}</span>
                    </TextCensored>
                </div>

                <div className="flex items-center">
                    <CoverageBar days={item.coverage_days_remaining} limit={coverageDays} />
                </div>

                <div className="flex items-center">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <span className={`text-sm font-bold ${item.suggested_quantity > 0 ? "text-beergam-green-primary" : "text-beergam-typography-tertiary"}`}>
                            {item.suggested_quantity > 0 ? `+${item.suggested_quantity}` : "—"}
                        </span>
                    </TextCensored>
                </div>

                <div className="flex items-center">
                    <TextCensored censorshipKey="full_suggestion_itens">
                        <span className="text-xs text-beergam-typography-secondary">
                            {item.estimated_investment !== null && item.estimated_investment !== undefined
                                ? formatCurrency(item.estimated_investment)
                                : "—"}
                            {item.investment_is_estimate && item.estimated_investment !== null && (
                                <span className="text-[9px] text-beergam-typography-tertiary! ml-0.5">*</span>
                            )}
                        </span>
                    </TextCensored>
                </div>
            </Paper>

            {hasVariations && (
                <div className="col-span-8" style={{ gridColumn: "1 / -1" }}>
                    <Collapse in={expanded} unmountOnExit>
                        <div
                            className="grid gap-1 pb-1"
                            style={{ gridTemplateColumns: "minmax(220px, 2.5fr) 60px repeat(6, minmax(80px, 1fr))" }}
                        >
                            {item.variations!.map((variation) => (
                                <VariationRow key={variation.variation_id} variation={variation} coverageDays={coverageDays} />
                            ))}
                        </div>
                    </Collapse>
                </div>
            )}
        </>
    );
}

const ITEMS_PER_PAGE = 20;

export default function FullSuggestionTable({ data, onChangePage }: FullSuggestionTableProps) {
    const [searchFilter, setSearchFilter] = useState("");
    const [localPage, setLocalPage] = useState(1);

    const { items, pagination, summary } = data;
    const coverageDays = summary.coverage_days;

    const filteredItems = useMemo(() => {
        if (!searchFilter.trim()) return items;
        const lower = searchFilter.toLowerCase().trim();
        return items.filter(
            (item: FullSuggestionItem) =>
                (item.sku?.toLowerCase().includes(lower) ?? false) ||
                item.title.toLowerCase().includes(lower) ||
                item.mlb.toLowerCase().includes(lower),
        );
    }, [items, searchFilter]);

    const useServerPagination = !searchFilter.trim();

    const totalItems = useServerPagination ? pagination.total_count : filteredItems.length;
    const totalPages = useServerPagination ? pagination.total_pages : Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const currentPage = useServerPagination ? pagination.page : localPage;

    const displayItems = useServerPagination
        ? filteredItems
        : filteredItems.slice((localPage - 1) * ITEMS_PER_PAGE, localPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setLocalPage(1);
    }, [searchFilter]);

    const handlePageChange = (nextPage: number) => {
        if (useServerPagination) {
            onChangePage(nextPage);
        } else {
            setLocalPage(nextPage);
        }
    };

    return (
        <div className="grid gap-4 w-full min-w-0 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full md:max-w-md">
                    <FilterSearchInput
                        value={searchFilter}
                        onChange={(v) => { setSearchFilter(v); setLocalPage(1); }}
                        label="Filtrar por SKU ou título"
                        placeholder="Digite o SKU, MLB ou título do anúncio..."
                        fullWidth
                        widthType="full"
                        className="bg-beergam-mui-paper!"
                    />
                </div>
                <p className="text-[11px] text-beergam-typography-tertiary! shrink-0">
                    * investimento estimado a 50% do preço de venda
                </p>
            </div>

            {displayItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <Svg.box tailWindClasses="h-10 w-10 text-beergam-typography-tertiary opacity-40" />
                    <p className="text-beergam-typography-secondary text-sm">
                        {searchFilter ? "Nenhum anúncio encontrado com o filtro aplicado." : "Nenhum anúncio FULL encontrado."}
                    </p>
                </div>
            ) : (
                <div
                    className="grid w-full min-w-0 overflow-x-auto gap-x-2 gap-y-1"
                    style={{ gridTemplateColumns: "minmax(220px, 2.5fr) 60px repeat(6, minmax(80px, 1fr))" }}
                >
                    <div
                        className="col-span-8 grid text-[10px] font-semibold text-beergam-typography-tertiary! uppercase tracking-wide px-3 pb-1"
                        style={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
                    >
                        <span>Anúncio</span>
                        <span>ABC</span>
                        <span>Vendas</span>
                        <span>Média/dia</span>
                        <span>Estoque</span>
                        <span>Cobertura</span>
                        <span>Sugestão</span>
                        <span>Investimento</span>
                    </div>

                    {displayItems.map((item: FullSuggestionItem) => (
                        <ItemRow key={item.mlb} item={item} coverageDays={coverageDays} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <PaginationBar
                    page={currentPage}
                    totalPages={totalPages}
                    totalCount={totalItems}
                    entityLabel="anúncios"
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
}

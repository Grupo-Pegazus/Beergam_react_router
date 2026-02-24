import { Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { ABCCurveItem, ABCCurveResponse } from "~/features/financeiro/abc-curve/typings";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

interface ABCCurveSkuListProps {
    data: ABCCurveResponse;
    onChangePage: (page: number) => void;
}

function ClassBadge({ abcClass }: { abcClass: string }) {
    const colorMap: Record<string, string> = {
        A: "bg-beergam-green-primary/20 text-beergam-green-primary",
        B: "bg-beergam-orange/20 text-beergam-orange",
        C: "bg-beergam-gray/20 text-beergam-typography-secondary",
    };
    return (
        <span className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-semibold md:text-[12px] ${colorMap[abcClass] ?? colorMap.C}`}>
            Classe {abcClass}
        </span>
    );
}

function InfoCell({ label, value, isLast = false }: { label: string; value: React.ReactNode; isLast?: boolean }) {
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

const ITEMS_PER_PAGE = 20;

export default function ABCCurveSkuList({ data, onChangePage }: ABCCurveSkuListProps) {
    const [skuFilter, setSkuFilter] = useState("");
    const [localPage, setLocalPage] = useState(1);

    const items = data.items;
    const pagination = data.pagination;

    const filteredItems = useMemo(() => {
        if (!skuFilter.trim()) return items;
        const lower = skuFilter.toLowerCase().trim();
        return items.filter(
            (item: ABCCurveItem) =>
                item.sku.toLowerCase().includes(lower) ||
                (item.title?.toLowerCase().includes(lower) ?? false),
        );
    }, [items, skuFilter]);

    const useServerPagination = !skuFilter.trim();

    const totalItems = useServerPagination ? pagination.total_count : filteredItems.length;
    const totalPages = useServerPagination ? pagination.total_pages : Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const currentPage = useServerPagination ? pagination.page : localPage;

    const displayItems = useServerPagination
        ? filteredItems
        : filteredItems.slice((localPage - 1) * ITEMS_PER_PAGE, localPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setLocalPage(1);
    }, [skuFilter]);

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
                        value={skuFilter}
                        onChange={(v) => { setSkuFilter(v); setLocalPage(1); }}
                        label="Filtrar por SKU"
                        placeholder="Digite o SKU ou nome do produto..."
                        fullWidth
                        widthType="full"
                        className="bg-beergam-mui-paper!"
                    />
                </div>
            </div>

            {displayItems.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                    <p className="text-beergam-typography-secondary">
                        {skuFilter ? "Nenhum SKU encontrado com o filtro aplicado." : "Nenhum dado encontrado para os filtros selecionados."}
                    </p>
                </div>
            ) : (
                <div
                    className="grid w-full min-w-0 overflow-x-auto gap-x-2 gap-y-2"
                    style={{ gridTemplateColumns: "minmax(180px, 2fr) repeat(6, minmax(85px, 1fr))" }}
                >
                    {displayItems.map((item: ABCCurveItem) => (
                        <Paper
                            key={item.sku}
                            component="div"
                            className="col-span-7 grid w-full min-w-0 overflow-hidden p-3 md:p-2"
                            sx={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
                        >
                            <div className="flex min-w-0 items-center gap-3 pr-4 md:pr-6">
                                <ClassBadge abcClass={item.abc_class} />
                                <div className="min-w-[100px] md:min-w-0 flex-1 overflow-hidden">
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        <p className="text-beergam-typography-primary! max-w-100 truncate text-xs md:text-sm font-bold">
                                            {item.sku}
                                        </p>
                                    </TextCensored>
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        <p className="text-beergam-typography-secondary! truncate text-[11px] md:text-xs">
                                            {item.title ?? "—"}
                                        </p>
                                    </TextCensored>
                                </div>
                            </div>

                            <InfoCell
                                label="Produto"
                                value={
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        <span className="text-xs truncate block max-w-[120px]">
                                            {item.has_product && item.product?.title ? item.product.title : "—"}
                                        </span>
                                    </TextCensored>
                                }
                            />
                            <InfoCell
                                label="Faturamento"
                                value={
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        {formatCurrency(item.revenue)}
                                    </TextCensored>
                                }
                            />
                            <InfoCell
                                label="% Fatur."
                                value={
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        {(item.revenue_share * 100).toFixed(2)}%
                                    </TextCensored>
                                }
                            />
                            <InfoCell
                                label="% Acum."
                                value={
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        {(item.revenue_cumsum_share * 100).toFixed(2)}%
                                    </TextCensored>
                                }
                            />
                            <InfoCell
                                label="Unidades"
                                value={
                                    <TextCensored censorshipKey="curva_abc_skus">
                                        {item.units}
                                    </TextCensored>
                                }
                                isLast
                            />
                        </Paper>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <PaginationBar
                    page={currentPage}
                    totalPages={totalPages}
                    totalCount={totalItems}
                    entityLabel="SKUs"
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
}

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { StockDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../ProductImage/ProductImage";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import { BeergamAlert } from "~/src/components/ui/BeergamAlert";

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

interface LowStockProductsListProps {
  products: StockDashboardResponse["low_stock_products"];
  /** Quando true, a página é lida/escrita na URL. @default false */
  syncPageWithUrl?: boolean;
  /** Parâmetro de busca na URL quando syncPageWithUrl. @default "low_stock_page" */
  pageParamKey?: string;
}

export default function LowStockProductsList({
  products,
  syncPageWithUrl = false,
  pageParamKey = "low_stock_page",
}: LowStockProductsListProps) {
  if (products.length === 0) {
    return (
        <BeergamAlert
          severity="info"
        >
          <p className="text-beergam-typography-primary!">Nenhum produto com estoque baixo encontrado.</p>
        </BeergamAlert>
    );
  }

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [page, setPage] = useState(1);
  const { page: pageFromUrl } = usePageFromSearchParams({ paramKey: pageParamKey });
  const effectivePage = syncPageWithUrl ? pageFromUrl : page;

  const cardsPerPage = useMemo(() => {
    // Mantém sempre UMA linha por página, respeitando o número de colunas da grid
    if (isLgUp) return 3; // lg:grid-cols-3
    if (isSmUp) return 2; // sm:grid-cols-2
    if (isXs) return 1; // base:grid-cols-1
    return 2;
  }, [isLgUp, isSmUp, isXs]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * cardsPerPage;
    return products.slice(startIndex, startIndex + cardsPerPage);
  }, [page, products, cardsPerPage]);

  const totalPages = Math.max(1, Math.ceil(products.length / cardsPerPage));
  const totalCount = products.length;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <Stack spacing={2} id="low-stock-products-list">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => {
          const mainImageUrl =
            product.images?.product?.[0] ||
            product.variations?.[0]?.images?.product?.[0];
          const stockInfo = product.stock_info;
          const isLowStock = stockInfo.stock_status === "low";

          return (
            <Link
              key={product.product_id}
              to={`/interno/produtos/estoque/${product.product_id}`}
              className="block"
            >
              <MainCards className="hover:bg-beergam-primary-light/50 transition-colors h-full">
                <div className="flex items-start gap-3 p-4">
                  <ProductImage
                    imageUrl={mainImageUrl}
                    alt={product.title}
                    size="medium"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="truncate text-sm font-semibold text-beergam-typography-primary!">
                      {product.title}
                    </p>
                    {product.sku && (
                      <p className="text-xs text-beergam-typography-secondary!">
                        SKU: {product.sku}
                      </p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-beergam-typography-secondary!">
                          Estoque:
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            isLowStock ? "text-beergam-primary" : "text-beergam-typography-primary!"
                          }`}
                        >
                          {formatNumber(stockInfo.available_quantity)} /{" "}
                          {formatNumber(stockInfo.minimum_quantity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-beergam-typography-secondary!">
                          Valor em estoque:
                        </span>
                        <span className="text-sm font-semibold text-beergam-typography-primary!">
                          {formatCurrency(stockInfo.stock_value.toString())}
                        </span>
                      </div>
                    </div>
                    {isLowStock && (
                      <BeergamAlert
                        severity="warning"
                      >
                        <p className="text-beergam-typography-primary!">Estoque abaixo do mínimo</p>
                      </BeergamAlert>
                    )}
                  </div>
                </div>
              </MainCards>
            </Link>
          );
        })}
      </div>

      <PaginationBar
        page={Math.min(effectivePage, Math.max(1, totalPages))}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="produtos com estoque baixo"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="low-stock-products-list"
        syncWithUrl={syncPageWithUrl}
        pageParamKey={pageParamKey}
      />
    </Stack>
  );
}


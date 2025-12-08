import { Link } from "react-router";
import type { StockDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../ProductImage/ProductImage";
import Svg from "~/src/assets/svgs/_index";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

interface LowStockProductsListProps {
  products: StockDashboardResponse["low_stock_products"];
}

export default function LowStockProductsList({
  products,
}: LowStockProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center">
        <Svg.check_circle tailWindClasses="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-2 text-sm text-slate-500">
          Nenhum produto com estoque baixo encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
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
            <MainCards className="hover:bg-slate-50/50 transition-colors h-full">
              <div className="flex items-start gap-3 p-4">
                <ProductImage
                  imageUrl={mainImageUrl}
                  alt={product.title}
                  size="medium"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {product.title}
                  </p>
                  {product.sku && (
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Estoque:</span>
                      <span
                        className={`text-sm font-semibold ${
                          isLowStock ? "text-amber-600" : "text-slate-900"
                        }`}
                      >
                        {formatNumber(stockInfo.available_quantity)} /{" "}
                        {formatNumber(stockInfo.minimum_quantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        Valor em estoque:
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(stockInfo.stock_value.toString())}
                      </span>
                    </div>
                  </div>
                  {isLowStock && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 mt-2">
                      <p className="text-xs text-amber-700 flex items-center gap-1">
                        <Svg.warning_circle tailWindClasses="h-4 w-4 shrink-0" />
                        <span>Estoque abaixo do mínimo</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </MainCards>
          </Link>
        );
      })}
    </div>
  );
}

